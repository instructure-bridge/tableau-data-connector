import { TableName } from './interface';

let table: TableName = {
    authorListEnrollments: {
        table: {
            id: 'authorListEnrollments',
            alias: 'Specific Course Enrollments',
            columns: [
                {
                    alias: 'Enrollment ID',
                    id: 'id',
                    dataType: 'int',
                },
                {
                    alias: 'Course ID',
                    id: 'course_template',
                    dataType: 'int',
                },
                {
                    alias: 'Due At',
                    id: 'end_at',
                    dataType: 'datetime',
                },
                {
                    alias: 'Expire At',
                    id: 'expires_at',
                    dataType: 'datetime',
                },
                {
                    alias: 'Completed At',
                    id: 'completed_at',
                    dataType: 'datetime',
                },
                {
                    alias: 'Updated At',
                    id: 'updated_at',
                    dataType: 'datetime',
                },
                {
                    alias: 'Course Progress',
                    id: 'progress',
                    dataType: 'float',
                },
                {
                    alias: 'Is Removable',
                    id: 'can_be_removed',
                    dataType: 'bool',
                },
                {
                    alias: 'Is Able To Be Optional',
                    id: 'can_be_made_optional',
                    dataType: 'bool',
                },
                {
                    alias: 'Is Active',
                    id: 'active',
                    dataType: 'bool',
                },
                {
                    alias: 'Is Required',
                    id: 'required',
                    dataType: 'bool',
                },
                {
                    alias: 'Is Permanently Failed',
                    id: 'is_permanently_failed',
                    dataType: 'bool',
                },
                {
                    alias: 'Is Archived',
                    id: 'is_archived',
                    dataType: 'bool',
                },
                {
                    alias: 'Score',
                    id: 'score',
                    dataType: 'int',
                },
                {
                    alias: 'Enrollment Status',
                    id: 'state',
                    dataType: 'string',
                },
                {
                    alias: 'Can Re-Enroll',
                    id: 'allow_re_enroll',
                    dataType: 'bool',
                },
                {
                    alias: 'Name',
                    id: 'name',
                    linkedSource: 'learner',
                    linkedId: 'name',
                    dataType: 'string',
                },
                {
                    alias: 'User ID',
                    id: 'user_id',
                    linkedSource: 'learner',
                    linkedId: 'id',
                    dataType: 'int',
                },
            ],
        },
        path: '/api/author/course_templates/*/enrollments',
        data: 'enrollments',
        requiredParameter: {
            title: 'Course',
            path: '/api/author/course_templates',
            data: 'course_templates',
            nameCol: 'title',
            valCol: 'id',
        },
    },
};

export { table as listEnrollments };
