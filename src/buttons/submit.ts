import { Buttons } from './buttons';
import { tableauInstance } from '../tableau';

class Submit extends Buttons {
    tableau: any;

    constructor() {
        super();
        this.tableau = tableauInstance;

        $('#submitButton').on('click', () => {
            let schema;
            const ul = $('#apiList')[0];
            const items = ul.getElementsByTagName('li');
            const apiCalls = [];

            for (const item of items as any) {
                const newTable = {
                    apiCall: item.getAttribute('data-api'),
                    title: item.getElementsByClassName('title')[0].innerText,
                };
                if (item.hasAttribute('data-require')) {
                    newTable['requiredParameters'] = item.getAttribute(
                        'data-require',
                    );
                }
                if (item.hasAttribute('data-optional')) {
                    newTable['optionalParameters'] = item.getAttribute(
                        'data-optional',
                    );
                }

                //newTable['path'] = this.tables[newTable.apiCall].path;
                apiCalls.push(newTable);
            }

            if (tableau.connectionData) {
                schema = JSON.parse(tableau.connectionData)?.schema;
            }

            const data = {
                url: $('#url').val(),
                tables: apiCalls,
                schema: schema,
            };

            this.tableau.connectionData = JSON.stringify(data);
            this.tableau.apiKey = $('#apiKey').val();
            this.tableau.connectionName = 'Bridge API';
            this.tableau.tableauSubmit();
        });
    }
}

export { Submit };
