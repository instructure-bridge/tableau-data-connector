import { CustomDate } from './customDate';

function isJsonString(str: any): boolean {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// Tableau doesn't seem to like the ISO 8601 date format that our API returns
// This function modifies the date to something Tableau can use
function normalizeDate(dateString: string, locale?: string) {
    try {
        if (dateString) {
            const localeString =
                locale || tableau?.locale || navigator?.language;
            return CustomDate.toCustomFormat(dateString, localeString);
        } else {
            return dateString;
        }
    } catch (e) {
        logger(e);
    }
}

function convertArray(value: any) {
    try {
        if (value && Array.isArray(value)) {
            return value.toString();
        } else {
            return value;
        }
    } catch (e) {
        logger(e);
    }
}

// Checks if val is an object or not
function isObject(val: any) {
    // val == null actually checks for both null and undefined
    if (val == null) {
        return false;
    }
    return typeof val === 'function' || typeof val === 'object';
}

// Log to both console, and tableau.log for troubleshooting
// the simulator, as well as the desktop client.
function logger(msg: any) {
    tableau.log(msg);
    console.log(msg);
}
export { convertArray, isJsonString, isObject, logger, normalizeDate };
