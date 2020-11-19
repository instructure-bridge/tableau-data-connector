import { disableElement, updateApiList } from '../lib/htmlUtils';
import { Buttons } from './buttons';

class EditDone extends Buttons {
    id: any;
    ulLength: any;
    api: any;
    title: any;

    constructor() {
        super();
        $('#requiredParameterList').on(
            'click',
            '#requiredCheckbox',
            (event: any) => {
                const requiredParameter =
                    event.target.parentElement.previousElementSibling
                        .lastElementChild;
                const id = requiredParameter.id;

                if (
                    event.target &&
                    event.target.parentElement.previousElementSibling
                        .lastElementChild.id == id
                ) {
                    if (event.target.checked) {
                        $(`#${id}`).val('all');
                        disableElement(requiredParameter.id, true);
                    } else {
                        $(`#${id}`).val(null);
                        disableElement(requiredParameter.id, false);
                    }
                }
            },
        );

        $('#editDoneButton').on('click', () => {
            this.id = $('#edit-section').attr('currentTable');
            this.ulLength = $('#apiList li').length;
            this.api =
                $(`#${this.id}`).attr('data-api') || $('#apiSelector').val();
            this.title = $('#tableName').val();

            updateApiList(this.id, this.api, this.title, this.ulLength);
            this.requiredParameters(this.id, this.api, this.tables);
            this.parameters(this.id, this.api, this.tables);

            const required = this.required(this.api, this.tables);
            const optional = this.optional(this.api, this.tables);

            if (required && optional) {
                this.requiredParameterActions();
                this.optionalParameterActions();
            } else if (required && !optional) {
                this.requiredParameterActions();
            } else if (!required && optional) {
                this.optionalParameterActions();
                this.switchPage('edit-section', 'api-section');
            }
        });
    }

    required(api, tables): boolean {
        return 'requiredParameters' in tables[api];
    }

    optional(api, tables): boolean {
        return 'parameters' in tables[api];
    }

    requiredParameterActions() {
        const form = <any>$('#requiredForm');
        if (form[0].checkValidity()) {
            this.showElement('requiredParameterSection', false);
            $('#requiredParameterSelector').empty();
            $('#requiredParameterList').html('');
            if ($('#requiredParameterList').hasClass('show')) {
                $('#requiredParameterButton').click();
            }
            this.switchPage('edit-section', 'api-section');
        } else {
            form[0].reportValidity();
        }
    }

    optionalParameterActions() {
        this.showElement('optionalParameterSection', false);
        $('#optionalParameterSelector').empty();
        $('#optionalParameterList').html('');
        if ($('#optionalParameterList').hasClass('show')) {
            $('#optionalParameterButton').click();
        }
    }

    requiredParameters(id, api, tables): any {
        if (this.required(api, tables)) {
            const parameterList = [];
            const children = $('#requiredParameterList').children();
            for (let i = 0; i < children.length; i++) {
                const parameterInput = $(children[i]);
                let value: any;
                let name = parameterInput.attr('id');
                if (parameterInput.attr('parametertype') === 'options') {
                    const option = $(`#input-${name} option:selected`).val();
                    if (option != 'nosel') {
                        value = option;
                    }
                } else if (
                    ['filters', 'includes'].includes(
                        parameterInput.attr('parametertype'),
                    )
                ) {
                    const option = $(`#input-${name} option:selected`).val();
                    if (option != 'nosel') {
                        name = `${name}[]`;
                        value = option;
                    }
                } else if (parameterInput.attr('parametertype') === 'boolean') {
                    const option = $(`#input-${name} option:selected`).val();
                    if (option != 'false') {
                        value = option;
                    }
                } else if (parameterInput.attr('parametertype') === 'string') {
                    value = $(`#input-${name}`).val();
                } else if (parameterInput.attr('parametertype') === 'date') {
                    value = $(`#input-${name}`).val();
                } else {
                    name = null;
                    value = null;
                }

                if (value && name) {
                    parameterList.push({
                        name: name,
                        value: encodeURIComponent(value),
                    });
                }
            }

            this.showElement('requiredParameterSection', true);
            let parameterString = '';
            const parameterListToJoin = [];
            for (const parameterSet of parameterList) {
                parameterListToJoin.push(
                    [parameterSet['name'], parameterSet['value']].join('='),
                );
            }
            parameterString = parameterListToJoin.join('&');
            $(`#${id}`).attr('data-require', parameterString);
            console.log(parameterString);
        }
    }

    parameters(id, api, tables): any {
        if (this.optional(api, tables)) {
            const parameterList = [];
            const children = $('#optionalParameterList').children();
            for (let i = 0; i < children.length; i++) {
                const parameterInput = $(children[i]);
                let value: any;
                let name = parameterInput.attr('id');

                if (parameterInput.attr('parametertype') === 'options') {
                    const option = $(`#input-${name} option:selected`).val();
                    if (option != 'nosel') {
                        value = option;
                    }
                } else if (
                    ['filters', 'includes'].includes(
                        parameterInput.attr('parametertype'),
                    )
                ) {
                    const option = $(`#input-${name} option:selected`).val();
                    if (option != 'nosel') {
                        name = `${name}[]`;
                        value = option;
                    }
                } else if (parameterInput.attr('parametertype') === 'boolean') {
                    const option = $(`#input-${name} option:selected`).val();
                    if (option != 'false') {
                        value = option;
                    }
                } else if (parameterInput.attr('parametertype') === 'string') {
                    value = $(`#input-${name}`).val();
                } else if (parameterInput.attr('parametertype') === 'date') {
                    value = $(`#input-${name}`).val();
                } else {
                    name = null;
                    value = null;
                }
                if (value && name) {
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
