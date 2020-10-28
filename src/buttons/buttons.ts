import Axios from 'axios';
import { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { Bridge } from '../api/bridge';
import { ErrorToast } from '../lib/errorToast';
import { tables, TableName } from '../tables/api/author';

// Class meant to be inherited to add functions to buttons
class Buttons {
    tables: TableName;
    defaultErrorMessage: string;

    constructor() {
        this.tables = tables;
        this.defaultErrorMessage =
            'An error has occured. Check that the url and api key are correct.';
    }

    // function for showing and hiding elements
    showElement(id, isShow) {
        if (isShow) {
            $(`#${id}`).css('display', '');
        } else {
            $(`#${id}`).css('display', 'none');
        }
    }

    // function for switching between pages
    switchPage(start, end) {
        this.showElement(start, false);
        this.showElement(end, true);
    }

    //function for showing the loading icon for the required parameter fethcing
    showLoading(isLoading) {
        if (isLoading) {
            $('#addButton').prop('disabled', true);
            $('#addButton').html(
                '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Loading...</span>',
            );
        } else {
            $('#addButton').prop('disabled', false);
            $('#addButton').html('Add');
        }
    }

    //function for clearing the required parameter selector options
    clearRequiredParameterOptions() {
        $('#requiredParameterSelector').html('');
    }

    //function to add an option to a dropdown
    addOption(name, value, selector) {
        const option = document.createElement('option');
        option.innerText = name;
        option.setAttribute('value', value);
        option.setAttribute('id', value);
        selector.appendChild(option);
    }

    //function to add table options to the api selector
    addTableOptions(availableTables) {
        const selector = $('#apiSelector')[0];
        for (const table in availableTables) {
            if (table in availableTables) {
                const name = availableTables[table]['table']['alias'];
                const value = availableTables[table]['table']['id'];
                this.addOption(name, value, selector);
            }
        }
    }

    //function for edit button action
    editTable(id) {
        $('#tableName').val($('#' + id + ' .title').text());
        $('#edit-section').attr('currentTable', id);
        const api = $(`#${id}`).attr('data-api');
        const requiredParameter = $(`#${id}`).attr('data-require');
        const optionalParameterString = decodeURIComponent(
            $(`#${id}`).attr('data-optional'),
        );

        if ('parameters' in tables[api]) {
            //if the api call has optional parameters
            this.showElement('optionalParameterSection', true);
            this.addOptionalParameters(api);
            if (optionalParameterString != '') {
                const optionalParameterArray = optionalParameterString.split(
                    '&',
                );
                for (const op of optionalParameterArray) {
                    const optionalParameterSplit = op.split('=');
                    // Hack.. fix later
                    const key =
                        optionalParameterSplit[0] == 'filters[]'
                            ? 'filters'
                            : optionalParameterSplit[0];
                    const value = optionalParameterSplit[1];
                    $(`#input-${key}`).val(value);
                }
            }
        }

        if ('requiredParameter' in tables[api]) {
            const url: any = tables[api]['requiredParameter']['path'];
            const base: any = $('#url').val();

            this.clearRequiredParameterOptions();
            this.showElement('requiredParameter', true);
            $('#requiredParameterTitle').text(
                tables[api]['requiredParameter']['title'],
            );
            try {
                this.getRequiredParameterData(
                    new URL(url, base),
                    api,
                    $('#apiKey').val(),
                    requiredParameter,
                );
            } catch (error) {
                console.log(error);
                this.showErrorMessage(this.defaultErrorMessage);
                this.showLoading(false);
            }
        } else {
            this.showElement('requiredParameter', false);
            // switch to edit section
            this.switchPage('api-section', 'edit-section');
        }
    }

    //function for delete button action
    deleteTable(id) {
        const ulLength = $('#apiList li').length;
        $('#' + id).remove();
        for (let oldId = parseInt(id) + 1; oldId < ulLength; oldId++) {
            const newId = oldId - 1;
            // $('#' + oldId + ' .deleteButton').off('click');
            // $('#' + oldId + ' .deleteButton').click(function(){
            //     deleteTable(newId);
            // });
            $('#' + oldId + ' .deleteButton').attr(
                'onclick',
                'deleteTable(' + newId + ')',
            );
            $('#' + oldId + ' .editButton').attr(
                'onclick',
                'editTable(' + newId + ')',
            );
            $(`#${oldId}`).attr('id', newId);
        }
        if ($('#apiList li').length <= 0) {
            this.showElement('emptyApiListMessage', true);
        }
    }

    showErrorMessage(errorMessage: any, errorType = 'Error', delay = 800) {
        new ErrorToast(errorMessage, errorType, delay).createToast();
    }

    addOptionalParameters(api) {
        for (const parameter of tables[api]['parameters']) {
            let html = '';
            if (['options', 'filters'].includes(parameter['type'])) {
                const type = parameter['type'];
                const id = parameter['parameter'];
                const name = parameter['name'];
                const defaultOption = parameter['default'];
                const options = [
                    `<div class="input-group my-3" parameterType="${type}" id="${id}">`,
                    `<div class="input-group-prepend">`,
                    `<label class="input-group-text" for="input-${id}">${name}</label>`,
                    `</div>`,

                    `<select class="custom-select" id="input-${id}">`,
                    `<option value="nosel" selected>${defaultOption}</option>`,
                ];

                for (const option of parameter['options']) {
                    options.push(
                        `<option value="${option['value']}">${option['name']}</option>`,
                    );
                }
                options.push(...[`</select>`, `</div>`]);
                html = options.join('\n');
            } else if (parameter['type'] == 'boolean') {
                const type = parameter['type'];
                const id = parameter['parameter'];
                const name = parameter['name'];
                html = [
                    `<div class="input-group my-3" parameterType="${type}" id="${id}">`,
                    `<div class="input-group-prepend">`,
                    `<label class="input-group-text" for="input-${id}">${name}</label>`,
                    `</div>`,

                    `<select class="custom-select" id="input-${id}">`,
                    `<option selected value="false">False</option>`,
                    `<option value="true">True</option>`,
                    `</select>`,
                    `</div>`,
                ].join('\n');
            } else if (parameter['type'] == 'date') {
                const type = parameter['type'];
                const id = parameter['parameter'];
                const name = parameter['name'];
                html = [
                    `<div class="input-group my-3" parameterType="${type}" id="${id}">`,
                    `<div class="input-group-prepend">`,
                    `<label class="input-group-text" for="input-${id}">${name}</label>`,
                    `</div>`,

                    `<input type="date" class="form-control" id="input-${id}">`,

                    `<div class="input-group-append">`,
                    `<button class="btn btn-outline-danger" type="button" onclick="clearValue('input-${id}')">Clear</button>`,
                    `</div>`,
                    `</div>`,
                ].join('\n');
            } else if (parameter['type'] == 'string') {
                const type = parameter['type'];
                const id = parameter['parameter'];
                const name = parameter['name'];
                const placeholder = parameter['placeholder'];
                html = [
                    `<div class="input-group my-3" parameterType="${type}" id="${id}">`,
                    `<div class="input-group-prepend">`,
                    `<label class="input-group-text" for="input-${id}">${name}</label>`,
                    `</div>`,

                    `<input type="text" class="form-control" placeholder="${placeholder}" id="input-${id}">`,
                    `</div>`,
                ].join('\n');
            }
            $('#optionalParameterList').append(html);
        }
    }

    getRequiredParameterData(apiCall, tableId, apiKey, oldParam) {
        const urlObj = new Bridge(apiCall, apiKey).setUrl();

        // Retries 3 times by default for network errors and 5xx error's
        axiosRetry(Axios, { retryDelay: axiosRetry.exponentialDelay });
        const req: AxiosRequestConfig = {
            method: 'get',
            url: urlObj.apiCall,
            headers: urlObj.headers,
        };

        Axios(req)
            .then((response: AxiosResponse) => {
                const result = response.data;
                const tableInfo = tables[tableId];
                const data = result[tableInfo['requiredParameter']['data']];
                const nameCol = tableInfo['requiredParameter']['nameCol'];
                const valCol = tableInfo['requiredParameter']['valCol'];
                const selector = $('#requiredParameterSelector')[0];

                for (let i = 0, len = data.length; i < len; i++) {
                    this.addOption(data[i][nameCol], data[i][valCol], selector);
                }

                if ('next' in result.meta) {
                    this.getRequiredParameterData(
                        result.meta.next,
                        tableId,
                        apiKey,
                        oldParam,
                    );
                } else {
                    if (oldParam != undefined) {
                        $('#requiredParameterSelector').val(oldParam);
                    }
                    this.switchPage('api-section', 'edit-section');
                    this.showLoading(false);
                }
            })
            .catch((error: AxiosError) => {
                console.log(error);
                this.showLoading(false);
                this.showErrorMessage(this.defaultErrorMessage);
            });
    }
}

export { Buttons };
