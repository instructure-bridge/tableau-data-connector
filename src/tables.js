//enum string names, makes it much easier than using the tableau enum
//dataTypeEnum: { bool: "bool", date: "date", datetime: "datetime", float: "float", int: "int", string: "string", geometry: "geometry" }

export var tables = {
    authorUser: {
        table: {
            id: "authorUser",
            alias: "List Users",
            columns: [{
                alias: "User ID",
                id: "id",
                dataType: "int"
            }, {
                alias: "Unique Login ID",
                id: "uid",
                dataType: "string"
            }, {
                alias: "First Name",
                id: "first_name",
                dataType: "string"
            }, {
                alias: "Last Name",
                id: "last_name",
                dataType: "string"
            }, {
                alias: "Language",
                id: "locale",
                dataType: "string"
            }, {
                alias: "Email Address",
                id: "email",
                dataType: "string"
            }, {
                alias: "Full Name",
                id: "name",
                dataType: "string"
            }, {
                alias: "Deleted At",
                id: "deleted_at",
                dataType: "datetime"
            }, {
                alias: "Updated At",
                id: "updated_at",
                dataType: "datetime"
            }, {
                alias: "Unsubscribed from Emails",
                id: "unsubscribed",
                dataType: "bool"
            }, {
                alias: "Hire Date",
                id: "hire_date",
                dataType: "date"
            }, {
                alias: "Job Title",
                id: "job_title",
                dataType: "string"
            }, {
                alias: "Sortable Name",
                id: "sortable_name",
                dataType: "string"
            }, {
                alias: "Department",
                id: "department",
                dataType: "string"
            }]
        },
        path: "/api/author/users",
        data: "users",
        parameters: [
            {
                name: "Sort",
                parameter: "sort",
                type: "options",
                default: "Default",
                options: [
                    {
                        name: "Name",
                        value: "name"
                    },
                    {
                        name: "Number of Completed Courses",
                        value: "complete_courses_count"
                    },
                    {
                        name: "Next Due Date",
                        value: "next_due_date"
                    }
                ]
            },
            {
                name: "Search",
                parameter: "search",
                type: "string",
                placeholder: "search terms"
            },
            {
                name: "Only Deleted",
                parameter: "only_deleted",
                type: "boolean",
            },
            {
                name: "Include Deleted",
                parameter: "with_deleted",
                type: "boolean",
            },
            {
                name: "Role",
                parameter: "role",
                type: "options",
                default: "Any",
                options: [
                    {
                        name: "Account Admin",
                        value: "account_admin"
                    },
                    {
                        name: "Admin",
                        value: "admin"
                    },
                    {
                        name: "Author",
                        value: "author"
                    }
                ]
            },
            {
                name: "Updated After",
                parameter: "updated_after",
                type: "date"
            },
            {
                name: "Created After",
                parameter: "created_after",
                type: "date"
            },
            {
                name: "Deleted After",
                parameter: "deleted_after",
                type: "date"
            },
            {
                name: "Updated Before",
                parameter: "updated_before",
                type: "date"
            },
            {
                name: "Created Before",
                parameter: "created_before",
                type: "date"
            },
            {
                name: "Deleted Before",
                parameter: "deleted_before",
                type: "date"
            },
            {
                name: "Only Managers",
                parameter: "only_managers",
                type: "boolean",
            }
        ]
    },
    authorCourseTemplates: {
        table: {
            id: "authorCourseTemplates",
            alias: "List Courses",
            columns: [{
                alias: "Course ID",
                id: "id",
                dataType: "int"
            }, {
                alias: "Estimated Time",
                id: "estimated_time",
                dataType: "int"
            }, {
                alias: "Course Title",
                id: "title",
                dataType: "string"
            }, {
                alias: "Author Name",
                id: "author_name",
                parent_id: "author",
                sub_id: "name",
                dataType: "string"
            }, {
                alias: "Author ID",
                id: "author_id",
                parent_id: "author",
                sub_id: "id",
                dataType: "int"
            }, {
                alias: "Author UID",
                id: "author_uid",
                parent_id: "author",
                sub_id: "uid",
                dataType: "string"
            }, {
                alias: "Created At",
                id: "created_at",
                dataType: "datetime"
            }, {
                alias: "Default Days Until Due",
                id: "default_days_until_due",
                dataType: "int"
            }, {
                alias: "Default Due On Date",
                id: "default_due_on_date",
                dataType: "datetime"
            }, {
                alias: "Due Date Type",
                id: "due_date_type",
                dataType: "string"
            }, {
                alias: "Enrollment Count - All",
                id: "enrollment-counts_all",
                parent_id: "enrollment_counts",
                sub_id: "all",
                dataType: "int"
            }, {
                alias: "Enrollment Count - Required",
                id: "enrollment-counts_required",
                parent_id: "enrollment_counts",
                sub_id: "required",
                dataType: "int"
            }, {
                alias: "Enrollment Count - Optional",
                id: "enrollment-counts_optional",
                parent_id: "enrollment_counts",
                sub_id: "optional",
                dataType: "int"
            }, {
                alias: "Enrollment Count - Finished",
                id: "enrollment-counts_finished",
                parent_id: "enrollment_counts",
                sub_id: "finished",
                dataType: "int"
            }, {
                alias: "Enrollment Count - In Progress",
                id: "enrollment-counts_in-progress",
                parent_id: "enrollment_counts",
                sub_id: "in_progress",
                dataType: "int"
            }, {
                alias: "Enrollment Count - Incomplete",
                id: "enrollment-counts_incomplete",
                parent_id: "enrollment_counts",
                sub_id: "incomplete",
                dataType: "int"
            }, {
                alias: "Enrollment Count - Incomplete or Finished",
                id: "enrollment-counts_incomplete-or-finished",
                parent_id: "enrollment_counts",
                sub_id: "incomplete_or_finished",
                dataType: "int"
            }, {
                alias: "Enrollment Count - Not Started",
                id: "enrollment-counts_not-started",
                parent_id: "enrollment_counts",
                sub_id: "not_started",
                dataType: "int"
            }, {
                alias: "Enrollment Count - Overdue",
                id: "enrollment-counts_overdue",
                parent_id: "enrollment_counts",
                sub_id: "overdue",
                dataType: "int"
            }, {
                alias: "Has Been Unpublished",
                id: "has_been_unpublished",
                dataType: "bool"
            }, {
                alias: "Is Archived",
                id: "is_archived",
                dataType: "bool"
            }, {
                alias: "Is Published",
                id: "is_published",
                dataType: "bool"
            }, {
                alias: "Passing Threshold",
                id: "passing_threshold",
                dataType: "int"
            }, {
                alias: "Quizzes Count",
                id: "quizzes_count",
                dataType: "int"
            }, {
                alias: "Uses Bridge Retain",
                id: "retain",
                dataType: "bool"
            }, {
                alias: "Updated At",
                id: "updated_at",
                dataType: "datetime"
            }]
        },
        path: "/api/author/course_templates",
        data: "course_templates"
    },
    authorListEnrollments: {
        table: {
            id: "authorListEnrollments",
            alias: "Specific Course Enrollments",
            columns: [{
                alias: "Enrollment ID",
                id: "id",
                dataType: "int"
            }, {
                alias: "Course ID",
                id: "course_template",
                dataType: "int"
            }, {
                alias: "Due At",
                id: "end_at",
                dataType: "datetime"
            }, {
                alias: "Expire At",
                id: "expires_at",
                dataType: "datetime"
            }, {
                alias: "Completed At",
                id: "completed_at",
                dataType: "datetime"
            }, {
                alias: "Updated At",
                id: "updated_at",
                dataType: "datetime"
            }, {
                alias: "Course Progress",
                id: "progress",
                dataType: "float"
            }, {
                alias: "Is Removable",
                id: "can_be_removed",
                dataType: "bool"
            }, {
                alias: "Is Able To Be Optional",
                id: "can_be_made_optional",
                dataType: "bool"
            }, {
                alias: "Is Active",
                id: "active",
                dataType: "bool"
            }, {
                alias: "Is Required",
                id: "required",
                dataType: "bool"
            }, {
                alias: "Is Permanently Failed",
                id: "is_permanently_failed",
                dataType: "bool"
            }, {
                alias: "Is Archived",
                id: "is_archived",
                dataType: "bool"
            }, {
                alias: "Score",
                id: "score",
                dataType: "int"
            }, {
                alias: "Enrollment Status",
                id: "state",
                dataType: "string"
            }, {
                alias: "Can Re-Enroll",
                id: "allow_re_enroll",
                dataType: "bool"
            }, {
                alias: "Name",
                id: "name",
                linkedSource: "learner",
                linkedId: "name",
                dataType: "string"
            }, {
                alias: "User ID",
                id: "user_id",
                linkedSource: "learner",
                linkedId: "id",
                dataType: "int"
            }]
        },
        path: "/api/author/course_templates/*/enrollments",
        data: "enrollments",
        requiredParameter: {
            title: "Course",
            path: "/api/author/course_templates",
            data: "course_templates",
            nameCol: "title",
            valCol: "id"
        }
    },
    authorPrograms: {
        table: {
            id: "authorPrograms",
            alias: "List Programs",
            columns: [{
                alias: "Program ID",
                id: "id",
                dataType: "int"
            }, {
                alias: "Program Title",
                id: "title",
                dataType: "string"
            }, {
                alias: "Course Count",
                id: "course_count",
                dataType: "int"
            }, {
                alias: "Created At",
                id: "created_at",
                dataType: "datetime"
            }, {
                alias: "Updated At",
                id: "updated_at",
                dataType: "datetime"
            }, {
                alias: "Deleted At",
                id: "deleted_at",
                dataType: "datetime"
            }, {
                alias: "Number of Courses",
                id: "course_count",
                dataType: "int"
            }, {
                alias: "Number of Items",
                id: "item_count",
                dataType: "int"
            }, {
                alias: "Unfinished Learners",
                id: "unfinished_learners_count",
                dataType: "int"
            }, {
                alias: "Is Published",
                id: "is_published",
                dataType: "bool"
            }, {
                alias: "Able to be Published",
                id: "publishable",
                dataType: "bool"
            }, {
                alias: "Has Unpublished Changes",
                id: "has_unpublished_changes",
                dataType: "bool"
            }, {
                alias: "Has Step Notifications",
                id: "step_notifications",
                dataType: "bool"
            }, {
                alias: "Has Certificate",
                id: "has_certificate",
                dataType: "bool"
            }, {
                alias: "Has Shared Enrollments",
                id: "has_shared_enrollments",
                dataType: "bool"
            }, {
                alias: "Number of Unfinished Learners",
                id: "unfinished_learners_count",
                dataType: "int"
            }, {
                alias: "Due Date Type",
                id: "due_date_type",
                dataType: "string"
            }, {
                alias: "Default Due on Date",
                id: "default_due_on_date",
                dataType: "datetime"
            }, {
                alias: "Default Days Until Due",
                id: "default_days_until_due",
                dataType: "int"
            }]
        },
        path: "/api/author/programs",
        data: "programs"
    },
    authorListProgramLearners: {
        table: {
            id: "authorListProgramLearners",
            alias: "Specific Program Learners",
            columns: [{
                alias: "User ID",
                id: "id",
                dataType: "int"
            }, {
                alias: "Name",
                id: "name",
                dataType: "string"
            }]
        },
        path: "/api/author/programs/*/learners",
        data: "learners",
        requiredParameter: {
            title: "Program",
            path: "/api/author/programs",
            data: "programs",
            nameCol: "title",
            valCol: "id"
        }
    },
    authorLiveCourses: {
        table: {
            id: "authorLiveCourses",
            alias: "List Live Courses",
            columns: [{
                alias: "Live Course ID",
                id: "id",
                dataType: "int"
            }, {
                alias: "Live Course Title",
                id: "title",
                dataType: "string"
            }]
        },
        path: "/api/author/live_courses",
        data: "live_courses"
    },
    authorLiveCourseSessions: {
        table: {
            id: "authorLiveCourseSessions",
            alias: "Specific Program Learners",
            columns: [{
                alias: "Live Course Session ID",
                id: "id",
                dataType: "int"
            }, {
                alias: "Start At",
                id: "start_at",
                dataType: "datetime"
            }, {
                alias: "End At",
                id: "end_at",
                dataType: "datetime"
            }, {
                alias: "Location",
                id: "location",
                dataType: "string"
            }, {
                alias: "Number of Seats",
                id: "seats",
                dataType: "int"
            }]
        },
        path: "/api/author/live_courses/*/sessions",
        data: "sessions",
        requiredParameter: {
            title: "Live Course",
            path: "/api/author/live_courses",
            data: "live_courses",
            nameCol: "title",
            valCol: "id"
        }
    },
    authorTasks: {
        table: {
            id: "authorTasks",
            alias: "List Checkpoints",
            columns: [{
                alias: "Checkpoint ID",
                id: "id",
                dataType: "int"
            }, {
                alias: "Checkpoint Title",
                id: "namr",
                dataType: "string"
            }]
        },
        path: "/api/author/tasks",
        data: "tasks"
    },
    authorGroups: {
        table: {
            id: "authorGroups",
            alias: "List Groups",
            columns: [{
                alias: "Group ID",
                id: "id",
                dataType: "int"
            }, {
                alias: "Group Name",
                id: "name",
                dataType: "string"
            }]
        },
        path: "/api/author/groups",
        data: "groups"
    },
    authorTags: {
        table: {
            id: "authorTags",
            alias: "List Tags",
            columns: [{
                alias: "Tag ID",
                id: "id",
                dataType: "int"
            }, {
                alias: "Tag Name",
                id: "name",
                dataType: "string"
            }]
        },
        path: "/api/author/tags",
        data: "tags"
    },
    authorTaggedItems: {
        table: {
            id: "authorTaggedItems",
            alias: "Tagged Items",
            columns: [{
                alias: "Item ID",
                id: "id",
                dataType: "int"
            }, {
                alias: "Tag ID",
                id: "tag_id",
                dataType: "int"
            }, {
                alias: "Taggable Type",
                id: "taggable_type",
                dataType: "string"
            }, {
                alias: "Item Title",
                id: "item-title",
                parent_id: "data",
                sub_id: "title",
                dataType: "string"
            }]
        },
        path: "/api/author/tags/*/taggings",
        data: "taggings",
        requiredParameter: {
            title: "Tag",
            path: "/api/author/tags",
            data: "tags",
            nameCol: "name",
            valCol: "id"
        }
    }
};