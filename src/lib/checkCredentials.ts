import Axios from 'axios';
import { AxiosRequestConfig } from 'axios';
import { ErrorToast } from './errorToast';
import { Bridge, SetURL } from '../api/bridge';

class CheckCredentials extends Bridge {
    apiCall: any;
    apiKey: any;

    constructor(apiCall: any, apiKey: any) {
        super(apiCall, apiKey);
    }

    performApiCall() {
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
            .then((response) => {
                const data = response?.data?.toString()?.toLowerCase() || '';
                if (data.includes('account not found')) {
                    throw new Error('account not found');
                }
            })
            .catch((error) => {
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
                    console.log(error);
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
