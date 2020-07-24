(function () {
    var myConnector = tableau.makeConnector();

    // json table data, can be moved to a file
    var tables = {
        authorUser: {
            table: {
                id: "authorUser",
                alias: "All Users",
                columns: [{
                    alias: "User ID",
                    id: "id",
                    dataType: tableau.dataTypeEnum.int
                }, {
                    alias: "First Name",
                    id: "first_name",
                    dataType: tableau.dataTypeEnum.string
                }, {
                    alias: "Last Name",
                    id: "last_name",
                    dataType: tableau.dataTypeEnum.string
                }, {
                    alias: "Sortable Name",
                    id: "sortable_name",
                    dataType: tableau.dataTypeEnum.string
                }, {
                    alias: "Department",
                    id: "department",
                    dataType: tableau.dataTypeEnum.string
                }, {
                    alias: "Job Title",
                    id: "job_title",
                    dataType: tableau.dataTypeEnum.string
                }]
            },
            path: "/api/author/users",
            data: "users"
        },
        authorCourseTemplates: {
            table: {
                id: "authorCourseTemplates",
                alias: "All Courses",
                columns: [{
                    alias: "Course ID",
                    id: "id",
                    dataType: tableau.dataTypeEnum.int
                }, {
                    alias: "Course Title",
                    id: "title",
                    dataType: tableau.dataTypeEnum.string
                }, {
                    alias: "Is Published",
                    id: "is_published",
                    dataType: tableau.dataTypeEnum.bool
                }]
            },
            path: "/api/author/course_templates",
            data: "course_templates"
        },
        authorListEnrollments: {
            table: {
                id: "authorListEnrollments",
                alias: "Course Enrollments",
                columns: [{
                    alias: "Enrollment ID",
                    id: "id",
                    dataType: tableau.dataTypeEnum.int
                }, {
                    alias: "Score",
                    id: "score",
                    dataType: tableau.dataTypeEnum.int
                }, {
                    alias: "Is Required",
                    id: "required",
                    dataType: tableau.dataTypeEnum.bool
                },
                {
                    alias: "Name",
                    id: "name",
                    linkedSource: "learner",
                    linkedId: "name",
                    dataType: tableau.dataTypeEnum.bool
                },
                {
                    alias: "User ID",
                    id: "user_id",
                    linkedSource: "learner",
                    linkedId: "id",
                    dataType: tableau.dataTypeEnum.int
                }]
            },
            path: "/api/author/course_templates/*/enrollments",
            data: "enrollments",
            requiredParameter: {
                title: "Course",
                path: "/api/author/course_templates",
                data: "course_templates",
                nameCol: "title",
                valCol: "id"
            }
        },
        authorPrograms: {
            table: {
                id: "authorPrograms",
                alias: "All Programs",
                columns: [{
                    alias: "Program ID",
                    id: "id",
                    dataType: tableau.dataTypeEnum.int
                }, {
                    alias: "Program Title",
                    id: "title",
                    dataType: tableau.dataTypeEnum.string
                }, {
                    alias: "Course Count",
                    id: "course_count",
                    dataType: tableau.dataTypeEnum.int
                }, {
                    alias: "Unfinished Learners",
                    id: "unfinished_learners_count",
                    dataType: tableau.dataTypeEnum.int
                }, {
                    alias: "Is Published",
                    id: "is_published",
                    dataType: tableau.dataTypeEnum.bool
                }]
            },
            path: "/api/author/programs",
            data: "programs"
        }
    };

    // used to store the tables the user makes
    var myTables = {}

    myConnector.init = function (initCallback) {
        tableau.log("init");
        tableau.authType = tableau.authTypeEnum.custom;
        initCallback();
    }

    // takes each table the user chose and returns the table schema for each to tableau
    myConnector.getSchema = function (schemaCallback) {
        tableau.log("getSchema");
        var data = JSON.parse(tableau.connectionData);
        var chosenTables = []
        var idCounter = 1;

        // takes each custom table and grabs the corredponding template table data
        for (table of data.tables) {
            var apiCall = table["apiCall"]
            var newTable = JSON.parse(JSON.stringify(tables[apiCall]));
            id = "table" + idCounter;
            newTable["table"]["alias"] = table["title"];
            newTable["table"]["id"] = id;
            idCounter = idCounter + 1;

            if ("requiredParameter" in table) {
                var oldApiCall = newTable["path"];
                var newApiCall = oldApiCall.replace("*", table["requiredParameter"]);
                newTable["path"] = newApiCall;
            }
            myTables[id] = newTable;
            chosenTables.push(newTable.table);
        }
        schemaCallback(chosenTables);
    };

    // does an api call for a chosen table and repeats if necessary
    // look into changing because of possible stack overflow issues
    performApiCall = function (table, doneCallback, apiCall) {
        $.ajax({
            url: apiCall,
            type: "GET",
            headers: {
                "Authorization": tableau.password,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            success: function (result) {
                var tableid = table.tableInfo.id
                var tableInfo = myTables[tableid]
                var data = result[tableInfo.data];
                var tableData = [];
                for (var i = 0, len = data.length; i < len; i++) {
                    var row = {}
                    for (column of tableInfo.table.columns) {
                        if ("linkedSource" in column) { //for data in linked sources
                            var tableauId = column.id;
                            
                            var linkedSource = column.linkedSource;
                            var linkedId = column.linkedId;
                            var id = data[i]["links"][linkedSource]["id"];
                            var linkedType = data[i]["links"][linkedSource]["type"];
                            var typeTable = result["linked"][linkedType];
                            var linkedData = typeTable.filter(function(data) {
                                return data.id === id;
                            });
                            if (linkedData.length == 1)
                            {
                                row[tableauId] = linkedData[0][linkedId];
                            }
                            else {
                                row[tableauId] = null;
                            }
                        }
                        else {
                            var id = column.id;
                            row[id] = data[i][id];
                        }
                    }
                    tableData.push(row);
                }
                table.appendRows(tableData);
                if (result.meta.hasOwnProperty("next")) {
                    //temp solution for local proxy, else statement is all the normal web connector would need
                    var connectionData = JSON.parse(tableau.connectionData);
                    if (connectionData.url.startsWith("http://localhost:")) {
                        var next = result.meta.next.substring(8);
                        next = next.substring(next.indexOf("/"));
                        var newUrl = connectionData.url + next;
                        performApiCall(table, doneCallback, newUrl);
                    }
                    else {
                        performApiCall(table, doneCallback, result.meta.next);
                    }
                }
                else {
                    doneCallback();
                }
            }
        });
    }

    // called for each table, basically calls the api and fills out the table
    myConnector.getData = function (table, doneCallback) {
        tableau.log("getData");
        var data = JSON.parse(tableau.connectionData);
        var tableid = table.tableInfo.id;
        var path = myTables[tableid].path;
        var apiCall = data.url + path;
        performApiCall(table, doneCallback, apiCall);
    };

    tableau.registerConnector(myConnector);

    $(document).ready(function () {

        addOption = function(name, value, selector) {
            var option = document.createElement("option");
            option.innerText = name;
            option.setAttribute("value", value);
            selector.appendChild(option);
        }

        addTableOptions = function(availableTables) {
            var selector = document.getElementById("apiSelector");
            for (var table in availableTables) {
                if (availableTables.hasOwnProperty(table)) {
                    var name = availableTables[table]["table"]["alias"];
                    var value = availableTables[table]["table"]["id"];
                    addOption(name, value, selector);
                } 
            }     
        }

        clearRequiredParameterOptions = function() {
            document.getElementById("requiredParameterSelector").innerHTML = "";
        }

        showElement = function(id, isShow) {
            if (isShow) {
                document.getElementById(id).style.display = "";
            }
            else {
                document.getElementById(id).style.display = "none";
            }
        }

        addTableOptions(tables);

        switchPage = function(start, end) {
            showElement(start, false);
            showElement(end, true);
        }

        showLoading = function(isLoading) {
            if (isLoading) {
                document.getElementById("addButton").disabled = true;
                document.getElementById("addButton").innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Loading...</span>';
            }
            else {
                document.getElementById("addButton").disabled = false;
                document.getElementById("addButton").innerHTML = "Add";
            }
        }

        editTable = function(id) {
            document.getElementById("tableName").value = $('#' + id + ' .title').text();
            document.getElementById("edit-section").setAttribute("currentTable", id);
            var api = document.getElementById(id).getAttribute("data-api");

            if ("requiredParameter" in tables[api]) {
                clearRequiredParameterOptions();
                showElement("requiredParameter", true);
                document.getElementById("requiredParameterTitle").innerText = tables[api]["requiredParameter"]["title"];
                getRequiredParameterData($("#url").val() + tables[api]["requiredParameter"]["path"], api);
            }
            else {
                showElement("requiredParameter", false);
                // switch to edit section
                switchPage("api-section", "edit-section");
            }
        }

        deleteTable = function(id) {
            var ulLength = $('#apiList li').length;
            $('#' + id).remove();
            for (oldId = parseInt(id) + 1; oldId < ulLength; oldId++) {
                var newId = oldId - 1;
                $('#' + oldId + ' .deleteButton').attr('onclick', 'deleteTable(' + newId + ')');
                $('#' + oldId + ' .editButton').attr('onclick', 'editTable(' + newId + ')');
                document.getElementById(oldId).setAttribute("id", newId);
            }
            if ( $('#apiList li').length <= 0 ) {
                showElement("emptyApiListMessage", true);
            }
        }

        // button for when the user is done choosing tables
        $("#submitButton").click(function () {
            var ul = document.getElementById("apiList");
            var items = ul.getElementsByTagName("li");
            var apiCalls = [];
            for (item of items) {

                var newTable = {
                    apiCall: item.getAttribute("data-api"),
                    title: item.getElementsByClassName("title")[0].innerText
                }
                if (item.hasAttribute("data-require")) {
                    newTable["requiredParameter"] = item.getAttribute("data-require");
                }
                apiCalls.push(newTable);
            }
            var data = {
                url: $("#url").val(),
                tables: apiCalls
            }
            tableau.connectionData = JSON.stringify(data);
            tableau.password = $("#apiKey").val();
            tableau.connectionName = "Bridge API";
            tableau.submit();
        });

        getRequiredParameterData = function(apiCall, tableId) {
            $.ajax({
                url: apiCall,
                type: "GET",
                headers: {
                    "Authorization": $("#apiKey").val(),
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                success: function (result) {
                    var tableInfo = tables[tableId]
                    var data = result[tableInfo["requiredParameter"]["data"]];
                    var nameCol = tableInfo["requiredParameter"]["nameCol"];
                    var valCol = tableInfo["requiredParameter"]["valCol"];
                    var selector = document.getElementById("requiredParameterSelector");
                    for (var i = 0, len = data.length; i < len; i++) {
                        addOption(data[i][nameCol], data[i][valCol], selector);
                    }
                    if (result.meta.hasOwnProperty("next")) {
                        var connectionURL = $("#url").val()
                        //temp solution for local proxy, else statement is all the normal web connector would need
                        if (connectionURL.startsWith("http://localhost:")) {
                            var next = result.meta.next.substring(8);
                            next = next.substring(next.indexOf("/"));
                            var newUrl = connectionURL + next;
                            getRequiredParameterData(newUrl, tableId);
                        }
                        else {
                            getRequiredParameterData(result.meta.next, tableId);
                        }
                    }
                    else {
                        switchPage("api-section", "edit-section");
                        showLoading(false);
                    }
                }
            });
        }

        // button when starting to add a table
        $("#addButton").click(function () {
            var api = document.getElementById("apiSelector").value;
            document.getElementById("tableName").value = tables[api]["table"]["alias"];
            document.getElementById("edit-section").setAttribute("currentTable", $('#apiList li').length)
            if ("requiredParameter" in tables[api]) {
                showLoading(true);
                clearRequiredParameterOptions();
                showElement("requiredParameter", true);
                document.getElementById("requiredParameterTitle").innerText = tables[api]["requiredParameter"]["title"];
                getRequiredParameterData($("#url").val() + tables[api]["requiredParameter"]["path"], api);
            }
            else {
                showElement("requiredParameter", false);
                // switch to edit section
                switchPage("api-section", "edit-section");
            }
        });

        // button when done editing a table
        $("#editDoneButton").click(function () {
            //check if id exists to see if this is an edit or an add
            var id = document.getElementById("edit-section").getAttribute("currentTable");
            var ulLength = $('#apiList li').length;
            if (id < ulLength) {
                //editing table
                $('#' + id + ' .title').text(document.getElementById("tableName").value);
                var api = document.getElementById("apiSelector").value;

                if ("requiredParameter" in tables[api]) {
                    var requiredParameter = document.getElementById("requiredParameterSelector").value;
                    document.getElementById(id).setAttribute("data-require", requiredParameter);
                }
            }
            else {
                //adding table
                if ( ulLength <= 0 ) {
                    showElement("emptyApiListMessage", false);
                }
                var li = document.createElement("li");
                var api = document.getElementById("apiSelector").value;

                if ("requiredParameter" in tables[api]) {
                    var requiredParameter = document.getElementById("requiredParameterSelector").value;
                    li.setAttribute("data-require", requiredParameter);
                }
                li.setAttribute("data-api", api);
                li.setAttribute("class", "list-group-item");
                li.setAttribute("id", id);
                var title = document.createElement("div");
                title.setAttribute("class", "title");
                title.innerText = document.getElementById("tableName").value;
                
                var editButton = document.createElement("button");
                editButton.setAttribute("class", "btn btn-light mx-1 editButton");
                editButton.setAttribute("type", "button");
                editButton.innerText = "Edit";
                editButton.onclick = function() {
                    editTable(id);
                };

                var deleteButton = document.createElement("button");
                deleteButton.setAttribute("class", "btn btn-light mx-1 deleteButton");
                deleteButton.setAttribute("type", "button");
                deleteButton.innerText = "Delete";
                deleteButton.onclick = function() {
                    deleteTable(id);
                };

                var buttonHolder = document.createElement("span");

                buttonHolder.appendChild(editButton);
                buttonHolder.appendChild(deleteButton);

                var column1 = document.createElement('div');
                column1.setAttribute("class", "col titleColumn");

                var column2 = document.createElement('div');
                column2.setAttribute("class", "col-xs-auto");

                var row = document.createElement('div');
                row.setAttribute("class", "row");

                column1.appendChild(title);
                column2.appendChild(buttonHolder);
                row.appendChild(column1);
                row.appendChild(column2);
                li.appendChild(row);
                document.getElementById("apiList").appendChild(li);
            }
            //parameters

            // switch back to api section
            switchPage("edit-section", "api-section");
        });

        // button to go back to page for entering the url and api key
        $("#resetButton").click(function () {
            switchPage("api-section", "url-section");
        });

        // button to go from credentials section to api section
        $("#credentialsButton").click(function () {
            switchPage("url-section", "api-section");
        });

        // button to add a parameter to a api call in the edit section
        $("#addParameterButton").click(function () {
            
        });
    });
})();