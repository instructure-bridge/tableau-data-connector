// @ts-nocheck
import Axios from 'axios';

export function setUrl(apiCall, apiKey) {
    const parsedUrl = new URL(apiCall);
    const defaultHeaders = {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    var url;
    var devHeaders;

    if (process.env.NODE_ENV === "development") {
        // Address of webpack-dev-server
        url = new URL((parsedUrl.pathname + parsedUrl.search), 'http://localhost:8888')
        devHeaders = {
            "X-Forwarded-Proto": parsedUrl.protocol,
            "X-Forwarded-Host": parsedUrl.hostname,
            "X-Forwarded-Port": parsedUrl.port
        }
    } else {
        url = parsedUrl;
        devHeaders = {};
    }

    return {
        "apiCall": url,
        "headers": { ...defaultHeaders, ...devHeaders }
    }
}

export function addRow(table, myTables, result) {
    var tableid = table.tableInfo.id;
    var tableInfo = myTables[tableid];
    var data = result[tableInfo.data];
    var tableData = [];
    for (var i = 0, len = data.length; i < len; i++) {
        var row = {}
        for (var column of tableInfo.table.columns) {
            if ("linkedSource" in column) { //for data in linked sources
                var tableauId = column.id;

                var linkedSource = column.linkedSource;
                var linkedId = column.linkedId;
                var id = data[i]["links"][linkedSource]["id"];
                var linkedType = data[i]["links"][linkedSource]["type"];
                var typeTable = result["linked"][linkedType];
                var linkedData = typeTable.filter(function (data) {
                    return data.id === id;
                });
                if (linkedData.length == 1) {
                    row[tableauId] = linkedData[0][linkedId];
                }
                else {
                    row[tableauId] = null;
                }
            }
            else if ("parent_id" in column) {
                var id = column.id;
                var parentId = column.parent_id;
                var subId = column.sub_id;
                row[id] = data[i][parentId][subId];
            }
            else {
                var id = column.id;
                row[id] = data[i][id];
            }
        }
        tableData.push(row);
    }
    table.appendRows(tableData);
}

export function performApiCall(table, doneCallback, apiCall, myTables, apiKey) {
    const urlObj = setUrl(apiCall, apiKey);
    console.log(apiCall);
    Axios({
        method: 'get',
        url: urlObj.apiCall,
        headers: urlObj.headers
    })
    .then(function (response) {
        var result = response.data;
        addRow(table, myTables, result);
        if (result.meta.hasOwnProperty("next")) {
            performApiCall(table, doneCallback, result.meta.next, myTables, apiKey);
        }
        else {
            doneCallback();
        }
    })
    .catch(function (error) {
        console.log(error);
        doneCallback();
        //TODO: try to find some sort of way to report an error since the browser is already closed
    });
}
