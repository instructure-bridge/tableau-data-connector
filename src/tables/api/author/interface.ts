//enum string names, makes it much easier than using the tableau enum
//dataTypeEnum: { bool: "bool", date: "date", datetime: "datetime", float: "float", int: "int", string: "string", geometry: "geometry" }

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

export interface RequiredParameter {
    title: string;
    path: string;
    data: string;
    nameCol: string;
    valCol: string;
}

export interface Parameter {
    name: string;
    parameter: string;
    type: string;
    placeholder?: string;
    default?: string;
    options?: Array<ParameterOption>;
}

export interface TableDefinition {
    id: string;
    alias: string;
    columns: Array<Column>;
}

export interface Table {
    table: TableDefinition;
    path: string;
    data: string;
    requiredParameter?: RequiredParameter;
    parameters?: Array<Parameter>;
}

export interface TableName {
    [name: string]: Table;
}
