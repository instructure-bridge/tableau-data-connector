export interface Column {
    alias: string;
    id: string;
    dataType: string;
    [propName: string]: any;
}

export interface ParameterOption {
    name?: string;
    value?: string;
}

export interface Parameter {
    name: string;
    parameter: string;
    type: string;
    placeholder?: string;
    default?: string;
    options?: Array<ParameterOption>;
}

export interface RequiredParameter extends Parameter {
    path?: string;
    valCol: string;
}

export interface TableDefinition {
    id: string;
    alias: string;
    incrementColumnId?: string;
    columns: Array<Column>;
}

export interface Table {
    table: TableDefinition;
    path: string;
    data: string;
    requiredParameters?: Array<RequiredParameter>;
    parameters?: Array<Parameter>;
}

export interface TableName {
    [name: string]: Table;
}
