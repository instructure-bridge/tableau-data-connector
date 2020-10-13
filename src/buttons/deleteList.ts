import { Buttons } from './buttons';

// Class used in editDone button to delete a table from the list
class DeleteList extends Buttons {
    constructor() {
        super();
        $('#apiList').on('click', '#deleteList', (event: any) => {
            const id: number = event.target.offsetParent.id;

            if (event.target && event.target.offsetParent.id == id) {
                this.deleteTable(id);
            }
        });
    }
}

export { DeleteList };
