import nock from 'nock';
import { Bridge } from '../../api/bridge';

describe('Bridge', function () {
    afterEach(() => {
        nock.restore();
    });

    const testUrl = 'http://example.com';
    const apiKey = 'Basic abc123';
    const testParams = '/api/author/users?id=1';
    const replyHeaders = {
        'access-control-allow-origin': 'http://localhost',
        'access-control-allow-headers': 'Accept,Authorization',
    };

    const table = 'test';
    const myTables = {};
    const doneCallback = jest.fn();

    it('Retries on error', async () => {
        jest.autoMockOff();
        const optionsRequest = nock(testUrl)
            .defaultReplyHeaders(replyHeaders)
            .intercept(testParams, 'OPTIONS')
            .twice()
            .reply(201, 'Ok');
        const error = nock(testUrl)
            .defaultReplyHeaders(replyHeaders)
            .intercept(testParams, 'GET')
            .once()
            .reply(500, 'Server Error');
        const success = nock(testUrl)
            .defaultReplyHeaders(replyHeaders)
            .intercept(testParams, 'GET')
            .once()
            .reply(200, 'Ok');

        await new Bridge(testUrl, apiKey).performApiCall(
            table,
            doneCallback,
            testUrl,
            myTables,
            apiKey,
        );

        // nock.isDone() will only return true if stub the stub was called, in this way, we can verify
        // the retry logic first hit the error response, retried, and was successful
        expect(optionsRequest.isDone()).toBeTruthy;
        expect(error.isDone()).toBeTruthy;
        expect(success.isDone()).toBeTruthy;
    });
    // TODO: Add more tests
});
