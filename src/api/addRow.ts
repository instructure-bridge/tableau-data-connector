import { ResponseProcess } from './responseProcess';
import {
    CustomFieldStrategy,
    DefaultStrategy,
    LinkedSourceStrategy,
    ParentIdStrategy,
} from './strategies';

class AddRow {
    table: any;
    myTables: any;
    result: any;
    tableData: Array<any> = [];

    constructor(table: any, myTables: any, result: any) {
        this.table = table;
        this.myTables = myTables;
        this.result = result;
    }

    processData(): void {
        const tableInfo = this.myTables[this.table.tableInfo.id];
        const data = this.result[tableInfo.data];

        const customFieldStrategy = new CustomFieldStrategy();
        const defaultStrategy = new DefaultStrategy();
        const linkedSourceStrategy = new LinkedSourceStrategy();
        const parentIdStrategy = new ParentIdStrategy();
        const processData = new ResponseProcess(defaultStrategy);

        data.forEach((item) => {
            const row = {};
            let id: any;
            let value: any;
            let linkedData: any;
            tableInfo.table.columns.forEach((column) => {
                if ('linkedSource' in column) {
                    if (column.linksSource === 'custom_field_values') {
                        processData.setStrategy(customFieldStrategy);
                    } else {
                        processData.setStrategy(linkedSourceStrategy);
                    }
                    linkedData = this.result['linked'];
                    [id, value] = processData.run(column, item, linkedData);
                    row[id] = value;
                } else if ('parent_id' in column) {
                    processData.setStrategy(parentIdStrategy);
                    [id, value] = processData.run(column, item);
                    row[id] = value;
                } else {
                    processData.setStrategy(defaultStrategy);
                    [id, value] = processData.run(column, item);
                    row[id] = value;
                }
            });
            this.tableData.push(row);
        });
        this.table.appendRows(this.tableData);
    }
}

export { AddRow };
