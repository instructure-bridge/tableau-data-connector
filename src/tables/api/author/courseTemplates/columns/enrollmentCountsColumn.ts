import { Column } from '../../interface';

const enrollmentCountsColumn: Array<Column> = [
    {
        alias: 'Enrollment Count - All',
        id: 'enrollment-counts_all',
        parent_id: 'enrollment_counts',
        sub_id: 'all',
        dataType: 'int',
    },
    {
        alias: 'Enrollment Count - Required',
        id: 'enrollment-counts_required',
        parent_id: 'enrollment_counts',
        sub_id: 'required',
        dataType: 'int',
    },
    {
        alias: 'Enrollment Count - Optional',
        id: 'enrollment-counts_optional',
        parent_id: 'enrollment_counts',
        sub_id: 'optional',
        dataType: 'int',
    },
    {
        alias: 'Enrollment Count - Finished',
        id: 'enrollment-counts_finished',
        parent_id: 'enrollment_counts',
        sub_id: 'finished',
        dataType: 'int',
    },
    {
        alias: 'Enrollment Count - In Progress',
        id: 'enrollment-counts_in-progress',
        parent_id: 'enrollment_counts',
        sub_id: 'in_progress',
        dataType: 'int',
    },
    {
        alias: 'Enrollment Count - Incomplete',
        id: 'enrollment-counts_incomplete',
        parent_id: 'enrollment_counts',
        sub_id: 'incomplete',
        dataType: 'int',
    },
    {
        alias: 'Enrollment Count - Incomplete or Finished',
        id: 'enrollment-counts_incomplete-or-finished',
        parent_id: 'enrollment_counts',
        sub_id: 'incomplete_or_finished',
        dataType: 'int',
    },
    {
        alias: 'Enrollment Count - Not Started',
        id: 'enrollment-counts_not-started',
        parent_id: 'enrollment_counts',
        sub_id: 'not_started',
        dataType: 'int',
    },
    {
        alias: 'Enrollment Count - Overdue',
        id: 'enrollment-counts_overdue',
        parent_id: 'enrollment_counts',
        sub_id: 'overdue',
        dataType: 'int',
    },
];

export { enrollmentCountsColumn };
