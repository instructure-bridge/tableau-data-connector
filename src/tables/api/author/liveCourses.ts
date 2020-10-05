import { TableName } from './interface';

let table: TableName = {
    authorLiveCourses: {
        table: {
            id: 'authorLiveCourses',
            alias: 'List Live Courses',
            columns: [
                {
                    alias: 'Live Course ID',
                    id: 'id',
                    dataType: 'int',
                },
                {
                    alias: 'Live Course Title',
                    id: 'title',
                    dataType: 'string',
                },
            ],
        },
        path: '/api/author/live_courses',
        data: 'live_courses',
    },
};

export { table as liveCourses };
