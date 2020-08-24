import { tables } from './tables.js'

export default class TableauHelper {
    constructor(apiMethod) {
        //tableau create connector
        this.myConnector = tableau.makeConnector();

        this.myTables = {}
        var helper = this;

        //tableau init
        this.myConnector.init = function (initCallback) {
            tableau.log("init");
            tableau.authType = tableau.authTypeEnum.custom;
            initCallback();
        }

        //tableau get schema
        this.myConnector.getSchema = function (schemaCallback) {
            tableau.log("getSchema");
            var data = JSON.parse(tableau.connectionData);
            var chosenTables = []
            var idCounter = 1;
    
            // takes each custom table and grabs the corredponding template table data
            for (var table of data.tables) {
                var apiCall = table["apiCall"]
                var newTable = JSON.parse(JSON.stringify(tables[apiCall]));
                var id = "table" + idCounter;
                newTable["table"]["alias"] = table["title"];
                newTable["table"]["id"] = id;
                var idCounter = idCounter + 1;
    
                if ("requiredParameter" in table) {
                    var oldApiCall = newTable["path"];
                    var newApiCall = oldApiCall.replace("*", table["requiredParameter"]);
                    newTable["path"] = newApiCall;
                }
                helper.myTables[id] = newTable;
                chosenTables.push(newTable.table);
            }
            schemaCallback(chosenTables);
        };

        //tableau get data
        this.myConnector.getData = function (table, doneCallback) {
            tableau.log("getData");
            var data = JSON.parse(tableau.connectionData);
            var tableid = table.tableInfo.id;
            var path = helper.myTables[tableid].path;
            var apiCall = new URL(path, data.url);
            apiMethod(table, doneCallback, apiCall, helper.myTables, tableau.password);
        };

        //tableau connector registration
        tableau.registerConnector(this.myConnector);
    }

    getApiKey() {
        return tableau.password;
    }

    setApiKey(apiKey) {
        tableau.password = apiKey;
    }

    setConnectionData(data) {
        tableau.connectionData = data;
    }

    setConnectionName(name) {
        tableau.connectionName = name;
    }

    tableauSubmit() {
        tableau.submit();
    }

}