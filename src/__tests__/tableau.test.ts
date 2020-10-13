import { Tableau } from '../tableau';
import { FakeTable } from './helpers';

describe('tableau', function () {
    let table: FakeTable;
    let tableau: any;

    beforeEach(() => {
        table = new FakeTable('table1');
        tableau = new Tableau('foo');
    });

    it('sets connection data', async () => {
        const data = {
            url: 'http://www.example.com',
            tables: table,
        };

        const dataJson: any = JSON.stringify(data);

        tableau.connectionData = dataJson;
        expect(tableau.connectionData).toEqual(dataJson);
    });

    it('converts connection data to json', async () => {
        const data = {
            url: 'http://www.example.com',
            tables: table,
        };

        const dataJson: any = JSON.stringify(data);

        tableau.connectionData = data;
        expect(tableau.connectionData).toEqual(dataJson);
    });

    it('sets api key', async () => {
        const apiKey: string = 'Basic abc123';

        tableau.apiKey = apiKey;
        expect(tableau.apiKey).toEqual(apiKey);
    });
});
