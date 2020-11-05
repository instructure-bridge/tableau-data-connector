import { Buttons } from './buttons';

class Add extends Buttons {
    api: any;

    constructor() {
        super();
        $('#addButton').on('click', () => {
            this.api = $('#apiSelector').val();

            $('#tableName').val(this.tables[this.api]['table']['alias']);
            $('#edit-section').attr('currentTable', $('#apiList li').length);

            this.parameters(this.api, this.tables);
            this.requiredParameters(this.api, this.tables);
        });
    }

    parameters(api, tables) {
        if ('parameters' in tables[api]) {
            // if the api call has optional parameters
            this.showElement('optionalParameterSection', true);
            this.addOptionalParameters(api);
            this.switchPage('api-section', 'edit-section');
        } else {
            this.showElement('optionalParameterSection', false);
        }
    }

    requiredParameters(api, tables) {
        if ('requiredParameters' in tables[api]) {
            // if the api call has optional parameters
            this.showElement('requiredParameterSection', true);
            this.addRequiredParameters(api);
            this.switchPage('api-section', 'edit-section');
        } else {
            this.showElement('requiredParameterSection', false);
        }
    }
}

export { Add };
