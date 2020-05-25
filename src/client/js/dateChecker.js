function dateChecker(possibleDate) {
    var datePattern = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
    var res = possibleDate.match(datePattern);
    return (res !== null)
}

export { dateChecker }