// @ts-nocheck
import {
    Add,
    AddTableOptions,
    Credentials,
    DeleteList,
    EditList,
    EditDone,
    ResetCredentials,
    Submit,
} from './buttons';

//runs these functions on page load
$(document).ready(function () {
    // Global clear value function
    window.clearValue = function (id) {
        $(`#${id}`).val('');
    };

    // Add tables that are defined in ./tables/api/* to list
    new AddTableOptions();

    //button for when the user is done choosing tables
    new Submit();

    // button when starting to add a table
    new Add();

    // Adds edit button to each added table
    new EditList();

    // Adds edit button to each added table
    new DeleteList();

    // button when done editing a table
    new EditDone();

    // button to go back to page for entering the url and api key
    // Change URL and Credentials
    new ResetCredentials();

    // button to go from credentials section to api section
    // Set Credentials and URL
    new Credentials();
});
