import { Buttons } from './buttons';
import { tables } from '../tables/api/author';

class AddTableOptions extends Buttons {
    constructor() {
        super();
        this.addTableOptions(tables);
    }
}

export { AddTableOptions };
