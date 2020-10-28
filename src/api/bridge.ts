import Axios from 'axios';
import { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';

interface DefaultHeaders {
    Authorization: string;
    'Content-Type': any;
    Accept: string;
}

interface DevHeaders {
    'X-Forwarded-Proto'?: string;
    'X-Forwarded-Host'?: string;
    'X-Forwarded-Port'?: string;
}

interface Headers extends DefaultHeaders, DevHeaders {}

export interface SetURL {
    apiCall: any; // TODO this should be URL, but causes some type problems with Axios
    headers: Headers;
}

class Bridge {
    apiCall: any;
    apiKey: any;

    constructor(apiCall: any, apiKey: any) {
        this.apiCall = apiCall;
        this.apiKey = apiKey;
    }

    setUrl(apiCall = this.apiCall, apiKey = this.apiKey): SetURL {
        let url: URL | string;
        let devHeaders: DevHeaders;

        const parsedUrl: URL = new URL(apiCall);
        const defaultHeaders: DefaultHeaders = {
            Authorization: apiKey,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        };

        if (process.env.NODE_ENV === 'development') {
            // Address of webpack-dev-server
            url = new URL(
                parsedUrl.pathname + parsedUrl.search,
                'http://localhost:8888',
            );
            devHeaders = {
                'X-Forwarded-Proto': parsedUrl.protocol,
                'X-Forwarded-Host': parsedUrl.hostname,
                'X-Forwarded-Port': parsedUrl.port,
            };
        } else {
            url = parsedUrl;
            devHeaders = {};
        }

        return {
            apiCall: url,
            headers: { ...defaultHeaders, ...devHeaders },
        };
    }

    addRow(table, myTables, result) {
        const tableid = table.tableInfo.id;
        const tableInfo = myTables[tableid];
        const data = result[tableInfo.data];
        const tableData = [];
        for (let i = 0, len = data.length; i < len; i++) {
            const row = {};
            for (const column of tableInfo.table.columns) {
                if ('linkedSource' in column) {
                    //for data in linked sources
                    const tableauId = column.id;

                    const linkedSource = column.linkedSource;
                    const linkedId = column.linkedId;
                    const id = data[i]['links'][linkedSource]['id'];
                    const linkedType = data[i]['links'][linkedSource]['type'];
                    const typeTable = result['linked'][linkedType];
                    const linkedData = typeTable.filter(function (data) {
                        return data.id === id;
                    });

                    if (linkedData.length == 1) {
                        row[tableauId] = linkedData[0][linkedId];
                    } else {
                        row[tableauId] = null;
                    }
                } else if ('parent_id' in column) {
                    const id = column.id;
                    const parentId = column.parent_id;
                    const subId = column.sub_id;

                    // Checks to ensure the parentId exists in the response
                    // Example: see courseTemplates table definition(response may or maynot actually have an author defined)
                    if (parentId in data[i]) {
                        row[id] = data[i][parentId][subId];
                    } else {
                        row[id] = null;
                    }
                } else {
                    const id = column.id;
                    row[id] = data[i][id];
                }
            }
            tableData.push(row);
        }
        table.appendRows(tableData);
    }

    performApiCall(table, doneCallback, apiCall, myTables, apiKey?: string) {
        // Retries 3 times by default for network errors and 5xx error's
        axiosRetry(Axios, { retryDelay: axiosRetry.exponentialDelay });
        const urlObj: SetURL = this.setUrl(apiCall, apiKey);
        const req: AxiosRequestConfig = {
            method: 'get',
            url: urlObj.apiCall,
            headers: urlObj.headers,
        };
        Axios(req)
            .then((response: AxiosResponse) => {
                const result = response.data;
                this.addRow(table, myTables, result);
                if ('next' in result.meta) {
                    this.performApiCall(
                        table,
                        doneCallback,
                        result.meta.next,
                        myTables,
                    );
                } else {
                    doneCallback();
                }
            })
            .catch((error: AxiosError) => {
                console.log(error);
                doneCallback();
                //TODO: try to find some sort of way to report an error since the browser is already closed
            });
    }
}

export { Bridge };
