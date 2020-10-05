import { TableName } from './interface';

let table: TableName = {
    authorGroups: {
        table: {
            id: 'authorGroups',
            alias: 'List Groups',
            columns: [
                {
                    alias: 'Group ID',
                    id: 'id',
                    dataType: 'int',
                },
                {
                    alias: 'Group Name',
                    id: 'name',
                    dataType: 'string',
                },
            ],
        },
        path: '/api/author/groups',
        data: 'groups',
    },
};

export { table as groups };
