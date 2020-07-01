(function () {
    var myConnector = tableau.makeConnector();

    var tables = {
        authorUser: {
            table: {
                id: "authorUser",
                alias: "All User Data",
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

    myConnector.init = function (initCallback) {
        tableau.log("init");
        tableau.authType = tableau.authTypeEnum.custom;
        initCallback();
    }

    myConnector.getSchema = function (schemaCallback) {
        tableau.log("getSchema");

        var data = JSON.parse(tableau.connectionData);

        var chosenTables = []
        for (table of data.tables) {
            tableau.log(table);
            chosenTables.push(tables[table].table)
        }
        schemaCallback(chosenTables);
    };

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
                var tableInfo = tables[tableid]
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

    myConnector.getData = function (table, doneCallback) {
        tableau.log("getData");
        var data = JSON.parse(tableau.connectionData);
        var tableid = table.tableInfo.id
        var path = tables[tableid].path
        var apiCall = data.url + path;
        performApiCall(table, doneCallback, apiCall);
    };

    tableau.registerConnector(myConnector);

    $(document).ready(function () {
        $("#submitButton").click(function () {
            tableau.log("button pressed");
            var data = {
                url: $("#url").val(),
                tables: ["authorUser", "authorPrograms", "authorCourseTemplates"]
            }
            tableau.connectionData = JSON.stringify(data);
            tableau.password = $("#apiKey").val();
            tableau.connectionName = "Bridge API";
            tableau.submit();
        });
    });
})();