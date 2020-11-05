// TODO: There are more functions that can be extracted from ../buttons/buttons.ts
// in order to reduce duplication.

// Function which adds item to the list or edits.
function updateApiList(id, api, title, ulLength): void {
    // check if id exists to see if this is an edit or an add
    if (id < ulLength) {
        // editing table entry
        $('#' + id + ' .title').text(title);
    } else {
        // adding table entry
        // remove empty list message when adding first entry
        if (ulLength <= 0) {
            showElement('emptyApiListMessage', false);
        }

        const html: string = buildListHtml(id, api, title);
        $('#apiList').append(html);
    }
}

// Function which adds edit/deleteList buttons to the apiList
function buildListHtml(id, api, title): string {
    return [
        `<li data-api="${api}" class="list-group-item" id="${id}">`,
        `<div class="row">`,
        `<div class="col titleColumn">`,
        `<div class="title">${title}</div>`,
        `</div>`,
        `<div class="col-xs-auto">`,
        `<span>`,
        `<button class="btn btn-light mx-1" id="editList" type="button">Edit</button>`,
        `<button class="btn btn-light mx-1" id="deleteList" type="button">Delete</button>`,
        `</span>`,
        `</div>`,
        `</div>`,
        `</li>`,
    ].join('\n');
}

// function for showing and hiding elements
function showElement(id, isShow) {
    if (isShow) {
        $(`#${id}`).css('display', '');
    } else {
        $(`#${id}`).css('display', 'none');
    }
}

// function for switching between pages
function switchPage(start, end) {
    showElement(start, false);
    showElement(end, true);
}

function disableElement(id, isDisabled) {
    if (isDisabled) {
        $(`#${id}`).prop('disabled', true);
        $(`#${id}`).prop('required', false);
    } else {
        $(`#${id}`).prop('disabled', false);
        $(`#${id}`).prop('required', true);
    }
}

//function for showing the loading icon for the required parameter fethcing
function showLoading(isLoading) {
    if (isLoading) {
        $('#addButton').prop('disabled', true);
        $('#addButton').html(
            '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Loading...</span>',
        );
    } else {
        $('#addButton').prop('disabled', false);
        $('#addButton').html('Add');
    }
}

export {
    buildListHtml,
    disableElement,
    showElement,
    showLoading,
    switchPage,
    updateApiList,
};
