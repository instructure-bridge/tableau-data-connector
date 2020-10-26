import { CheckCredentials } from '../../lib/checkCredentials';

jest.mock('../../lib/checkCredentials', () => {
    return {
        CheckCredentials: jest.fn().mockImplementation(() => {
            return {
                performApiCall: () => {
                    'response';
                },
            };
        }),
    };
});

// TODO: add some real tests
describe('CheckCredentials', function () {
    it('tests toast defaults', async () => {
        new CheckCredentials('https://example.com', 'abc123').performApiCall();
        expect(CheckCredentials).toHaveBeenCalledWith(
            'https://example.com',
            'abc123',
        );
    });
});
