import { TableName } from './interface';

const table: TableName = {
    authorTags: {
        table: {
            id: 'authorTags',
            alias: 'List Tags',
            columns: [
                {
                    alias: 'Tag ID',
                    id: 'id',
                    dataType: 'int',
                },
                {
                    alias: 'Tag Name',
                    id: 'name',
                    dataType: 'string',
                },
            ],
        },
        path: '/api/author/tags',
        data: 'tags',
    },
};

export { table as tags };
