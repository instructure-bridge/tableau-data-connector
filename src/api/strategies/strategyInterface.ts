export interface Strategy {
    processData(column: any, data: any, linkedData?: any): Array<any>;
}
