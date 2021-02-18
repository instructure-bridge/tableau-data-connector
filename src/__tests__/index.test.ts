// @ts-nocheck
import { Bridge } from '../api/bridge';
import { AddRow } from '../api/addRow';
import { tables } from '../tables/api/author';
import { FakeTable } from './helpers';

describe('bridgeAPI', function () {
    it('try row code', async () => {
        let table = new FakeTable('table1');
        let table1 = JSON.parse(
            JSON.stringify(tables['authorListEnrollments']),
        );
        let myTables = { table1: table1 };
        let result = JSON.parse(
            '{ "meta": {}, "linked": { "course_templates": [ { "id": "27" } ], "learners": [ { "id": "1", "name": "Person One", "email": "one@email.com", "avatar_url": null, "deleted": false }, { "id": "2", "name": "Person Two", "email": "two@email.com", "avatar_url": null, "deleted": false } ] }, "enrollments": [ { "id": "83", "course_template": "27", "end_at": "2019-06-28T23:59:59.999-06:00", "progress": 1, "can_be_removed": false, "can_be_made_optional": false, "completed_at": "2019-08-05T14:28:42.051-06:00", "score": 100, "state": "complete", "expires_at": null, "created_at": "2019-06-21T14:03:06.331-06:00", "updated_at": "2020-04-09T09:35:31.083-06:00", "active": true, "required": true, "is_permanently_failed": false, "is_archived": false, "allow_re_enroll": true, "links": { "learner": { "type": "learners", "id": "1" } } }, { "id": "517", "course_template": "27", "end_at": "2020-04-28T23:59:59.999-06:00", "progress": 1, "can_be_removed": false, "can_be_made_optional": false, "completed_at": "2020-04-21T10:59:34.931-06:00", "score": 100, "state": "complete", "expires_at": null, "created_at": "2020-04-21T10:58:59.416-06:00", "updated_at": "2020-04-21T10:59:35.119-06:00", "active": true, "required": true, "is_permanently_failed": false, "is_archived": false, "allow_re_enroll": true, "links": { "learner": { "type": "learners", "id": "2" } } } ] }',
        );

        const addRow = new AddRow(table, myTables, result);
        await addRow.processData();
        expect(table.didAppend).toBeTruthy();
    });

    it('setUrl dev mode', function () {
        let apiCall = 'https://www.testme.com/test';
        let apiKey = 'key';
        let oldEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';

        const bridgeApi = new Bridge(apiCall, apiKey);
        const urlObj = bridgeApi.setUrl();
        process.env.NODE_ENV = oldEnv;

        expect(urlObj.apiCall.toString()).toEqual('http://localhost:8888/test');
        expect(urlObj.headers['Authorization']).toEqual('key');
    });

    it('setUrl not dev mode', function () {
        let apiCall = 'https://www.testme.com/test';
        let apiKey = 'key';
        let oldEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';
        const bridgeApi = new Bridge(apiCall, apiKey);
        const urlObj = bridgeApi.setUrl();
        process.env.NODE_ENV = oldEnv;

        expect(urlObj.apiCall.toString()).toEqual(
            'https://www.testme.com/test',
        );
        expect(urlObj.headers['Authorization']).toEqual('key');
    });
});
