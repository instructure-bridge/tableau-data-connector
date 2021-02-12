/* Allow the use of `any` type until tableauwdc adds types, or we add our own*/
/* eslint-disable @typescript-eslint/no-explicit-any */

import { updateApiList, showElement } from './lib/htmlUtils';
import { isJsonString, logger } from './lib/utils';
import { tables } from './tables/api/author';
import { Bridge } from './api/bridge';

// See global.d.ts for globals, such as tableau, which is made globally available via html src tag

// Helper class that creates our custom tableau connector. However, as stated above, `tableau` is a global variable,
// keep that in mind when making changes to this class. Example: when the class is first initialized it checks
// to see if the tableau.connectionData object exists and uses/updates it if available.
class Tableau {
    myConnector: any;

    constructor() {
        this.myConnector = tableau.makeConnector();

        // tableau init
        this.myConnector.init = (initCallback) => {
            logger('tableau web connector initialization');
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

        // explicitly using arrow function here, as it allows access to nested(this) objects
        this.myConnector.getSchema = (schemaCallback) => {
            const chosenTables = this.getSchema();
            schemaCallback(chosenTables);
        };

        //tableau get data
        this.myConnector.getData = (table, doneCallback) => {
            logger('getData');
            let data;
            if (tableau.password.length == 0) {
                this.populateStoredValues(tableau.connectionData);
                tableau.abortForAuth();
            }

            // Ensure the schema object has been set on the tableau.connectionData
            // This seems to only be an issue when code is live reloading
            if (JSON.parse(tableau.connectionData)?.schema) {
                data = JSON.parse(tableau.connectionData);
            } else {
                this.getSchema();
                data = JSON.parse(tableau.connectionData);
            }
            const tableid = table.tableInfo.id;
            const tableInfo = data.schema[tableid];
            if ('allPath' in tableInfo) {
                const path = tableInfo.allPath;
                const apiCall = new URL(path, data.url);
                const bridgeApi = new Bridge(apiCall, tableau.password);
                bridgeApi.getAllIds(
                    table,
                    doneCallback,
                    apiCall,
                    data.schema,
                    tableau.password,
                );
            } else {
                const path = tableInfo.path;
                const apiCall = new URL(path, data.url);
                const bridgeApi = new Bridge(apiCall, tableau.password);
                bridgeApi.performApiCall(
                    table,
                    doneCallback,
                    apiCall,
                    data.schema,
                    tableau.password,
                );
            }
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

    getSchema() {
        logger('getSchema');
        const myTables = {};
        const data = JSON.parse(tableau.connectionData);
        const chosenTables = [];
        let idCounter = 1;

        // takes each custom table and grabs the corresponding template table data
        for (const table of data.tables) {
            const apiCall = table['apiCall'];
            const newTable = JSON.parse(JSON.stringify(tables[apiCall]));
            const id = 'table' + idCounter;
            newTable['table']['alias'] = table['title'];
            newTable['table']['id'] = id;
            idCounter = idCounter + 1;

            if ('requiredParameters' in table) {
                const allPath =
                    tables[table.apiCall]['requiredParameters'][0]['path'];
                const oldApiCall = newTable['path'];
                const oldApiParam = table['requiredParameters'].split('=')[1];
                if (oldApiParam === 'all') {
                    newTable['allPath'] = allPath;
                } else {
                    const newApiCall = oldApiCall.replace('*', oldApiParam);
                    newTable['path'] = newApiCall;
                }
            }
            if ('optionalParameters' in table) {
                const oldApiCall = newTable['path'];
                const newApiCall =
                    oldApiCall + '?' + table['optionalParameters'];
                newTable['path'] = newApiCall;
            }
            myTables[id] = this.filterColumns(newTable);
            chosenTables.push(newTable.table);
        }
        // Store schema on connection object so we can reference it later
        // during the getData phase. This is required if we are triggering a refresh of data vs setting
        // up a new connection, see https://tableau.github.io/webdataconnector/docs/wdc_phases
        // for more info
        data['schema'] = myTables;
        this.connectionData = JSON.stringify(data);
        return chosenTables;
    }

    /**
     * Only include a column if we are requesting extra data from the tables api via
     * optionalParameters
     * @example
     * ```
     * During the interaction phase, a customer selects the 'List Users' table. They then
     * edit the 'Optional Parameters' and include the 'Custom Fields' option. The path now
     * looks like `/api/author/users?includes[]=custom_fields`
     *
     * During the getSchema phase, we would then grab the listUsers object from ./tables/api/author/users.
     * The listUsers defines all possible columns that we choose to support. If optionalParameter is defined
     * for the column(in this example the 'Custom Fields' column), we make sure the api path includes the value of
     * the column optionalParameter. This, in effect, means we only include the 'Custom Fields' column if the customer
     * asked for it.
     * ```
     * @param table - The table which is being added to the tableau schema.
     */
    filterColumns(table) {
        const path = table.path;
        const columns = table.table.columns.filter((column) => {
            return 'optionalParameter' in column
                ? path.includes(column.optionalParameter)
                : column;
        });
        table.table.columns = columns;
        return table;
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

                if (element.requiredParameters) {
                    $(`#${id}`).attr(
                        'data-require',
                        element.requiredParameters,
                    );
                } else {
                    showElement('requiredParameterSection', false);
                }

                if (element.optionalParameters) {
                    $(`#${id}`).attr(
                        'data-optional',
                        element.optionalParameters,
                    );
                } else {
                    showElement('optionalParameterSection', false);
                }
            });
        }
    }
}

// Create and export a singleton object of the class
const tableauInstance = new Tableau();

export { Tableau, tableauInstance };
