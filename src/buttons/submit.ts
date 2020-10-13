import { Buttons } from './buttons';
import { Tableau } from '../tableau';
import { performApiCall } from '../bridgeApi';

class Submit extends Buttons {
    tableau: any;

    constructor() {
        super();
        this.tableau = new Tableau(performApiCall);

        $('#submitButton').on('click', () => {
            const ul = $('#apiList')[0];
            const items = ul.getElementsByTagName('li');
            const apiCalls = [];

            for (const item of items as any) {
                const newTable = {
                    apiCall: item.getAttribute('data-api'),
                    title: item.getElementsByClassName('title')[0].innerText,
                };
                if (item.hasAttribute('data-require')) {
                    newTable['requiredParameter'] = item.getAttribute(
                        'data-require',
                    );
                }
                if (item.hasAttribute('data-optional')) {
                    newTable['optionalParameters'] = item.getAttribute(
                        'data-optional',
                    );
                }
                apiCalls.push(newTable);
            }

            const data = {
                url: $('#url').val(),
                tables: apiCalls,
            };

            this.tableau.connectionData = JSON.stringify(data);
            this.tableau.apiKey = $('#apiKey').val();
            this.tableau.connectionName = 'Bridge API';
            this.tableau.tableauSubmit();
        });
    }
}

export { Submit };
