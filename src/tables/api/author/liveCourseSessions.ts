import { TableName } from './interface';

const table: TableName = {
    authorLiveCourseSessions: {
        table: {
            id: 'authorLiveCourseSessions',
            alias: 'Specific Live Course Sessions',
            columns: [
                {
                    alias: 'Live Course Session ID',
                    id: 'id',
                    dataType: 'int',
                },
                {
                    alias: 'Start At',
                    id: 'start_at',
                    dataType: 'datetime',
                },
                {
                    alias: 'End At',
                    id: 'end_at',
                    dataType: 'datetime',
                },
                {
                    alias: 'Location',
                    id: 'location',
                    dataType: 'string',
                },
                {
                    alias: 'Number of Seats',
                    id: 'seats',
                    dataType: 'int',
                },
            ],
        },
        path: '/api/author/live_courses/*/sessions',
        data: 'sessions',
        //requiredParameter: {
        //title: 'Live Course',
        //path: '/api/author/live_courses',
        //data: 'live_courses',
        //nameCol: 'title',
        //valCol: 'id',
        //},
    },
};

export { table as liveCourseSessions };
