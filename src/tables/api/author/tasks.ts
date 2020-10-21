import { TableName } from './interface';

const table: TableName = {
    authorTasks: {
        table: {
            id: 'authorTasks',
            alias: 'List Checkpoints',
            columns: [
                {
                    alias: 'Checkpoint ID',
                    id: 'id',
                    dataType: 'int',
                },
                {
                    alias: 'Checkpoint Title',
                    id: 'namr',
                    dataType: 'string',
                },
            ],
        },
        path: '/api/author/tasks',
        data: 'tasks',
    },
};

export { table as tasks };
