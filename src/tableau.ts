/* Allow the use of `any` type until tableauwdc adds types, or we add our own*/
/* eslint-disable @typescript-eslint/no-explicit-any */

import { updateApiList } from './lib/htmlUtils';
import { isJsonString } from './lib/utils';
import { tables } from './tables/api/author';
import { Bridge } from './api/bridge';

declare const tableau: any; // Declared here, since tableauwdc-2.3.latest.min.js is made globally available via html src.

class Tableau {
    myConnector: any;
    myTables: any;

    constructor() {
        this.myConnector = tableau.makeConnector();
        this.myTables = {};

        // tableau init
        this.myConnector.init = (initCallback) => {
            tableau.log('tableau web connector initialization');
            tableau.authType = tableau.authTypeEnum.custom;
            initCallback();

            if (
                tableau.phase == tableau.phaseEnum.authPhase ||
                tableau.phase == tableau.phaseEnum.interactivePhase
            ) {
                if (tableau.connectionData) {
                    this.populateStoredValues(tableau.connectionData);
                    if (tableau.password.length == 0) {
                        tableau.abortForAuth();
                    }
                }
            }
        };

        // tableau get schema
        // explicitly using arrow function here, as it allows access to nested(this) objects
        this.myConnector.getSchema = (schemaCallback) => {
            tableau.log('getSchema');
            const data = JSON.parse(tableau.connectionData);
            const chosenTables = [];
            let idCounter = 1;

            // takes each custom table and grabs the corredponding template table data
            for (const table of data.tables) {
                const apiCall = table['apiCall'];
                const newTable = JSON.parse(JSON.stringify(tables[apiCall]));
                const id = 'table' + idCounter;
                newTable['table']['alias'] = table['title'];
                newTable['table']['id'] = id;
                idCounter = idCounter + 1;

                if ('requiredParameter' in table) {
                    const oldApiCall = newTable['path'];
                    const newApiCall = oldApiCall.replace(
                        '*',
                        table['requiredParameter'],
                    );
                    newTable['path'] = newApiCall;
                }
                if ('optionalParameters' in table) {
                    const oldApiCall = newTable['path'];
                    const newApiCall =
                        oldApiCall + '?' + table['optionalParameters'];
                    newTable['path'] = newApiCall;
                }
                this.myTables[id] = newTable;
                chosenTables.push(newTable.table);
                console.log(chosenTables);
            }
            schemaCallback(chosenTables);
        };

        //tableau get data
        this.myConnector.getData = (table, doneCallback) => {
            tableau.log('getData');

            if (tableau.password.length == 0) {
                this.populateStoredValues(tableau.connectionData);
                tableau.abortForAuth();
            }

            const data = JSON.parse(tableau.connectionData);
            const tableid = table.tableInfo.id;
            const path = this.myTables[tableid].path;
            const apiCall = new URL(path, data.url);
            const bridgeApi = new Bridge(apiCall, tableau.password);

            bridgeApi.performApiCall(
                table,
                doneCallback,
                apiCall,
                this.myTables,
                tableau.password,
            );
        };

        //tableau connector registration
        tableau.registerConnector(this.myConnector);
    }

    set apiKey(apiKey: any) {
        tableau.password = apiKey;
    }

    get apiKey(): any {
        return tableau.password;
    }

    set connectionData(data: any) {
        if (isJsonString(data)) {
            tableau.connectionData = data;
        } else {
            tableau.connectionData = JSON.stringify(data);
        }
    }

    get connectionData(): any {
        return tableau.connectionData;
    }

    set connectionName(name: any) {
        tableau.connectionName = name;
    }

    get connectionName(): any {
        return tableau.connectionName;
    }

    tableauSubmit(): any {
        tableau.submit();
    }

    // If the user has previously setup the web connector connectionData should contain those values
    // This function makes sure the UI gets re-populated with the data.
    populateStoredValues(connectionData) {
        if (connectionData) {
            const data = JSON.parse(connectionData);
            const tables: Array<any> = data.tables;
            // Set url value if available
            $('#url').val(data.url);
            // Set the password if available(user would be in the same session)
            if (tableau.password.length > 0) {
                $('#apiKey').val(tableau.password);
            }

            tables.forEach((element, i) => {
                const id = i;
                const ulLength = $('#apiList li').length;
                const api = element.apiCall;
                const title = element.title;
                updateApiList(id, api, title, ulLength);
                $(`#${id}`).attr('data-require', element.requiredParameter);
                $(`#${id}`).attr('data-optional', element.optionalParameters);
            });
        }
    }
}

export { Tableau };
