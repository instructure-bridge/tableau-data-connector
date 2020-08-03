export var tables = {
    authorUser: {
        table: {
            id: "authorUser",
            alias: "All Users",
            columns: [{
                alias: "User ID",
                id: "id",
                dataType: tableau.dataTypeEnum.int
            }, {
                alias: "First Name",
                id: "first_name",
                dataType: tableau.dataTypeEnum.string
            }, {
                alias: "Last Name",
                id: "last_name",
                dataType: tableau.dataTypeEnum.string
            }, {
                alias: "Sortable Name",
                id: "sortable_name",
                dataType: tableau.dataTypeEnum.string
            }, {
                alias: "Department",
                id: "department",
                dataType: tableau.dataTypeEnum.string
            }, {
                alias: "Job Title",
                id: "job_title",
                dataType: tableau.dataTypeEnum.string
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
                dataType: tableau.dataTypeEnum.int
            }, {
                alias: "Course Title",
                id: "title",
                dataType: tableau.dataTypeEnum.string
            }, {
                alias: "Is Published",
                id: "is_published",
                dataType: tableau.dataTypeEnum.bool
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
                dataType: tableau.dataTypeEnum.int
            }, {
                alias: "Score",
                id: "score",
                dataType: tableau.dataTypeEnum.int
            }, {
                alias: "Is Required",
                id: "required",
                dataType: tableau.dataTypeEnum.bool
            },
            {
                alias: "Name",
                id: "name",
                linkedSource: "learner",
                linkedId: "name",
                dataType: tableau.dataTypeEnum.bool
            },
            {
                alias: "User ID",
                id: "user_id",
                linkedSource: "learner",
                linkedId: "id",
                dataType: tableau.dataTypeEnum.int
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
                dataType: tableau.dataTypeEnum.int
            }, {
                alias: "Program Title",
                id: "title",
                dataType: tableau.dataTypeEnum.string
            }, {
                alias: "Course Count",
                id: "course_count",
                dataType: tableau.dataTypeEnum.int
            }, {
                alias: "Unfinished Learners",
                id: "unfinished_learners_count",
                dataType: tableau.dataTypeEnum.int
            }, {
                alias: "Is Published",
                id: "is_published",
                dataType: tableau.dataTypeEnum.bool
            }]
        },
        path: "/api/author/programs",
        data: "programs"
    }
};