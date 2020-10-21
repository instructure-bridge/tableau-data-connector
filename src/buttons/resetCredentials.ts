import { Buttons } from './buttons';

class ResetCredentials extends Buttons {
    constructor() {
        super();
        $('#resetButton').on('click', () => {
            this.switchPage('api-section', 'url-section');
        });
    }
}

export { ResetCredentials };
