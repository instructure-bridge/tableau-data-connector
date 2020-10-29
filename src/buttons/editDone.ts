import { updateApiList } from '../lib/htmlUtils';
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

            updateApiList(this.id, this.api, this.title, this.ulLength);
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
                let name = parameterInput.attr('id');
                if (parameterInput.attr('parametertype') == 'options') {
                    const option = $(`#input-${name} option:selected`).val();
                    if (option != 'nosel') {
                        value = option;
                    }
                } else if (parameterInput.attr('parametertype') == 'filters') {
                    const option = $(`#input-${name} option:selected`).val();
                    if (option != 'false') {
                        name = `${name}[]`;
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
                    parameterList.push({
                        name: name,
                        value: encodeURIComponent(value),
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
