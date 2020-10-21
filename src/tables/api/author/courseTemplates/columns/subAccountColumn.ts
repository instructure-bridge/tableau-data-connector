import { Column } from '../../interface';

const subAccountColumn: Array<Column> = [
    {
        alias: 'SubAccount ID',
        id: 'sub_account_id',
        parent_id: 'sub_account',
        sub_id: 'id',
        dataType: 'int',
    },
    {
        alias: 'SubAccount Name',
        id: 'sub_account_name',
        parent_id: 'sub_account',
        sub_id: 'name',
        dataType: 'string',
    },
    {
        alias: 'SubAccount Is Root',
        id: 'sub_account_is_root',
        parent_id: 'sub_account',
        sub_id: 'is_root',
        dataType: 'bool',
    },
];

export { subAccountColumn };
