import nock from 'nock';
import { AddRow } from '../../api/addRow';
import { Bridge } from '../../api/bridge';

jest.mock('../../api/addRow');

describe('Bridge', function () {
    beforeEach(() => {
        jest.clearAllMocks();
    });

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
        const optionsRequest = nock(testUrl)
            .replyContentLength()
            .defaultReplyHeaders(replyHeaders)
            .intercept(testParams, 'OPTIONS')
            .twice()
            .reply(201, 'Ok');
        const error = nock(testUrl)
            .replyContentLength()
            .defaultReplyHeaders(replyHeaders)
            .intercept(testParams, 'GET')
            .once()
            .reply(500, 'Server Error');
        const success = nock(testUrl)
            .replyContentLength()
            .defaultReplyHeaders(replyHeaders)
            .intercept(testParams, 'GET')
            .once()
            .reply(200, 'Ok');

        const bridge = new Bridge(testUrl + testParams, apiKey);

        await bridge.performApiCall(
            table,
            doneCallback,
            testUrl + testParams,
            myTables,
            apiKey,
        );

        // nock.isDone() will only return true if stub the stub was called, in this way, we can verify
        // the retry logic first hit the error response, retried, and was successful
        expect(optionsRequest.isDone()).toBeTruthy;
        expect(error.isDone()).toBeTruthy;
        expect(success.isDone()).toBeTruthy;
        expect(AddRow).toHaveBeenCalled();
    });
    // TODO: Add more tests
});
