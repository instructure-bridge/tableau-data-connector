import { TableName } from './interface';

let table: TableName = {
    authorTaggedItems: {
        table: {
            id: 'authorTaggedItems',
            alias: 'Tagged Items',
            columns: [
                {
                    alias: 'Item ID',
                    id: 'id',
                    dataType: 'int',
                },
                {
                    alias: 'Tag ID',
                    id: 'tag_id',
                    dataType: 'int',
                },
                {
                    alias: 'Taggable Type',
                    id: 'taggable_type',
                    dataType: 'string',
                },
                {
                    alias: 'Item Title',
                    id: 'item-title',
                    parent_id: 'data',
                    sub_id: 'title',
                    dataType: 'string',
                },
            ],
        },
        path: '/api/author/tags/*/taggings',
        data: 'taggings',
        requiredParameter: {
            title: 'Tag',
            path: '/api/author/tags',
            data: 'tags',
            nameCol: 'name',
            valCol: 'id',
        },
    },
};

export { table as taggedItems };
