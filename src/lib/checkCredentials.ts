import Axios from 'axios';
import { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { ErrorToast } from './errorToast';
import { Bridge, SetURL } from '../api/bridge';
import { logger } from '../lib/utils';

class CheckCredentials extends Bridge {
    apiCall: any;
    apiKey: any;

    constructor(apiCall: any, apiKey: any) {
        super(apiCall, apiKey);
    }

    performApiCall() {
        // Retries 3 times by default for network errors and 5xx error's
        axiosRetry(Axios, { retryDelay: axiosRetry.exponentialDelay });

        if (!this.apiCall || !this.apiKey) {
            this.error('Please enter a value for URL and Key');
            return;
        }

        this.validateUrl(this.apiCall);

        const urlObj: SetURL = this.setUrl(this.apiCall, this.apiKey);
        const req: AxiosRequestConfig = {
            method: 'get',
            url: urlObj.apiCall + 'api/author/users?id=1',
            headers: urlObj.headers,
        };

        Axios(req)
            .then((response: AxiosResponse) => {
                const data: string =
                    response?.data?.toString()?.toLowerCase() || '';
                if (data.includes('account not found')) {
                    throw new Error('account not found');
                }
            })
            .catch((error: AxiosError) => {
                if (error?.message?.includes('account not found')) {
                    this.error('Account Not Found: Check your URL');
                } else if (error?.response?.status == 401) {
                    this.error(
                        'Unauthorized: Please check that your Key is valid.',
                    );
                } else {
                    this.error(
                        'An error has occured, with your credentials see the browser console for more details',
                    );
                    logger(error);
                }
            });
    }

    validateUrl(apiCall) {
        try {
            new URL(apiCall);
        } catch (_error) {
            const url = apiCall || '" "';
            this.error(`${url} is not a valid URL`);
        }
    }

    error(message) {
        new ErrorToast(message).createToast();
    }
}

export { CheckCredentials };
