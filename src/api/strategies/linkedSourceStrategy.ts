import { Strategy } from './strategyInterface';
import { isObject } from '../../lib/utils';
import { dataNormalizer } from '../apiUtils';

class LinkedSourceStrategy implements Strategy {
    /**
     * Processes a response item when there is a linkedSource defined in the table column
     * @param column - A column defined in tables. @see {@link tables}
     * @example column object
     * ```
     *{
     *    alias: 'Name',
     *    id: 'name',
     *    linksSource: 'learner',
     *    linksId: 'id',
     *    linkedSource: 'learners',
     *    linkedField: 'name',
     *    dataType: 'string',
     *},
     * ```
     * @param data - The data to process(from Axios response)
     * @example data object
     * ```
     * {
     *   id: "1",
     *   state: "active",
     *   links: {
     *     learner: {
     *       type: "learners",
     *       id: "101"
     *     },
     *     ...
     *   },
     *   ...
     * }
     * ```
     * @param linkedData - linked data object from Axios response
     * @example linkedData object:
     * ```
     * {
     *   course_templates: [{id: "1"}],
     *   learners: [
     *     {
     *       id: "101",
     *       name: "Foobar Baz",
     *       ...
     *     },
     *       ...
     *   ]
     * }
     * ```
     */
    processData(column: any, data: any, linkedData: any): Array<any> {
        const tableauId = column.id;
        const linkedId = data['links'][column.linksSource][column.linksId];
        const linkedKey = linkedData[column.linkedSource];
        const matchingLink = linkedKey.find(function (data) {
            return data.id === linkedId;
        });

        if (isObject(matchingLink)) {
            return [
                tableauId,
                dataNormalizer(column, matchingLink[column.linkedField]),
            ];
        } else {
            return [tableauId, null];
        }
    }
}

export { LinkedSourceStrategy };
