// @ts-nocheck
import 'chromedriver'
import chrome from 'selenium-webdriver/chrome'
import { Builder, By, Key, until } from 'selenium-webdriver';

const screen = {
    width: 640,
    height: 480
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


describe('selenium', function () {
    let driver;
    let API_KEY;
    let API_URL;

    beforeAll(async function () {
        API_KEY = process.env.API_KEY;
        API_URL = process.env.API_URL;

        driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless().windowSize(screen)).build();
    }, 30000);

    it('test page navigation', async function () {
        await driver.get('http://localhost:8888');
        let urlStyle, apiStyle, editStyle

        urlStyle = await driver.findElement(By.id('url-section')).getAttribute("style");
        apiStyle = await driver.findElement(By.id('api-section')).getAttribute("style");
        editStyle = await driver.findElement(By.id('edit-section')).getAttribute("style");

        expect(urlStyle).toEqual('');
        expect(apiStyle).toEqual('display: none;');
        expect(editStyle).toEqual('display: none;');

        await driver.findElement(By.id('credentialsButton')).click();

        urlStyle = await driver.findElement(By.id('url-section')).getAttribute("style");
        apiStyle = await driver.findElement(By.id('api-section')).getAttribute("style");
        editStyle = await driver.findElement(By.id('edit-section')).getAttribute("style");

        expect(urlStyle).toEqual('display: none;');
        expect(apiStyle).toEqual('');
        expect(editStyle).toEqual('display: none;');

        await driver.findElement(By.id('addButton')).click();

        urlStyle = await driver.findElement(By.id('url-section')).getAttribute("style");
        apiStyle = await driver.findElement(By.id('api-section')).getAttribute("style");
        editStyle = await driver.findElement(By.id('edit-section')).getAttribute("style");

        expect(urlStyle).toEqual('display: none;');
        expect(apiStyle).toEqual('display: none;');
        expect(editStyle).toEqual('');

        await driver.findElement(By.id('editDoneButton')).click();

        urlStyle = await driver.findElement(By.id('url-section')).getAttribute("style");
        apiStyle = await driver.findElement(By.id('api-section')).getAttribute("style");
        editStyle = await driver.findElement(By.id('edit-section')).getAttribute("style");

        expect(urlStyle).toEqual('display: none;');
        expect(apiStyle).toEqual('');
        expect(editStyle).toEqual('display: none;');

        await driver.findElement(By.id('resetButton')).click();

        urlStyle = await driver.findElement(By.id('url-section')).getAttribute("style");
        apiStyle = await driver.findElement(By.id('api-section')).getAttribute("style");
        editStyle = await driver.findElement(By.id('edit-section')).getAttribute("style");

        expect(urlStyle).toEqual('');
        expect(apiStyle).toEqual('display: none;');
        expect(editStyle).toEqual('display: none;');
    }, 30000);

    it('test adding, editing, and deleting table', async function () {
        let tableToUse = 'authorUser';
        let newTableName = 'New Table Name Test 1234';

        await driver.get('http://localhost:8888');

        await driver.findElement(By.id('credentialsButton')).click();
        await driver.findElement(By.id('apiSelector')).click();
        await driver.findElement(By.xpath(`//option[@value="${tableToUse}"]`));
        await driver.findElement(By.id('addButton')).click();
        await driver.findElement(By.id('editDoneButton')).click();
        let tableName1 = await driver.findElement(By.id('0')).findElement(By.className('title')).getAttribute("innerText");

        expect(tableName1).toEqual('List Users');

        await driver.findElement(By.id('0')).findElement(By.className('editButton')).click();
        let nameInput = await driver.findElement(By.id('tableName'));
        await nameInput.clear();
        await nameInput.sendKeys(newTableName);
        await driver.findElement(By.id('editDoneButton')).click();
        let tableName2 = await driver.findElement(By.id('0')).findElement(By.className('title')).getAttribute("innerText");

        expect(tableName2).toEqual(newTableName);

        await driver.findElement(By.id('0')).findElement(By.className('deleteButton')).click();

        await expect(async() => {
            await driver.findElement(By.id('0'));
        }).rejects.toThrow('no such element');

    }, 30000);

    it('test adding, editing, and deleting multiple tables', async function () {
        await driver.get('http://localhost:8888');
        let tableToUse = 'authorUser';
        let numTables = 20;

        await driver.findElement(By.id('credentialsButton')).click();
        await driver.findElement(By.id('apiSelector')).click();
        await driver.findElement(By.xpath(`//option[@value="${tableToUse}"]`)).click();

        for (let id = 0; id < numTables; id++) {
            await driver.findElement(By.id('addButton')).click();
            await driver.findElement(By.id('editDoneButton')).click();
        }

        for (let id = 0; id < numTables; id++) {
            let tableName = await driver.findElement(By.id(id.toString())).findElement(By.className('title')).getAttribute("innerText");
            expect(tableName).toEqual('List Users');
        }

        for (let id = 0; id < numTables; id++) {
            await driver.findElement(By.id(id.toString())).findElement(By.className('editButton')).click();
            let nameInput = await driver.findElement(By.id('tableName'));
            await nameInput.clear();
            await nameInput.sendKeys('Table' + id);
            await driver.findElement(By.id('editDoneButton')).click();
        }
        for (let id = 0; id < numTables; id++) {
            let tableName = await driver.findElement(By.id(id.toString())).findElement(By.className('title')).getAttribute("innerText");
            expect(tableName).toEqual('Table' + id);
        }
        for (let id = numTables - 1; id >= 0; id--) {
            await driver.findElement(By.id('0')).findElement(By.className('deleteButton')).click();
            await expect(async() => {
                await driver.findElement(By.id(id.toString()));
            }).rejects.toThrow('no such element');
        }

    }, 30000);

    // works locally but unsure why it does not run on github actions
    // it('test adding a table with a required parameter', async function () {
    //     await driver.get('http://localhost:8888');
    //     let tableToUse = 'authorListEnrollments';

    //     let urlInput = await driver.findElement(By.id('url'));
    //     await urlInput.clear();
    //     await urlInput.sendKeys(API_URL);
    //     let keyInput = await driver.findElement(By.id('apiKey'));
    //     await keyInput.clear();
    //     await keyInput.sendKeys(API_KEY);

    //     await driver.findElement(By.id('credentialsButton')).click();
    //     await driver.findElement(By.id('apiSelector')).click();
    //     await driver.findElement(By.xpath(`//option[@value="${tableToUse}"]`)).click();
    //     await driver.findElement(By.id('addButton')).click();
    //     await driver.wait(until.elementIsVisible(driver.findElement(By.id('edit-section'))), 60000);
    //     let requiredParameter = await driver.findElement(By.id('requiredParameterSelector')).getAttribute('value');
    //     await driver.findElement(By.id('editDoneButton')).click();
    //     let setRequiredParameter = await driver.findElement(By.id('0')).getAttribute('data-require');
    //     expect(setRequiredParameter).toEqual(requiredParameter);
    // },  120000);

    afterAll(function () {
        driver.quit()
    }, 10000);
});
