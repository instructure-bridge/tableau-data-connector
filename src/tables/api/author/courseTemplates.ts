import { TableName } from "./interface"

let table:TableName = {
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
    data: "course_templates",
    parameters: [
      {
        name: "Sort",
        parameter: "sort",
        type: "options",
        default: "Default",
        options: [
          {
            name: "Newest",
            value: "newest"
          },
          {
            name: "Title",
            value: "title"
          },
          {
            name: "Updated",
            value: "updated"
          },
          {
            name: "Archived",
            value: "archived"
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
      }
    ]
  },
}

export { table as courseTemplates };
