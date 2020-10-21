import { Column } from '../../interface';

const authorColumn: Array<Column> = [
    {
        alias: 'Author ID',
        id: 'author_id',
        parent_id: 'author',
        sub_id: 'id',
        dataType: 'int',
    },
];

export { authorColumn };
