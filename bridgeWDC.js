(function () {
    var myConnector = tableau.makeConnector();

    myConnector.init = function(initCallback) {
        tableau.authType = tableau.authTypeEnum.custom;
        initCallback();
    }

    myConnector.getSchema = function (schemaCallback) {
        var userCols = [
        {
            id: "id",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "first_name",
            dataType: tableau.dataTypeEnum.string
        }, 
        {
            id: "last_name",
            dataType: tableau.dataTypeEnum.string
        }];
    
        var tableSchema = {
            id: "authorUserApi",
            alias: "All User Data",
            columns: userCols
        };
    
        schemaCallback([tableSchema]);
    };

    myConnector.getData = function(table, doneCallback) {
        $.ajax({
            url: tableau.connectionData + "/api/author/users",
            type: "GET",
            headers: {
                "Authorization": tableau.password,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            success: function(result) {
                var users = result.users;
                var tableData = [];
                for (var i = 0, len = users.length; i < len; i++) {
                    tableData.push({
                        "id": users[i]["id"],
                        "first_name": users[i]["first_name"],
                        "last_name": users[i]["last_name"]
                    });
                }
                table.appendRows(tableData);
                doneCallback();
            }
        });
    };

    tableau.registerConnector(myConnector);

    $(document).ready(function () {
        $("#submitButton").click(function () {
            tableau.connectionData = $("#url").val();
            tableau.password = $("#apiKey").val();
            tableau.connectionName = "Bridge API";
            tableau.submit();
        });
    });
})();