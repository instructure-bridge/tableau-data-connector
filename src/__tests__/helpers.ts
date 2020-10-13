class FakeTable {
    tableinfo: any;
    wasAppend: boolean;

    constructor(id) {
        this.tableinfo = { id: id };
        this.wasAppend = false;
    }

    get tableInfo() {
        return this.tableinfo;
    }

    get didAppend() {
        return this.wasAppend;
    }

    appendRows(row) {
        this.wasAppend = true;
    }
}

export { FakeTable };
