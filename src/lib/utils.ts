function isJsonString(str: any): boolean {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// Checks objects for arrays and converts the array to a string
function convertObjectValues(obj) {
    Object.entries(obj).forEach((entry) => {
        const [key, value] = entry;
        if (Array.isArray(value)) {
            obj[key] = value.toString();
        } else if (isObject(value)) {
            convertObjectValues(value);
        }
    });
    return obj;
}

// Checks if val is an object or not
function isObject(val) {
    // val == null actually checks for both null and undefined
    if (val == null) {
        return false;
    }
    return typeof val === 'function' || typeof val === 'object';
}

export { convertObjectValues, isJsonString, isObject };
