import { Column } from '../../interface';

const customFieldsColumn: Array<Column> = [
    {
        alias: 'Custom Fields',
        id: 'custom_fields',
        linksSource: 'custom_field_values',
        linkedSource: 'custom_field_values',
        dataType: 'string',
        originalType: 'object',
        optionalParameter: 'custom_fields',
    },
];

export { customFieldsColumn };
