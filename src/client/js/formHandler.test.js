import { getData } from './formHandler'
const fetchMock = require('fetch-mock');

const responseBody = { "data": ["The Current World View\n\nAfter some time in the soup, Microsoft has finally detailed its Windows mobile strategy well enough in the last week that we can understand it — whether that’s referring to the operating system level, hardware or cross-platform apps.", "That’s quite plain: Microsoft wanted to go after phone market share in the long term, and selling Windows at its old price points would limit broader Windows 10 adoption, eroding at the company’s larger value proposition of having one platform across all your devices.", "As people shift to mobile devices controlled by Android and iOS, Microsoft will have a hard time, gaining market share for Windows on the phone or tablet — Surface sales not withstanding."] };

fetchMock.once('http://localhost:8080/analyse', {
    // status: 200,
    body: JSON.stringify(responseBody),
    // statusText: 'OK',
    // headers: { 'Content-Type': 'application/json' },
    //sendAsJson: true
}, { method: 'POST' });



test('can mock fetch', async() => {

    const response = await getData("url");
    expect(response.data.length).toBe(3);

    //fetchMock.mock('http://example.com', 200);
    //const res = await fetch('http://example.com');
    //assert(res.ok);
    // fetchMock.restore();

});