import { TableName } from './interface';

const table: TableName = {
    authorUser: {
        table: {
            id: 'authorUser',
            alias: 'List Users',
            columns: [
                {
                    alias: 'User ID',
                    id: 'id',
                    dataType: 'int',
                },
                {
                    alias: 'Unique Login ID',
                    id: 'uid',
                    dataType: 'string',
                },
                {
                    alias: 'HRIS ID',
                    id: 'hris_id',
                    dataType: 'string',
                },
                {
                    alias: 'First Name',
                    id: 'first_name',
                    dataType: 'string',
                },
                {
                    alias: 'Last Name',
                    id: 'last_name',
                    dataType: 'string',
                },
                {
                    alias: 'Language',
                    id: 'locale',
                    dataType: 'string',
                },
                {
                    alias: 'Email Address',
                    id: 'email',
                    dataType: 'string',
                },
                {
                    alias: 'Welcomed to Bridge',
                    id: 'welcomedAt',
                    dataType: 'datetime',
                },
                {
                    alias: 'Last Login',
                    id: 'loggedInAt',
                    dataType: 'datetime',
                },
                {
                    alias: 'Password is Set',
                    id: 'passwordIsSet',
                    dataType: 'bool',
                },
                {
                    alias: 'Full Name',
                    id: 'full_name',
                    dataType: 'string',
                },
                {
                    alias: 'Name',
                    id: 'name',
                    dataType: 'string',
                },
                {
                    alias: 'Avatar URL',
                    id: 'avatar_url',
                    dataType: 'string',
                },
                {
                    alias: 'Deleted At',
                    id: 'deleted_at',
                    dataType: 'datetime',
                },
                {
                    alias: 'Updated At',
                    id: 'updated_at',
                    dataType: 'datetime',
                },
                {
                    alias: 'Unsubscribed from Emails',
                    id: 'unsubscribed',
                    dataType: 'bool',
                },
                {
                    alias: 'Hire Date',
                    id: 'hire_date',
                    dataType: 'date',
                },
                {
                    alias: 'Is a Manager',
                    id: 'is_manager',
                    dataType: 'bool',
                },
                {
                    alias: 'Job Title',
                    id: 'job_title',
                    dataType: 'string',
                },
                {
                    alias: 'User Bio',
                    id: 'bio',
                    dataType: 'string',
                },
                {
                    alias: 'Sortable Name',
                    id: 'sortable_name',
                    dataType: 'string',
                },
                {
                    alias: 'Department',
                    id: 'department',
                    dataType: 'string',
                },
                {
                    alias: 'Roles',
                    id: 'roles',
                    dataType: 'string',
                    originalType: 'array',
                },
            ],
        },
        path: '/api/author/users',
        data: 'users',
        parameters: [
            {
                name: 'Sort',
                parameter: 'sort',
                type: 'options',
                default: 'Default',
                options: [
                    {
                        name: 'Name',
                        value: 'name',
                    },
                    {
                        name: 'Number of Completed Courses',
                        value: 'complete_courses_count',
                    },
                    {
                        name: 'Next Due Date',
                        value: 'next_due_date',
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
                name: 'Role',
                parameter: 'role',
                type: 'options',
                default: 'Any',
                options: [
                    {
                        name: 'Account Admin',
                        value: 'account_admin',
                    },
                    {
                        name: 'Admin',
                        value: 'admin',
                    },
                    {
                        name: 'Author',
                        value: 'author',
                    },
                ],
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
            {
                name: 'Only Managers',
                parameter: 'only_managers',
                type: 'boolean',
            },
        ],
    },
};

export { table as users };
