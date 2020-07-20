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
            tableau.log(table);
            var apiCall = table["apiCall"]
            var newTable = JSON.parse(JSON.stringify(tables[apiCall]));
            id = "table" + idCounter;
            newTable["table"]["alias"] = table["title"];
            newTable["table"]["id"] = id;
            idCounter = idCounter + 1;
            myTables[id] = newTable;
            chosenTables.push(newTable.table);
        }
        tableau.log(myTables);
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
                        var id = column.id;
                        row[id] = data[i][id];
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
        var tableid = table.tableInfo.id
        tableau.log(tableid);
        var path = myTables[tableid].path
        var apiCall = data.url + path;
        performApiCall(table, doneCallback, apiCall);
    };

    tableau.registerConnector(myConnector);

    $(document).ready(function () {

        switchPage = function(start, end) {
            document.getElementById(start).style.display = "none";
            document.getElementById(end).style.display = "block";
        }

        editTable = function(id) {
            console.log("edit " + id)
            document.getElementById("tableName").value = $('#' + id + ' .title').text();
            document.getElementById("edit-section").setAttribute("currentTable", id);


            // switch to edit section
            switchPage("api-section", "edit-section");
        }

        deleteTable = function(id) {
            console.log("delete " + id)
            var ulLength = $('#apiList li').length;
            $('#' + id).remove();
            for (oldId = parseInt(id) + 1; oldId < ulLength; oldId++) {
                var newId = oldId - 1;
                console.log(newId);
                $('#' + oldId + ' .deleteButton').attr('onclick', 'deleteTable(' + newId + ')');
                $('#' + oldId + ' .editButton').attr('onclick', 'editTable(' + newId + ')');
                document.getElementById(oldId).setAttribute("id", newId);
            }
        }

        // button for when the user is done choosing tables
        $("#submitButton").click(function () {
            tableau.log("button pressed");
            var ul = document.getElementById("apiList");
            var items = ul.getElementsByTagName("li");
            var apiCalls = [];
            for (item of items) {
                var newTable = {
                    apiCall: item.getAttribute("data-api"),
                    title: item.getElementsByClassName("title")[0].innerText
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

        // button when starting to add a table
        $("#addButton").click(function () {
            var api = document.getElementById("apiSelector").value;
            document.getElementById("tableName").value = tables[api]["table"]["alias"];
            document.getElementById("edit-section").setAttribute("currentTable", $('#apiList li').length)
            // switch to edit section
            switchPage("api-section", "edit-section");
        });

        // button when done editing a table
        $("#editDoneButton").click(function () {
            //check if id exists to see if this is an edit or an add
            var id = document.getElementById("edit-section").getAttribute("currentTable");
            var ulLength = $('#apiList li').length;
            if (id < ulLength) {
                //editing table
                $('#' + id + ' .title').text(document.getElementById("tableName").value);
            }
            else {
                //adding table
                if ( ulLength <= 0 ) {
                    document.getElementById("emptyApiListMessage").style.display = "none";
                }
                var li = document.createElement("li");
                var api = document.getElementById("apiSelector").value;
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