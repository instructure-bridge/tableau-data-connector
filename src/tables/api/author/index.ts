// @ts-nocheck
//enum string names, makes it much easier than using the tableau enum
//dataTypeEnum: { bool: "bool", date: "date", datetime: "datetime", float: "float", int: "int", string: "string", geometry: "geometry" }
import { TableName } from './interface';
import { courseTemplates } from './courseTemplates';
//import { groups } from './groups';
import { listEnrollments } from './listEnrollments';
//import { listProgramLearners } from './listProgramLearners';
//import { liveCourseSessions } from './liveCourseSessions';
//import { liveCourses } from './liveCourses';
//import { programs } from './programs';
//import { taggedItems } from './taggedItems';
//import { tags } from './tags';
//import { tasks } from './tasks';
import { users } from './users';

// Commenting out tables we do not want to make available yet.
const tables: TableName = {
    ...courseTemplates,
    //...groups,
    ...listEnrollments,
    //...listProgramLearners,
    //...liveCourseSessions,
    //...liveCourses,
    //...programs,
    //...taggedItems,
    //...tags,
    //...tasks,
    ...users,
};

export { tables, TableName };
