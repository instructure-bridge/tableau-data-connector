import { Strategy } from './strategyInterface';
import { isObject } from '../../lib/utils';
import { dataNormalizer } from '../apiUtils';

interface Links {
    id: string;
    type: string;
}

interface CustomFieldLink {
    custom_field: Links;
}

interface CustomFieldValue {
    id: string;
    value: string;
    links: CustomFieldLink;
}

interface CustomField {
    id: string;
    name: string;
}

class CustomFieldStrategy implements Strategy {
    /**
     * Processes a response item when custom_fields is defined in the table column
     *
     * @privateRemarks
     * custom_fields should only be defined on the users table
     *
     * @param column - A column defined in tables. @see {@link tables}
     * @example column object
     * ```
     *{
     *    alias: 'Custom Fields',
     *    id: 'custom_fields',
     *    customFields: 'custom_field_values'
     *    originalType: 'array',
     *    dataType: 'string',
     *},
     * ```
     * @param data - The data to process(from Axios response)
     * @example data object
     * ```
     * {
     *   id: "1",
     *   first_name: "Foobar",
     *   last_name: "Baz",
     *   links: {
     *     custom_field_values: ["101", "102", "103"]
     *   },
     *   ...
     * }
     * ```
     * @param linkedData - linked data object from Axios response
     * @example linkedData object:
     * ```
     * {
     *   custom_field_values: [
     *     {
     *       id: "101",
     *       value: "omnis",
     *       links: {
     *         custom_field: {
     *           id: "1",
     *           type: "custom_fields"
     *         }
     *       }
     *     }
     *     ...
     *   ],
     *   custom_fields: [
     *     {
     *       id: "1",
     *       name: "lorem-0",
     *     },
     *     ...
     *   ]
     * }
     * ```
     */
    processData(column: any, data: any, linkedData: any): Array<any> {
        const tableauId = column.id;
        const customFieldValueIds: Array<string> =
            data['links'][column.linksSource];
        const customFieldValues: Array<CustomFieldValue> =
            linkedData[column.linkedSource];
        const customFields: Array<CustomField> = linkedData['custom_fields'];
        const customFieldMap = {};

        customFieldValueIds.forEach((id) => {
            const customFieldValue: CustomFieldValue = customFieldValues.find(
                (item) => {
                    return item.id === id;
                },
            );

            const customField: CustomField = customFields.find((item) => {
                return customFieldValue.links.custom_field.id === item.id;
            });

            customFieldMap[customField.name] = customFieldValue.value;
        });

        if (isObject(customFieldMap)) {
            return [tableauId, dataNormalizer(column, customFieldMap)];
        } else {
            return [tableauId, null];
        }
    }
}

export { CustomFieldStrategy };
