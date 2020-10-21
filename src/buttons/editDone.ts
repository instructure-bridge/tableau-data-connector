import { Buttons } from './buttons';

class EditDone extends Buttons {
    id: any;
    ulLength: any;
    api: any;
    title: any;

    constructor() {
        super();
        $('#editDoneButton').on('click', () => {
            this.id = $('#edit-section').attr('currentTable');
            this.ulLength = $('#apiList li').length;
            this.api = $('#apiSelector').val();
            this.title = $('#tableName').val();

            this.apiList(this.id, this.api, this.title, this.ulLength);
            this.requiredParameter(this.id, this.api, this.tables);
            this.parameters(this.id, this.api, this.tables);

            // switch back to api section
            this.switchPage('edit-section', 'api-section');
            this.showElement('optionalParameterSection', false);
            $('#optionalParameterSelector').empty();
            $('#optionalParameterList').html('');
            if ($('#optionalParameterList').hasClass('show')) {
                $('#optionalParameterButton').click();
            }
        });
    }

    apiList(id, api, title, ulLength): void {
        // check if id exists to see if this is an edit or an add
        if (id < ulLength) {
            // editing table entry
            $('#' + id + ' .title').text(title);
        } else {
            // adding table entry
            // remove empty list message when adding first entry
            if (ulLength <= 0) {
                this.showElement('emptyApiListMessage', false);
            }

            const html: string = this.buildHtml(id, api, title);
            $('#apiList').append(html);
        }
    }

    // Adds the Edit and Delete Buttons for each table item
    buildHtml(id, api, title): string {
        return [
            `<li data-api="${api}" class="list-group-item" id="${id}">`,
            `<div class="row">`,
            `<div class="col titleColumn">`,
            `<div class="title">${title}</div>`,
            `</div>`,
            `<div class="col-xs-auto">`,
            `<span>`,
            `<button class="btn btn-light mx-1" id="editList" type="button">Edit</button>`,
            `<button class="btn btn-light mx-1" id="deleteList" type="button">Delete</button>`,
            `</span>`,
            `</div>`,
            `</div>`,
            `</li>`,
        ].join('\n');
    }

    requiredParameter(id, api, tables): any {
        let requiredParameter: any;

        if ('requiredParameter' in tables[api]) {
            //get required parameter if necessary
            requiredParameter = $('#requiredParameterSelector').val();
            $(`#${id}`).attr('data-require', requiredParameter);
        }
    }

    parameters(id, api, tables): any {
        let value: any;
        if ('parameters' in tables[api]) {
            const parameterList = [];
            const children = $('#optionalParameterList').children();
            for (let i = 0; i < children.length; i++) {
                const parameterInput = $(children[i]);
                const name = parameterInput.attr('id');
                //let value = '';
                if (parameterInput.attr('parametertype') == 'options') {
                    const option = $(`#input-${name} option:selected`).val();
                    if (option != 'nosel') {
                        value = option;
                    }
                } else if (parameterInput.attr('parametertype') == 'boolean') {
                    const option = $(`#input-${name} option:selected`).val();
                    if (option != 'false') {
                        value = option;
                    }
                } else if (parameterInput.attr('parametertype') == 'string') {
                    value = $(`#input-${name}`).val();
                } else if (parameterInput.attr('parametertype') == 'date') {
                    value = $(`#input-${name}`).val();
                }

                if (value != null) {
                    value = encodeURIComponent(value);
                    parameterList.push({
                        name: name,
                        value: value,
                    });
                }
            }

            let parameterString = '';
            const parameterListToJoin = [];
            for (const parameterSet of parameterList) {
                parameterListToJoin.push(
                    [parameterSet['name'], parameterSet['value']].join('='),
                );
            }
            parameterString = parameterListToJoin.join('&');
            $(`#${id}`).attr('data-optional', parameterString);
            console.log(parameterString);
        }
    }
}

export { EditDone };
