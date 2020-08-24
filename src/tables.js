//enum string names, makes it much easier than using the tableau enum
//dataTypeEnum: { bool: "bool", date: "date", datetime: "datetime", float: "float", int: "int", string: "string", geometry: "geometry" }

export var tables = {
    authorUser: {
        table: {
            id: "authorUser",
            alias: "All Users",
            columns: [{
                alias: "User ID",
                id: "id",
                dataType: "int"
            }, {
                alias: "First Name",
                id: "first_name",
                dataType: "string"
            }, {
                alias: "Last Name",
                id: "last_name",
                dataType: "string"
            }, {
                alias: "Sortable Name",
                id: "sortable_name",
                dataType: "string"
            }, {
                alias: "Department",
                id: "department",
                dataType: "string"
            }, {
                alias: "Job Title",
                id: "job_title",
                dataType: "string"
            }]
        },
        path: "/api/author/users",
        data: "users"
    },
    authorCourseTemplates: {
        table: {
            id: "authorCourseTemplates",
            alias: "All Courses",
            columns: [{
                alias: "Course ID",
                id: "id",
                dataType: "int"
            }, {
                alias: "Course Title",
                id: "title",
                dataType: "string"
            }, {
                alias: "Is Published",
                id: "is_published",
                dataType: "bool"
            }]
        },
        path: "/api/author/course_templates",
        data: "course_templates"
    },
    authorListEnrollments: {
        table: {
            id: "authorListEnrollments",
            alias: "Course Enrollments",
            columns: [{
                alias: "Enrollment ID",
                id: "id",
                dataType: "int"
            }, {
                alias: "Score",
                id: "score",
                dataType: "int"
            }, {
                alias: "Is Required",
                id: "required",
                dataType: "bool"
            },
            {
                alias: "Name",
                id: "name",
                linkedSource: "learner",
                linkedId: "name",
                dataType: "string"
            },
            {
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
            alias: "All Programs",
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
                alias: "Unfinished Learners",
                id: "unfinished_learners_count",
                dataType: "int"
            }, {
                alias: "Is Published",
                id: "is_published",
                dataType: "bool"
            }]
        },
        path: "/api/author/programs",
        data: "programs"
    }
};