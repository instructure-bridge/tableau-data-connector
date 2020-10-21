import { Column } from '../../interface';

const metaColumn: Array<Column> = [
    {
        alias: 'Meta Domain ID',
        id: 'meta_domain_id',
        parent_id: 'meta',
        sub_id: 'domain_id',
        dataType: 'string',
    },
    {
        alias: 'SubAccount ID',
        id: 'meta_sub_account_id',
        parent_id: 'meta',
        sub_id: 'sub_account_id',
        dataType: 'string',
    },
];

export { metaColumn };
