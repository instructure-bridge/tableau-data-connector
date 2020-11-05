import { By } from 'selenium-webdriver';

interface Screen {
    width: number;
    height: number;
}

export const screen: Screen = {
    width: 640,
    height: 480,
};

export function delay(ms): Promise<number> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function setCredentials(driver, url, key) {
    const localUrl = url || 'https://foo.example.com';
    const localKey = key || 'Basic abc123';

    const urlInput = await driver.findElement(By.id('url'));
    await urlInput.clear();
    await urlInput.sendKeys(localUrl);
    const keyInput = await driver.findElement(By.id('apiKey'));
    await keyInput.clear();
    await keyInput.sendKeys(localKey);
}
