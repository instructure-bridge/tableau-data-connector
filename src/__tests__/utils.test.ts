import { isJsonString } from '../utils';

describe('utils', function () {
    describe('isJsonString', function () {
        it('tests if json', async () => {
            const data = {
                url: 'http://www.example.com',
            };

            const dataJson: any = JSON.stringify(data);

            expect(isJsonString(data)).toBeFalsy;
            expect(isJsonString(dataJson)).toBeTruthy;
        });
    });
});
