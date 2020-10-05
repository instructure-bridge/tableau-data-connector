import { TableName } from "./interface"

let table:TableName = {
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
}

export { table as programs };
