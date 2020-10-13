import 'chromedriver';
import chrome from 'selenium-webdriver/chrome';
import { Builder, By, Key, until } from 'selenium-webdriver';

import { delay, screen } from './helpers';

describe('basic functionality', function () {
    let driver: chrome.Driver;
    let API_KEY: string;
    let API_URL: string;

    beforeAll(async function () {
        API_KEY = process.env.API_KEY;
        API_URL = process.env.API_URL;

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(
                new chrome.Options().headless().windowSize(screen),
            )
            .build();
    }, 30000);

    it('test page navigation', async function () {
        await driver.get('http://localhost:8888');
        let urlStyle, apiStyle, editStyle;

        urlStyle = await driver
            .findElement(By.id('url-section'))
            .getAttribute('style');
        apiStyle = await driver
            .findElement(By.id('api-section'))
            .getAttribute('style');
        editStyle = await driver
            .findElement(By.id('edit-section'))
            .getAttribute('style');

        expect(urlStyle).toEqual('');
        expect(apiStyle).toEqual('display: none;');
        expect(editStyle).toEqual('display: none;');

        await driver.findElement(By.id('credentialsButton')).click();

        urlStyle = await driver
            .findElement(By.id('url-section'))
            .getAttribute('style');
        apiStyle = await driver
            .findElement(By.id('api-section'))
            .getAttribute('style');
        editStyle = await driver
            .findElement(By.id('edit-section'))
            .getAttribute('style');

        expect(urlStyle).toEqual('display: none;');
        expect(apiStyle).toEqual('');
        expect(editStyle).toEqual('display: none;');

        await driver.findElement(By.id('addButton')).click();

        urlStyle = await driver
            .findElement(By.id('url-section'))
            .getAttribute('style');
        apiStyle = await driver
            .findElement(By.id('api-section'))
            .getAttribute('style');
        editStyle = await driver
            .findElement(By.id('edit-section'))
            .getAttribute('style');

        expect(urlStyle).toEqual('display: none;');
        expect(apiStyle).toEqual('display: none;');
        expect(editStyle).toEqual('');

        await driver.findElement(By.id('editDoneButton')).click();

        urlStyle = await driver
            .findElement(By.id('url-section'))
            .getAttribute('style');
        apiStyle = await driver
            .findElement(By.id('api-section'))
            .getAttribute('style');
        editStyle = await driver
            .findElement(By.id('edit-section'))
            .getAttribute('style');

        expect(urlStyle).toEqual('display: none;');
        expect(apiStyle).toEqual('');
        expect(editStyle).toEqual('display: none;');

        await driver.findElement(By.id('resetButton')).click();

        urlStyle = await driver
            .findElement(By.id('url-section'))
            .getAttribute('style');
        apiStyle = await driver
            .findElement(By.id('api-section'))
            .getAttribute('style');
        editStyle = await driver
            .findElement(By.id('edit-section'))
            .getAttribute('style');

        expect(urlStyle).toEqual('');
        expect(apiStyle).toEqual('display: none;');
        expect(editStyle).toEqual('display: none;');
    }, 30000);

    afterAll(function () {
        driver.quit();
    }, 10000);
});
