import { Buttons } from './buttons';

class Credentials extends Buttons {
    constructor() {
        super();
        $('#credentialsButton').on('click', () => {
            this.switchPage('url-section', 'api-section');
        });
    }
}

export { Credentials };
