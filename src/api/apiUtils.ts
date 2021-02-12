import { normalizeDate, convertArray } from '../lib/utils';

function dataNormalizer(column, data) {
    if (column.dataType === 'datetime') {
        return normalizeDate(data);
    } else if (column.originalType === 'array') {
        return convertArray(data);
    } else if (column.originalType === 'object') {
        return JSON.stringify(data);
    } else {
        return data;
    }
}

export { dataNormalizer };
