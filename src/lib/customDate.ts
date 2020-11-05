class CustomDate extends Date {
    constructor() {
        super();
    }

    // Tableau does not seem to like the ISO 8601 format returned from bridge
    // this method should convert the date into a format accepted by tableau
    // see https://tableau.github.io/webdataconnector/docs/wdc_ref_date_formats.html
    static toCustomFormat(
        date: string,
        locale: string = 'en-us',
        optionsOverride?: any,
    ) {
        const parsedDate = this.parse(date);
        const options: any = optionsOverride || {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        // MDN documentation suggests using Intl.DateTimeFormat vs Date.toLocaleString
        // Tableau wants the date to be in a VERY specific format..(no commas allowed).
        return new Intl.DateTimeFormat(locale, options)
            .format(parsedDate)
            .replace(',', '');
    }
}

export { CustomDate };
