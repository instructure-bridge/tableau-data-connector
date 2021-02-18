// @ts-nocheck
import './main.css';
// https://babeljs.io/docs/en/babel-polyfill
// pollyfill required for async iterator support
import 'core-js/features/symbol';
import 'regenerator-runtime/runtime';
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
$(document).ready(() => {
    // Global clear value function
    window.clearValue = (id) => {
        $(`#${id}`).val('');
    };

    // Add tables that are defined in ./tables/api/* to list
    new AddTableOptions();

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

    //button for when the user is done choosing tables
    //This is also reponsible for creating the tableau wdc initialization
    new Submit();
});
