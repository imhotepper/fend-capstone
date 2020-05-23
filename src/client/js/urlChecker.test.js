const { urlChecker } = require('./urlChecker');

test('checks invalid url', () => {
    expect(urlChecker('google.com')).toBe(false);
});

test('checks valid url', () => {
    expect(urlChecker('https://techcrunch.com/2015/07/16/microsoft-will-never-give-up-on-mobile/?guccounter=1')).toBe(true);
});