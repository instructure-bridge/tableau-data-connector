// @ts-nocheck
import { tables } from './tables/api/author';
import TableauHelper from './tableau';
import { setUrl, performApiCall } from './bridgeApi';
import Axios from 'axios';

//class containing tableau specific code
var tableauHelper = new TableauHelper(performApiCall);
var errorMessage = 'Could not fetch course data. Check that the url and api key are correct.';

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
        var selector = $("#apiSelector")[0];
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
        $("#requiredParameterSelector").html("");
    }

    //function for showing and hiding elements
    var showElement = function (id, isShow) {
        if (isShow) {
            $(`#${id}`).css('display', '');
        }
        else {
            $(`#${id}`).css('display', 'none');
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
            $("#addButton").prop('disabled', true);
            $("#addButton").html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Loading...</span>');
        }
        else {
            $("#addButton").prop('disabled', false);
            $("#addButton").html("Add");
        }
    }

    var showErrorMessage = function(text, timeout) {
        $("#errorText").html(text);
        showElement("errorCard", true);
        setTimeout(function() {
            showElement("errorCard", false);
            $("#errorText").html("");
        }, (timeout * 1000));
    }

    //function for edit button action
    var editTable = function (id) {
        $("#tableName").val($('#' + id + ' .title').text());
        $("#edit-section").attr("currentTable", id);
        var api = $(`#${id}`).attr("data-api");
        var requiredParameter = $(`#${id}`).attr("data-require");
        var optionalParameterString = $(`#${id}`).attr("data-optional");

        if ("parameters" in tables[api]) { //if the api call has optional parameters
            showElement("optionalParameterSection", true);
            addOptionalParameters(api);
            if (optionalParameterString != "") {
                let optionalParameterArray = optionalParameterString.split('&')
                for (const op of optionalParameterArray) {
                    let optionalParameterSplit = op.split('=');
                    let key = optionalParameterSplit[0];
                    let value = optionalParameterSplit[1];
                    value = decodeURIComponent(value);
                    $(`#input-${key}`).val(value);
                }
            }
        }

        if ("requiredParameter" in tables[api]) {
            clearRequiredParameterOptions();
            showElement("requiredParameter", true);
            $("#requiredParameterTitle").text(tables[api]["requiredParameter"]["title"]);
            try {
                getRequiredParameterData(new URL(tables[api]["requiredParameter"]["path"], $("#url").val()), api, $("#apiKey").val(), requiredParameter);
            }
            catch (error) {
                console.log(error);
                showErrorMessage(errorMessage, 5);
                showLoading(false);
            }
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
        for (var oldId = parseInt(id) + 1; oldId < ulLength; oldId++) {
            var newId = oldId - 1;
            // $('#' + oldId + ' .deleteButton').off('click');
            // $('#' + oldId + ' .deleteButton').click(function(){
            //     deleteTable(newId);
            // });
            $('#' + oldId + ' .deleteButton').attr('onclick', 'deleteTable(' + newId + ')');
            $('#' + oldId + ' .editButton').attr('onclick', 'editTable(' + newId + ')');
            $(`#${oldId}`).attr("id", newId);
        }
        if ($('#apiList li').length <= 0) {
            showElement("emptyApiListMessage", true);
        }
    }

    window.deleteTable = deleteTable;

    //button for when the user is done choosing tables
    $("#submitButton").click(function () {
        var ul = $("#apiList")[0];
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
            if (item.hasAttribute("data-optional")) {
                newTable["optionalParameters"] = item.getAttribute("data-optional");
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
    var getRequiredParameterData = function (apiCall, tableId, apiKey, oldParam) {
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
            var selector = $("#requiredParameterSelector")[0];
            for (var i = 0, len = data.length; i < len; i++) {
                addOption(data[i][nameCol], data[i][valCol], selector);
            }
            if (result.meta.hasOwnProperty("next")) {
                getRequiredParameterData(result.meta.next, tableId, apiKey, oldParam);
            }
            else {
                if (oldParam != undefined) {
                    $("#requiredParameterSelector").val(oldParam);
                }
                switchPage("api-section", "edit-section");
                showLoading(false);
            }
        })
        .catch(function (error) {
            console.log(error);
            showLoading(false);
            showErrorMessage(errorMessage, 5);
        });
    }

    var clearDate = function(id) {
        $(`#${id}`).val("");
    }

    window.clearDate = clearDate;

    var addOptionalParameters = function(api) {
        for (const parameter of tables[api]['parameters']) {
            let html = "";
            if (parameter['type'] == 'options') {
                let type = parameter['type'];
                let id = parameter['parameter'];
                let name = parameter['name'];
                let defaultOption = parameter['default'];
                let options = [
                    `<div class="input-group my-3" parameterType="${type}" id="${id}">`,
                        `<div class="input-group-prepend">`,
                            `<label class="input-group-text" for="input-${id}">${name}</label>`,
                        `</div>`,

                        `<select class="custom-select" id="input-${id}">`,
                            `<option value="nosel" selected>${defaultOption}</option>`
                    ];

                for (const option of parameter['options']) {
                    options.push(`<option value="${option['value']}">${option['name']}</option>`);
                }
                options.push(...[
                        `</select>`,
                    `</div>`
                ]);
                html = options.join("\n");
            }
            else if (parameter['type'] == 'boolean') {
                let type = parameter['type'];
                let id = parameter['parameter'];
                let name = parameter['name'];
                html = [
                    `<div class="input-group my-3" parameterType="${type}" id="${id}">`,
                        `<div class="input-group-prepend">`,
                            `<label class="input-group-text" for="input-${id}">${name}</label>`,
                        `</div>`,

                        `<select class="custom-select" id="input-${id}">`,
                            `<option selected value="false">False</option>`,
                            `<option value="true">True</option>`,
                        `</select>`,
                    `</div>`
                ].join("\n");
            }
            else if (parameter['type'] == 'date') {
                let type = parameter['type'];
                let id = parameter['parameter'];
                let name = parameter['name'];
                html = [
                    `<div class="input-group my-3" parameterType="${type}" id="${id}">`,
                        `<div class="input-group-prepend">`,
                            `<label class="input-group-text" for="input-${id}">${name}</label>`,
                        `</div>`,

                        `<input type="date" class="form-control" id="input-${id}">`,

                        `<div class="input-group-append">`,
                            `<button class="btn btn-outline-danger" type="button" onclick="clearDate('input-${id}')">Clear</button>`,
                        `</div>`,
                    `</div>`
                ].join("\n");
            }
            else if (parameter['type'] == 'string') {
                let type = parameter['type'];
                let id = parameter['parameter'];
                let name = parameter['name'];
                let placeholder = parameter['placeholder'];
                html = [
                    `<div class="input-group my-3" parameterType="${type}" id="${id}">`,
                        `<div class="input-group-prepend">`,
                            `<label class="input-group-text" for="input-${id}">${name}</label>`,
                        `</div>`,

                        `<input type="text" class="form-control" placeholder="${placeholder}" id="input-${id}">`,
                    `</div>`
                ].join("\n");
            }
            $('#optionalParameterList').append(html);
        }
    }

    // button when starting to add a table
    $("#addButton").click(function () {
        var api = $("#apiSelector").val();
        $("#tableName").val(tables[api]["table"]["alias"]);
        $("#edit-section").attr("currentTable", $('#apiList li').length);

        if ("parameters" in tables[api]) { //if the api call has optional parameters
            showElement("optionalParameterSection", true);
            addOptionalParameters(api);
        }

        if ("requiredParameter" in tables[api]) { //if the api call requires a parameter
            showLoading(true);
            clearRequiredParameterOptions();
            showElement("requiredParameter", true);
            $("#requiredParameterTitle").text(tables[api]["requiredParameter"]["title"]);
            try {
                getRequiredParameterData(new URL(tables[api]["requiredParameter"]["path"], $("#url").val()), api, $("#apiKey").val(), undefined);
            }
            catch (error) {
                console.log(error);
                showErrorMessage(errorMessage, 5);
                showLoading(false);
            }
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
        var id = $("#edit-section").attr("currentTable");
        var ulLength = $('#apiList li').length;
        var api = $("#apiSelector").val();
        var title = $("#tableName").val();
        if (id < ulLength) { //editing table entry
            $('#' + id + ' .title').text(title);
        }
        else { //adding table entry
            //remove empty list message when adding first entry
            if (ulLength <= 0) {
                showElement("emptyApiListMessage", false);
            }
            let html = [
            `<li data-api="${api}" class="list-group-item" id="${id}">`,
                `<div class="row">`,
                    `<div class="col titleColumn">`,
                        `<div class="title">${title}</div>`,
                    `</div>`,
                    `<div class="col-xs-auto">`,
                        `<span>`,
                            `<button class="btn btn-light mx-1 editButton" type="button" onclick="editTable(${id})">Edit</button>`,
                            `<button class="btn btn-light mx-1 deleteButton" type="button" onclick="deleteTable(${id})">Delete</button>`,
                        `</span>`,
                    `</div>`,
                `</div>`,
            `</li>`
            ].join("\n");

            $('#apiList').append(html);
        }

        if ("requiredParameter" in tables[api]) { //get required parameter if necessary
            var requiredParameter = $("#requiredParameterSelector").val();
            $(`#${id}`).attr("data-require", requiredParameter);
        }
        if ("parameters" in tables[api]) {
            let parameterList = [];
            let children = $('#optionalParameterList').children()
            for (let i = 0; i < children.length; i++) {
                let parameterInput = $(children[i]);
                let name = parameterInput.attr('id');
                let value = "";
                if (parameterInput.attr('parametertype') == 'options') {
                    let option = $(`#input-${name} option:selected`).val()
                    if (option != 'nosel') {
                        value = option;
                    }
                }
                else if (parameterInput.attr('parametertype') == 'boolean') {
                    let option = $(`#input-${name} option:selected`).val()
                    if (option != 'false') {
                        value = option;
                    }
                }
                else if (parameterInput.attr('parametertype') == 'string') {
                    value = $(`#input-${name}`).val()
                }
                else if (parameterInput.attr('parametertype') == 'date') {
                    value = $(`#input-${name}`).val();
                }
                if (value != "")
                {
                    value = encodeURIComponent(value);
                    parameterList.push(
                        {
                            name: name,
                            value: value
                        }
                    );
                }
            }
            let parameterString = "";
            let parameterListToJoin = []
            for (const parameterSet of parameterList) {
                parameterListToJoin.push([parameterSet['name'], parameterSet['value']].join('='))
            }
            parameterString = parameterListToJoin.join('&');
            $(`#${id}`).attr("data-optional", parameterString);
            console.log(parameterString);
        }


        // switch back to api section
        switchPage("edit-section", "api-section");
        showElement("optionalParameterSection", false);
        $("#optionalParameterSelector").empty();
        $("#optionalParameterList").html("");
        if ($("#optionalParameterList").hasClass('show')) {
            $('#optionalParameterButton').click();
        }
    });

    // button to go back to page for entering the url and api key
    $("#resetButton").click(function () {
        switchPage("api-section", "url-section");
    });

    // button to go from credentials section to api section
    $("#credentialsButton").click(function () {
        switchPage("url-section", "api-section");
    });

    addTableOptions(tables);
});
