import { Buttons } from './buttons';

// Class used in editDone button to edit tables from the list
class EditList extends Buttons {
    constructor() {
        super();
        $('#apiList').on('click', '#editList', (event: any) => {
            const id: number = event.target.offsetParent.id;

            if (event.target && event.target.offsetParent.id == id) {
                this.editTable(id);
            }
        });
    }
}

export { EditList };
