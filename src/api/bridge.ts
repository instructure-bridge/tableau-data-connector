import Axios from 'axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { chunkArray, logger } from '../lib/utils';
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
    private defaultDoneCallback: boolean = true;
    private batches: Array<any> = [];

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

    /**
     * Adds data to tableau
     *
     * @param table - The current table being processed
     * @param myTables - All currently selected tables
     * @param result - Axios returned data
     */
    async addRow(table: any, myTables: any, result: any) {
        await new AddRow(table, myTables, result).processData();
    }

    /**
     * Axios.get function
     *
     * @param apiCall - The url
     * @param apiKey - The password/key
     */
    async get(apiCall: string | URL, apiKey?: string): Promise<AxiosResponse> {
        // Retries 3 times by default for network errors and 5xx error's
        axiosRetry(Axios, { retryDelay: axiosRetry.exponentialDelay });
        const urlObj: SetURL = this.setUrl(apiCall, apiKey);
        const req: AxiosRequestConfig = {
            method: 'get',
            url: urlObj.apiCall,
            headers: urlObj.headers,
        };
        return Axios(req);
    }

    /**
     * Generator function, that calls this.get and creates an iterable.
     * If paginated, will use meta.next url
     *
     * @param apiCall - The url
     * @param apiKey - The password/key
     */
    async *performRequests(apiCall: string | URL, apiKey?: string) {
        let url = apiCall;
        while (url) {
            const response = await this.get(url, apiKey);
            const result = await response.data;

            url = result?.meta?.next
                ? this.metaNext(response, result.meta.next)
                : null;
            yield result;
        }
    }

    /**
     * Performs the bridge api calls
     *
     * @remarks
     * This method is called during the tableau.getData phase
     *
     * @param table - The table currently being processed
     * @param doneCallback - the tableau.getData(doneCallback), letting tableau know when the getData phase is complete.
     * @param apiCall - the url
     * @param myTables - All currently selected tables
     * @param apiKey - The password/key
     */
    async performApiCall(
        table,
        doneCallback,
        apiCall,
        myTables,
        apiKey?: string,
    ) {
        const generatedRequests = this.performRequests(apiCall, apiKey);

        try {
            for await (const result of generatedRequests) {
                await this.addRow(table, myTables, result);
            }
            // this is a little bit of a hack.., this allows for another function
            // (such as getAllIds) to call the tableau.getData().doneCallback()
            // Otherwise, the doneCallback maybe called before appending data in tableau has completed
            // TODO: implement this somewhere else
            if (this.defaultDoneCallback) {
                logger('getData default doneCallback()');
                doneCallback();
            } else {
                return;
            }
        } catch (error) {
            logger(error);
        }
    }

    /**
     * Gets all course ID's
     *
     * @remarks
     * This method is called during the tableau.getData phase, and is currently only called when the user
     * has selected the "List Enrollments" table.
     *
     * @internal
     * TODO abstract this out so it could be used by multiple tables
     *
     *
     * @param table - The table currently being processed
     * @param doneCallback - the tableau.getData(doneCallback), letting tableau know when the getData phase is complete.
     * @param apiCall - the url
     * @param myTables - All currently selected tables
     * @param apiKey - The password/key
     */
    async getAllIds(table, doneCallback, apiCall, myTables, apiKey?: string) {
        // Lets this function handle tableau.getData().doneCallback()
        this.defaultDoneCallback = false;

        const valCol =
            myTables[table.tableInfo.id]['requiredParameters'][0]['valCol'];

        const generatedRequests = this.performRequests(apiCall, apiKey);

        for await (const result of generatedRequests) {
            const idArray = result[valCol];
            if (!Array.isArray(idArray) || !idArray.length) {
                logger('No data to gather');
                doneCallback();
            } else {
                const batchArray = chunkArray(idArray, 5);
                batchArray.forEach((batch) => {
                    this.processBatch(
                        table,
                        doneCallback,
                        apiCall,
                        myTables,
                        batch,
                    );
                });
            }
        }

        // This makes sure ALL batches are done, before we tell tableau we are finished
        Promise.all(this.batches).then(() => {
            logger('getData completed, calling doneCallback()');
            doneCallback();
        });
    }

    /**
     * Processes a batch of requests
     *
     * @internal
     * TODO Move this to another class, so it can be re-usable
     *
     *
     * @param table - The table currently being processed
     * @param doneCallback - the tableau.getData(doneCallback), letting tableau know when the getData phase is complete.
     * @param apiCall - the url
     * @param myTables - All currently selected tables
     * @param batch - The batch of id's to process (in this case they will be course id's)
     */
    async processBatch(
        table,
        doneCallback,
        apiCall,
        myTables,
        batch: Array<any>,
    ) {
        const path = myTables[table.tableInfo.id]['path'];
        batch.forEach((item) => {
            const id = item.id;
            const newPath = path.replace('*', id);
            const url = new URL(newPath, apiCall.origin);
            this.batches.push(
                Promise.resolve(
                    this.performApiCall(table, doneCallback, url, myTables),
                ),
            );
        });
    }
}

export { Bridge };
