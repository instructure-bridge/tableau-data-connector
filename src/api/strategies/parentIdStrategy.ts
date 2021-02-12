import { Strategy } from './strategyInterface';
import { dataNormalizer } from '../apiUtils';

class ParentIdStrategy implements Strategy {
    processData(column: any, data: any): Array<any> {
        const id = column.id;
        const parentId = column.parent_id;
        const subId = column.sub_id;

        // Checks to ensure the parentId exists in the response
        // Example: see courseTemplates table definition(response may or maynot actually have an author defined)
        if (parentId in data) {
            return [id, dataNormalizer(column, data[parentId][subId])];
        } else {
            return [id, null];
        }
    }
}

export { ParentIdStrategy };
