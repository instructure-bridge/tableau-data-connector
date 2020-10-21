import { TableName } from './interface';

const table: TableName = {
    authorListProgramLearners: {
        table: {
            id: 'authorListProgramLearners',
            alias: 'Specific Program Learners',
            columns: [
                {
                    alias: 'User ID',
                    id: 'id',
                    dataType: 'int',
                },
                {
                    alias: 'Name',
                    id: 'name',
                    dataType: 'string',
                },
            ],
        },
        path: '/api/author/programs/*/learners',
        data: 'learners',
        requiredParameter: {
            title: 'Program',
            path: '/api/author/programs',
            data: 'programs',
            nameCol: 'title',
            valCol: 'id',
        },
    },
};

export { table as listProgramLearners };
