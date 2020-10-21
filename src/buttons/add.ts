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
            this.requiredParameter(this.api, this.tables);
        });
    }

    parameters(api, tables) {
        if ('parameters' in tables[api]) {
            // if the api call has optional parameters
            this.showElement('optionalParameterSection', true);
            this.addOptionalParameters(api);
        }
    }

    requiredParameter(api, tables) {
        let url: any;
        let base: any;
        let title: any;

        if ('requiredParameter' in tables[api]) {
            url = tables[api]['requiredParameter']['path'];
            base = $('#url').val();
            title = tables[api]['requiredParameter']['title'];

            //if the api call requires a parameter
            this.showLoading(true);
            this.clearRequiredParameterOptions();
            this.showElement('requiredParameter', true);
            $('#requiredParameterTitle').text(title);
            try {
                this.getRequiredParameterData(
                    new URL(url, base),
                    api,
                    $('#apiKey').val(),
                    undefined,
                );
            } catch (error) {
                console.log(error);
                this.showErrorMessage(this.errorMessage, 5);
                this.showLoading(false);
            }
        } else {
            //if the api call does not require a parameter
            this.showElement('requiredParameter', false);
            // switch to edit section
            this.switchPage('api-section', 'edit-section');
        }
    }
}

export { Add };
