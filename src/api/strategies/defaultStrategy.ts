import { Strategy } from './strategyInterface';
import { dataNormalizer } from '../apiUtils';

class DefaultStrategy implements Strategy {
    processData(column: any, data: any): Array<any> {
        const id = column.id;
        return [id, dataNormalizer(column, data[id])];
    }
}

export { DefaultStrategy };
