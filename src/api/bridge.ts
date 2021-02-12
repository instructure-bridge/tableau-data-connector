import Axios from 'axios';
import { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { logger } from '../lib/utils';
import { AddRow } from './addRow';

interface DefaultHeaders {
    Authorization: string;
    'Content-Type': any;
    Accept: string;
}

interface DevHeaders {
    'X-Forwarded-Proto'?: string;
    'X-Forwarded-Host'?: string;
    'X-Forwarded-Port'?: string;
    'X-Tenant'?: string;
}

interface Headers extends DefaultHeaders, DevHeaders {}

export interface SetURL {
    apiCall: any; // TODO this should be URL, but causes some type problems with Axios
    headers: Headers;
}

class Bridge {
    apiCall: any;
    apiKey: any;
    responsePromise: Array<any>;

    constructor(apiCall: any, apiKey: any) {
        this.apiCall = apiCall;
        this.apiKey = apiKey;
        this.responsePromise = [];
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
                'X-Tenant': parsedUrl.hostname.split('.')[0],
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
        new AddRow(table, myTables, result).processData();
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
                    const nextUrl = this.metaNext(response, result.meta.next);
                    this.performApiCall(table, doneCallback, nextUrl, myTables);
                } else {
                    doneCallback();
                }
            })
            .catch((error: AxiosError) => {
                logger(String(error));
                doneCallback();
                //TODO: try to find some sort of way to report an error since the browser is already closed
            });
    }

    /**
     * Returns the meta.next url used when a response is paged
     *
     * @remarks
     * This method takes the responses meta.next and ensures the port is set if one was originally specified
     *
     * @param response - The response returned by Axios
     * @param nextUrl - The meta.next url
     */
    metaNext(response: AxiosResponse, nextUrl: string): URL {
        let url: URL;

        if (response?.config?.headers['X-Forwarded-Port']) {
            url = new URL(nextUrl);
            url.port = response?.config?.headers['X-Forwarded-Port'];
        } else {
            url = new URL(nextUrl);
        }
        return url;
    }

    getAllIds(table, doneCallback, apiCall, myTables, apiKey?: string) {
        axiosRetry(Axios, { retryDelay: axiosRetry.exponentialDelay });
        const urlObj: SetURL = this.setUrl(apiCall, apiKey);
        const req: AxiosRequestConfig = {
            method: 'get',
            url: urlObj.apiCall,
            headers: urlObj.headers,
        };
        Axios(req)
            .then((response: AxiosResponse) => {
                let id;
                let urlString;
                let url;
                let newPath;

                const valCol =
                    myTables[table.tableInfo.id]['requiredParameters'][0][
                        'valCol'
                    ];
                const path = myTables[table.tableInfo.id]['path'];
                const result = response.data;
                // Account for empty array in results.
                if (!Array.isArray(result[valCol]) || !result[valCol].length) {
                    logger('No results');
                    doneCallback();
                } else {
                    const loopPromise = new Promise<void>((resolve) => {
                        result[valCol].forEach((item, i, array) => {
                            setTimeout(() => {
                                id = item.id;
                                urlString = JSON.parse(tableau.connectionData)
                                    .url;
                                newPath = path.replace('*', id);
                                url = new URL(newPath, urlString);
                                this.performAllApiCall(
                                    table,
                                    doneCallback,
                                    url,
                                    myTables,
                                );
                                if (i === array.length - 1) {
                                    resolve();
                                }
                            }, i * 2000);
                        });
                    });
                    this.responsePromise.push(loopPromise);
                    if ('next' in result.meta) {
                        this.getAllIds(
                            table,
                            doneCallback,
                            result.meta.next,
                            myTables,
                        );
                    } else {
                        Promise.all(this.responsePromise).then(() => {
                            doneCallback();
                        });
                    }
                }
            })
            .catch((error: AxiosError) => {
                logger(String(error));
                doneCallback();
                //TODO: try to find some sort of way to report an error since the browser is already closed
            });
    }

    performAllApiCall(table, doneCallback, apiCall, myTables, apiKey?: string) {
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
                    const nextUrl = this.metaNext(response, result.meta.next);
                    this.performAllApiCall(
                        table,
                        doneCallback,
                        nextUrl,
                        myTables,
                    );
                }
            })
            .catch((error: AxiosError) => {
                logger(String(error));
                doneCallback();
                //TODO: try to find some sort of way to report an error since the browser is already closed
            });
    }
}

export { Bridge };
