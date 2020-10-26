import { Buttons } from './buttons';
import { CheckCredentials } from '../lib/checkCredentials';

class Credentials extends Buttons {
    constructor() {
        super();
        $('#credentialsButton').on('click', () => {
            this.switchPage('url-section', 'api-section');

            if (process.env.NODE_ENV !== 'test') {
                new CheckCredentials(
                    $('#url').val(),
                    $('#apiKey').val(),
                ).performApiCall();
            }
        });
    }
}

export { Credentials };
