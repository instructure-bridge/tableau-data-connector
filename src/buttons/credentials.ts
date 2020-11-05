import { Buttons } from './buttons';
import { CheckCredentials } from '../lib/checkCredentials';

class Credentials extends Buttons {
    constructor() {
        super();
        $('#credentialsButton').on('click', () => {
            const form = <any>$('#credentialForm');
            if (form[0].checkValidity()) {
                this.switchPage('url-section', 'api-section');

                new CheckCredentials(
                    $('#url').val(),
                    $('#apiKey').val(),
                ).performApiCall();
            } else {
                form[0].reportValidity();
            }
        });
    }
}

export { Credentials };
