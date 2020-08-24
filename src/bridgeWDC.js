require('./main.css');
import { tables } from './tables.js'
import TableauHelper from './tableau.js'
import { setUrl, performApiCall } from './bridgeApi.js'
import Axios from 'axios';

//class containing tableau specific code
var tableauHelper = new TableauHelper(performApiCall);

//runs these functions on page load
$(document).ready(function () {

    //function to add an option to a dropdown
    var addOption = function (name, value, selector) {
        var option = document.createElement("option");
        option.innerText = name;
        option.setAttribute("value", value);
        selector.appendChild(option);
    }

    //function to add table options to the api selector
    var addTableOptions = function (availableTables) {
        var selector = document.getElementById("apiSelector");
        for (var table in availableTables) {
            if (availableTables.hasOwnProperty(table)) {
                var name = availableTables[table]["table"]["alias"];
                var value = availableTables[table]["table"]["id"];
                addOption(name, value, selector);
            }
        }
    }

    //function for clearing the required parameter selector options
    var clearRequiredParameterOptions = function () {
        document.getElementById("requiredParameterSelector").innerHTML = "";
    }

    //function for showing and hiding elements
    var showElement = function (id, isShow) {
        if (isShow) {
            document.getElementById(id).style.display = "";
        }
        else {
            document.getElementById(id).style.display = "none";
        }
    }

    //function for switching between pages
    var switchPage = function (start, end) {
        showElement(start, false);
        showElement(end, true);
    }

    //function for showing the loading icon for the required parameter fethcing
    var showLoading = function (isLoading) {
        if (isLoading) {
            document.getElementById("addButton").disabled = true;
            document.getElementById("addButton").innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Loading...</span>';
        }
        else {
            document.getElementById("addButton").disabled = false;
            document.getElementById("addButton").innerHTML = "Add";
        }
    }

    //function for edit button action
    var editTable = function (id) {
        document.getElementById("tableName").value = $('#' + id + ' .title').text();
        document.getElementById("edit-section").setAttribute("currentTable", id);
        var api = document.getElementById(id).getAttribute("data-api");

        if ("requiredParameter" in tables[api]) {
            clearRequiredParameterOptions();
            showElement("requiredParameter", true);
            document.getElementById("requiredParameterTitle").innerText = tables[api]["requiredParameter"]["title"];
            getRequiredParameterData(new URL(tables[api]["requiredParameter"]["path"], $("#url").val()), api);
        }
        else {
            showElement("requiredParameter", false);
            // switch to edit section
            switchPage("api-section", "edit-section");
        }
    }

    window.editTable = editTable;

    //function for delete button action
    var deleteTable = function (id) {
        var ulLength = $('#apiList li').length;
        $('#' + id).remove();
        console.log(`deleted:${id}`);
        for (var oldId = parseInt(id) + 1; oldId < ulLength; oldId++) {
            var newId = oldId - 1;
            console.log(`oldId:${oldId}; newId:${newId}`);
            // $('#' + oldId + ' .deleteButton').off('click');
            // $('#' + oldId + ' .deleteButton').click(function(){
            //     deleteTable(newId);
            // });
            $('#' + oldId + ' .deleteButton').attr('onclick', 'deleteTable(' + newId + ')');
            $('#' + oldId + ' .editButton').attr('onclick', 'editTable(' + newId + ')');
            document.getElementById(oldId).setAttribute("id", newId);
        }
        if ($('#apiList li').length <= 0) {
            showElement("emptyApiListMessage", true);
        }
    }

    window.deleteTable = deleteTable;

    //button for when the user is done choosing tables
    $("#submitButton").click(function () {
        var ul = document.getElementById("apiList");
        var items = ul.getElementsByTagName("li");
        var apiCalls = [];
        for (var item of items) {
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
        tableauHelper.setConnectionData(JSON.stringify(data));
        tableauHelper.setApiKey($("#apiKey").val());
        tableauHelper.setConnectionName("Bridge API");
        tableauHelper.tableauSubmit();
    });

    //performs api call to grab data for required parameters
    var getRequiredParameterData = function (apiCall, tableId, apiKey) {
        const urlObj = setUrl(apiCall, apiKey)

        Axios({
            method: 'get',
            url: urlObj.apiCall,
            headers: urlObj.headers    
        })
        .then(function (response) {
            var result = response.data;
            var tableInfo = tables[tableId]
            var data = result[tableInfo["requiredParameter"]["data"]];
            var nameCol = tableInfo["requiredParameter"]["nameCol"];
            var valCol = tableInfo["requiredParameter"]["valCol"];
            var selector = document.getElementById("requiredParameterSelector");
            for (var i = 0, len = data.length; i < len; i++) {
                addOption(data[i][nameCol], data[i][valCol], selector);
            }
            if (result.meta.hasOwnProperty("next")) {
                getRequiredParameterData(result.meta.next, tableId, apiKey);
            }
            else {
                switchPage("api-section", "edit-section");
                showLoading(false);
            }
        })
        .catch(function (error) {
            console.log(error);
            showLoading(false);
            //TODO: change cause tableau desktop doesn't support alerts
            alert('Could not fetch course data, check that the url and api key are correct.');
        });
    }

    // button when starting to add a table
    $("#addButton").click(function () {
        var api = document.getElementById("apiSelector").value;
        document.getElementById("tableName").value = tables[api]["table"]["alias"];
        document.getElementById("edit-section").setAttribute("currentTable", $('#apiList li').length)
        if ("requiredParameter" in tables[api]) { //if the api call requires a parameter
            showLoading(true);
            clearRequiredParameterOptions();
            showElement("requiredParameter", true);
            document.getElementById("requiredParameterTitle").innerText = tables[api]["requiredParameter"]["title"];
            getRequiredParameterData(new URL(tables[api]["requiredParameter"]["path"], $("#url").val()), api, $("#apiKey").val());
        }
        else { //if the api call does not require a parameter
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
        if (id < ulLength) { //editing table entry

            $('#' + id + ' .title').text(document.getElementById("tableName").value);
            var api = document.getElementById("apiSelector").value;

            if ("requiredParameter" in tables[api]) {
                var requiredParameter = document.getElementById("requiredParameterSelector").value;
                document.getElementById(id).setAttribute("data-require", requiredParameter);
            }
        }
        else { //adding table entry

            //remove empty list message when adding first entry
            if (ulLength <= 0) {
                showElement("emptyApiListMessage", false);
            }

            //create entry
            var li = document.createElement("li");
            var api = document.getElementById("apiSelector").value;
            li.setAttribute("data-api", api);
            li.setAttribute("class", "list-group-item");
            li.setAttribute("id", id);
            if ("requiredParameter" in tables[api]) { //get required parameter if necessary
                var requiredParameter = document.getElementById("requiredParameterSelector").value;
                li.setAttribute("data-require", requiredParameter);
            }

            //create title
            var title = document.createElement("div");
            title.setAttribute("class", "title");
            title.innerText = document.getElementById("tableName").value;

            //create edit button
            var editButton = document.createElement("button");
            editButton.setAttribute("class", "btn btn-light mx-1 editButton");
            editButton.setAttribute("type", "button");
            editButton.innerText = "Edit";
            // editButton.onclick = function () {
            //     editTable(id);
            // };

            //create delete button
            var deleteButton = document.createElement("button");
            deleteButton.setAttribute("class", "btn btn-light mx-1 deleteButton");
            deleteButton.setAttribute("type", "button");
            deleteButton.innerText = "Delete";
            // deleteButton.onclick = function () {
            //     deleteTable(id);
            // };

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

            $('#' + id + ' .deleteButton').attr('onclick', 'deleteTable(' + id + ')');
            $('#' + id + ' .editButton').attr('onclick', 'editTable(' + id + ')');
        }
        //parameters todo

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

    addTableOptions(tables);
});
