function isJsonString(str: any): boolean {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export { isJsonString };
