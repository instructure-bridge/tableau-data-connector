require('./main.css');
import { tables } from './tables.js'
import TableauHelper from './tableau.js'
import { setUrl, performApiCall } from './bridgeApi.js'

(function () {

    var tableauHelper = new TableauHelper(performApiCall);
    
    $(document).ready(function () {

        var addOption = function (name, value, selector) {
            var option = document.createElement("option");
            option.innerText = name;
            option.setAttribute("value", value);
            selector.appendChild(option);
        }

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

        var clearRequiredParameterOptions = function () {
            document.getElementById("requiredParameterSelector").innerHTML = "";
        }

        var showElement = function (id, isShow) {
            if (isShow) {
                document.getElementById(id).style.display = "";
            }
            else {
                document.getElementById(id).style.display = "none";
            }
        }

        addTableOptions(tables);

        var switchPage = function (start, end) {
            showElement(start, false);
            showElement(end, true);
        }

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

        var deleteTable = function (id) {
            var ulLength = $('#apiList li').length;
            $('#' + id).remove();
            for (var oldId = parseInt(id) + 1; oldId < ulLength; oldId++) {
                var newId = oldId - 1;
                $('#' + oldId + ' .deleteButton').attr('onclick', 'deleteTable(' + newId + ')');
                $('#' + oldId + ' .editButton').attr('onclick', 'editTable(' + newId + ')');
                document.getElementById(oldId).setAttribute("id", newId);
            }
            if ($('#apiList li').length <= 0) {
                showElement("emptyApiListMessage", true);
            }
        }

        // button for when the user is done choosing tables
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

        

        var getRequiredParameterData = function (apiCall, tableId) {
            const urlObj = setUrl(apiCall, $("#apiKey").val())
            $.ajax({
                url: urlObj.apiCall,
                type: "GET",
                headers: urlObj.headers,
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
                        getRequiredParameterData(result.meta.next, tableId);
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
                getRequiredParameterData(new URL(tables[api]["requiredParameter"]["path"], $("#url").val()), api);
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
                if (ulLength <= 0) {
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
                editButton.onclick = function () {
                    editTable(id);
                };

                var deleteButton = document.createElement("button");
                deleteButton.setAttribute("class", "btn btn-light mx-1 deleteButton");
                deleteButton.setAttribute("type", "button");
                deleteButton.innerText = "Delete";
                deleteButton.onclick = function () {
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
