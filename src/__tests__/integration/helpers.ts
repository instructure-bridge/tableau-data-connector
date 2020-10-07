import 'chromedriver';
import chrome from 'selenium-webdriver/chrome';
import { Builder, By, Key, until } from 'selenium-webdriver';

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
