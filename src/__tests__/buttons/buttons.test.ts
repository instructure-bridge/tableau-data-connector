import nock from 'nock';
import { Buttons } from '../../buttons/buttons';

describe('Buttons', function () {
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

    class TestClass extends Buttons {
        constructor() {
            super();
        }
    }

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

        await new TestClass().getRequiredParameterData(
            testUrl,
            'foo',
            apiKey,
            '',
        );

        // nock.isDone() will only return true if stub the stub was called, in this way, we can verify
        // the retry logic first hit the error response, retried, and was successful
        expect(optionsRequest.isDone()).toBeTruthy;
        expect(error.isDone()).toBeTruthy;
        expect(success.isDone()).toBeTruthy;
    });
    // TODO: Add more tests
});
