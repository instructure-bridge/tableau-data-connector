import { ErrorToast } from '../lib/errorToast';
import {
    disableElement,
    showElement,
    showLoading,
    switchPage,
} from '../lib/htmlUtils';
import { tables, TableName } from '../tables/api/author';

// Class is inherited by most of the other buttons to add shared functions
// Some of which have been extracted out to ../lib/htmlUtils.
class Buttons {
    tables: TableName;
    defaultErrorMessage: string;

    constructor() {
        this.tables = tables;
        this.defaultErrorMessage =
            'An error has occured. Check that the url and api key are correct.';
    }

    // function for showing and hiding elements
    showElement = showElement;

    // function for switching between pages
    switchPage = switchPage;

    //function for showing the loading icon for the required parameter fethcing
    showLoading = showLoading;

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
        const requiredParameterString = decodeURIComponent(
            $(`#${id}`).attr('data-require'),
        );
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

        if ('requiredParameters' in tables[api]) {
            this.showElement('requiredParameterSection', true);
            this.addRequiredParameters(api);
            if (requiredParameterString != '') {
                const requiredParameterArray = requiredParameterString.split(
                    '&',
                );
                for (const op of requiredParameterArray) {
                    const requiredParameterSplit = op.split('=');
                    // Hack.. fix later
                    const key =
                        requiredParameterSplit[0] == 'filters[]'
                            ? 'filters'
                            : requiredParameterSplit[0];
                    const value = requiredParameterSplit[1];
                    const id = `input-${key}`;
                    if (value === 'all') {
                        $(`#${id}`)
                            .parent()
                            .next('form')
                            .find('[type=checkbox]')
                            .trigger('click');
                    } else {
                        $(`#input-${key}`).val(value);
                        disableElement(id, false);
                    }
                }
            }
        }
        this.switchPage('api-section', 'edit-section');
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
            let id;
            if (['options', 'filters'].includes(parameter['type'])) {
                const type = parameter['type'];
                id = parameter['parameter'];
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
                id = parameter['parameter'];
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
                id = parameter['parameter'];
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
                id = parameter['parameter'];
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

            // Since this method can be called multiple times.. we don't want to re-append things
            if ($('#optionalParameterList').html().includes(id)) {
                continue;
            } else {
                $('#optionalParameterList').append(html);
            }
        }
    }

    addRequiredParameters(api) {
        const dataName = tables[api]['data'];
        for (const parameter of tables[api]['requiredParameters']) {
            let html = '';
            let id;
            if (parameter['type'] == 'string') {
                const type = parameter['type'];
                id = parameter['parameter'];
                const name = parameter['name'];
                const placeholder = parameter['placeholder'];
                html = [
                    `<div class="input-group my-3" parameterType="${type}" id="${id}">`,
                    `<div class="input-group-prepend">`,
                    `<label class="input-group-text" for="input-${id}">${name}</label>`,
                    `</div>`,

                    `<input type="text" class="form-control" placeholder="${placeholder}" id="input-${id}" required>`,
                    `</div>`,
                    `<form class="form-check">`,
                    `<input type="checkbox" class="form-check-input" id="requiredCheckbox">`,
                    `<label class="form-check-label" for="requiredCheckbox">All ${dataName}</label>`,
                    `</form>`,
                ].join('\n');
            }

            // Since this method can be called multiple times.. we don't want to re-append things
            if ($('#requiredParameterList').html().includes(id)) {
                continue;
            } else {
                $('#requiredParameterList').append(html);
            }
        }
    }
}

export { Buttons };
