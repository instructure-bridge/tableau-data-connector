import { TableName } from './interface';
// Items with parent_ids are essentially response object definitions...
// Example author: { name, id, uid }
import {
    authorColumn,
    enrollmentCountsColumn,
    subAccountColumn,
} from './courseTemplates/columns/';

const table: TableName = {
    authorCourseTemplates: {
        table: {
            id: 'authorCourseTemplates',
            alias: 'List Courses',
            columns: [
                {
                    alias: 'Course ID',
                    id: 'id',
                    dataType: 'int',
                },
                {
                    alias: 'Estimated Time',
                    id: 'estimated_time',
                    dataType: 'int',
                },
                {
                    alias: 'Course Title',
                    id: 'title',
                    dataType: 'string',
                },
                {
                    alias: 'Created At',
                    id: 'created_at',
                    dataType: 'datetime',
                },
                {
                    alias: 'Default Due On Date',
                    id: 'default_due_on_date',
                    dataType: 'datetime',
                },
                {
                    alias: 'Has Been Unpublished',
                    id: 'has_been_unpublished',
                    dataType: 'bool',
                },
                {
                    alias: 'Is Archived',
                    id: 'is_archived',
                    dataType: 'bool',
                },
                {
                    alias: 'Archived At',
                    id: 'archived_at',
                    dataType: 'datetime',
                },
                {
                    alias: 'Is Published',
                    id: 'is_published',
                    dataType: 'bool',
                },
                {
                    alias: 'Passing Threshold',
                    id: 'passing_threshold',
                    dataType: 'int',
                },
                {
                    alias: 'Quizzes Count',
                    id: 'quizzes_count',
                    dataType: 'int',
                },
                {
                    alias: 'Uses Bridge Retain',
                    id: 'retain',
                    dataType: 'bool',
                },
                {
                    alias: 'Updated At',
                    id: 'updated_at',
                    dataType: 'datetime',
                },
                {
                    alias: 'Max Quiz Attempts',
                    id: 'max_quiz_attempts',
                    dataType: 'int',
                },
                {
                    alias: 'Continuing Education Credits',
                    id: 'continuing_education_credits',
                    dataType: 'int',
                },
                {
                    alias: 'Description of Course',
                    id: 'description',
                    dataType: 'string',
                },
                {
                    alias: 'Has unpublished changes',
                    id: 'has_unpublished_changes',
                    dataType: 'bool',
                },
                {
                    alias: 'Course Type',
                    id: 'course_type',
                    dataType: 'string',
                },
                {
                    alias: 'Enrollments Count',
                    id: 'enrollments_count',
                    dataType: 'int',
                },
                {
                    alias: 'Incomplete Enrollments Count',
                    id: 'incomplete_enrollments_count',
                    dataType: 'int',
                },
                {
                    alias: 'Attachments Count',
                    id: 'attachments_count',
                    dataType: 'int',
                },
                {
                    alias: 'Third Party Course Id',
                    id: 'third_party_course_id',
                    dataType: 'string',
                },
                {
                    alias: 'Show Correct Response',
                    id: 'show_correct_response',
                    dataType: 'bool',
                },
                {
                    alias: 'Branding Override',
                    id: 'branding_override',
                    dataType: 'bool',
                },
                {
                    alias: 'Course Tags',
                    id: 'tags',
                    dataType: 'string', // array
                },
                {
                    alias: 'Course Categories',
                    id: 'categories',
                    dataType: 'string', // array
                },
                {
                    alias: 'Quizzes Open Book',
                    id: 'open_book',
                    dataType: 'bool',
                },
                {
                    alias: 'External Course ID',
                    id: 'external_course_id',
                    dataType: 'string',
                },
                {
                    alias: 'Due Date Type (Relative, Fixed)',
                    id: 'due_date_type',
                    dataType: 'string',
                },
                {
                    alias: 'Default Days Until Due',
                    id: 'default_days_until_due',
                    dataType: 'datetime',
                },
                {
                    alias: 'Course Registration URL',
                    id: 'enroll_url',
                    dataType: 'string',
                },
                ...authorColumn,
                ...enrollmentCountsColumn,
                ...subAccountColumn,
            ],
        },
        path: '/api/author/course_templates',
        data: 'course_templates',
        parameters: [
            {
                name: 'Sort',
                parameter: 'sort',
                type: 'options',
                default: 'Default',
                options: [
                    {
                        name: 'Newest',
                        value: 'newest',
                    },
                    {
                        name: 'Title',
                        value: 'title',
                    },
                    {
                        name: 'Updated',
                        value: 'updated',
                    },
                    {
                        name: 'Archived',
                        value: 'archived',
                    },
                ],
            },
            {
                name: 'Search',
                parameter: 'search',
                type: 'string',
                placeholder: 'search terms',
            },
            {
                name: 'Filters',
                parameter: 'filters',
                type: 'filters',
                default: 'Default',
                options: [
                    {
                        name: 'My Courses',
                        value: 'my_courses',
                    },
                    {
                        name: 'Unpublished',
                        value: 'unpublished',
                    },
                    {
                        name: 'Has Certificate',
                        value: 'has_certificate',
                    },
                    {
                        name: 'No Enrollments',
                        value: 'no_enrollments',
                    },
                    {
                        name: 'Bridge Courses',
                        value: 'bridge',
                    },
                    {
                        name: 'Scorm Courses',
                        value: 'scorm',
                    },
                    {
                        name: 'Lynda Courses',
                        value: 'lynda',
                    },
                    {
                        name: 'Opensesame Courses',
                        value: 'opensesame',
                    },
                ],
            },
            {
                name: 'Only Deleted',
                parameter: 'only_deleted',
                type: 'boolean',
            },
            {
                name: 'Include Deleted',
                parameter: 'with_deleted',
                type: 'boolean',
            },
            {
                name: 'Updated After',
                parameter: 'updated_after',
                type: 'date',
            },
            {
                name: 'Created After',
                parameter: 'created_after',
                type: 'date',
            },
            {
                name: 'Deleted After',
                parameter: 'deleted_after',
                type: 'date',
            },
            {
                name: 'Updated Before',
                parameter: 'updated_before',
                type: 'date',
            },
            {
                name: 'Created Before',
                parameter: 'created_before',
                type: 'date',
            },
            {
                name: 'Deleted Before',
                parameter: 'deleted_before',
                type: 'date',
            },
        ],
    },
};

export { table as courseTemplates };
