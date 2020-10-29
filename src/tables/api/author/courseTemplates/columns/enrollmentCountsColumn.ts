import { Column } from '../../interface';

const enrollmentCountsColumn: Array<Column> = [
    {
        alias: 'Enrollment Count - All',
        id: 'enrollment_counts_all',
        parent_id: 'enrollment_counts',
        sub_id: 'all',
        dataType: 'int',
    },
    {
        alias: 'Enrollment Count - Required',
        id: 'enrollment_counts_required',
        parent_id: 'enrollment_counts',
        sub_id: 'required',
        dataType: 'int',
    },
    {
        alias: 'Enrollment Count - Optional',
        id: 'enrollment_counts_optional',
        parent_id: 'enrollment_counts',
        sub_id: 'optional',
        dataType: 'int',
    },
    {
        alias: 'Enrollment Count - Finished',
        id: 'enrollment_counts_finished',
        parent_id: 'enrollment_counts',
        sub_id: 'finished',
        dataType: 'int',
    },
    {
        alias: 'Enrollment Count - In Progress',
        id: 'enrollment_counts_in_progress',
        parent_id: 'enrollment_counts',
        sub_id: 'in_progress',
        dataType: 'int',
    },
    {
        alias: 'Enrollment Count - Incomplete',
        id: 'enrollment_counts_incomplete',
        parent_id: 'enrollment_counts',
        sub_id: 'incomplete',
        dataType: 'int',
    },
    {
        alias: 'Enrollment Count - Incomplete or Finished',
        id: 'enrollment_counts_incomplete_or_finished',
        parent_id: 'enrollment_counts',
        sub_id: 'incomplete_or_finished',
        dataType: 'int',
    },
    {
        alias: 'Enrollment Count - Not Started',
        id: 'enrollment_counts_not_started',
        parent_id: 'enrollment_counts',
        sub_id: 'not_started',
        dataType: 'int',
    },
    {
        alias: 'Enrollment Count - Overdue',
        id: 'enrollment_counts_overdue',
        parent_id: 'enrollment_counts',
        sub_id: 'overdue',
        dataType: 'int',
    },
];

export { enrollmentCountsColumn };
