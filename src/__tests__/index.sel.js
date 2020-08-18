import 'chromedriver'
import chrome from 'selenium-webdriver/chrome'
import {Builder, By} from 'selenium-webdriver';

const screen = {
    width: 640,
    height: 480
  };


describe('selenium', function () {
    let driver;

    beforeEach(async function() {
        driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless().windowSize(screen)).build();
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

        
    }, 30000);

    afterEach(function() {
        driver.quit()
    });
});