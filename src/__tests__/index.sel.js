import 'chromedriver'
import {Builder, By} from 'selenium-webdriver';


describe('selenium', function () {
    let driver;

    beforeEach(async function() {
        driver = await new Builder().forBrowser('chrome').build();
    });

    it('test', async function() {
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

        
    });

    afterEach(function() {
        driver.quit()
    });
});