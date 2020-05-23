function urlChecker(possibleUrl) {
    var urlPattern = /^(https?|ftp|torrent|image|irc):\/\/(-\.)?([^\s\/?\.#-]+\.?)+(\/[^\s]*)?$/i;
    var res = possibleUrl.match(urlPattern);
    return (res !== null)
}

export { urlChecker }