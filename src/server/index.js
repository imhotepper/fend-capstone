var path = require('path')
const express = require('express')
const mockAPIResponse = require('./mockAPI.js')

const app = express()

app.use(express.static('dist'))

const cors = require('cors')
app.use(cors());

const bodyParser = require('body-parser')
    // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

console.log(__dirname)

const dotenv = require('dotenv');
dotenv.config();


//axios
const axios = require('axios');





var AYLIENTextAPI = require('aylien_textapi');
var textapi = new AYLIENTextAPI({
    application_id: process.env.API_ID,
    application_key: process.env.API_KEY
});


app.get('/', function(req, res) {
    res.sendFile(path.resolve('dist/index.html'))
        //res.sendFile(path.resolve('src/client/views/index.html'))
})

// designates what port the app will listen to for incoming requests
app.listen(8080, function() {
    console.log('Example app listening on port 8080!')
})

app.post('/analyse', async(req, res) => {
    //validate url is url
    const testUrl = req.body.url;
    console.log(`analysing this: ${testUrl}`);
    textapi.summarize({
        url: testUrl,
        sentences_number: 3
    }, function(error, resp) {
        if (error) {
            console.log('error aylien: ' + error);
            return res.status(500).json({
                err: error
            });
        }

        res.status(200).json({
            data: resp.sentences
        });
    });

})

app.get('/test', function(req, res) {
    res.send(mockAPIResponse)
})


app.get('/forcast', async(req, res) => {
    console.log(`looking for: ${req.query.place} with date: ${req.query.date}`);

    //TODO: get the coordinates from geonames

    const place = encodeURIComponent(req.query.place);
    const date = req.query.date;

    const headers = {
        headers: {
            Accept: "application/json"
        }
    };

    //TODO: validate the keys are present in the .env file!!!

    const geonamesUser = process.env.API_GEONAMES_USERNAME;
    let geoURL = `http://api.geonames.org/searchJSON?q=${place}&maxRows=1&username=${geonamesUser}`;
    //old geoURL = `http://api.geonames.org/postalCodeSearch?placename=${place}&maxRows=10&username=${geonamesUser}`;
    var geoRes = await axios.get(geoURL,
        headers
    );

    console.dir(geoRes.data.geonames[0]);

    //get first record from array
    //TODO: check if present
    var locationGeo = geoRes.data.geonames[0];
    // console.log(`location: ${locationGeo.placeName} long: ${locationGeo.lng} and lat: ${locationGeo.lat}`)

    //TODO: get weather in date
    const weatherBitKey = process.env.API_WEATHERBIT_KEY;
    const wthrUrl = `https://api.weatherbit.io/v2.0/current?lat=${locationGeo.lat}&lon=${locationGeo.lng}&key=${weatherBitKey}`

    var wthrRes = await axios.get(wthrUrl, headers);
    //console.dir(wthrRes.data);


    //image url
    const pixaBayKey = process.env.API_PIXELBAY_KEY;


    const imgUrl = `https://pixabay.com/api/?key=${pixaBayKey}&q=${place}&image_type=photo&pretty=true`;
    var imgUrlRes = await axios.get(imgUrl, headers);

    // console.dir(imgUrlRes.data);


    //TODO save to some local DB

    const weatherData = wthrRes.data.data[0];
    let weather = {}
    if (weatherData) {
        weather.temperature = weatherData.temp;
        weather.app_temperature = weatherData.app_temp;
        weather.ob_time = weatherData.ob_time;
        weather.icon = weatherData.weather.icon;
        weather.description = weatherData.weather.description;
    }

    console.dir(weatherData)
        //console.dir(imgUrlRes.data);

    let imageUrl = imgUrlRes.data.hits[0];

    var dataToSave = {
        date: date,
        location: locationGeo, // locationGeo,
        weather: weather,
        image: imageUrl
    }
    res.send(dataToSave);
    // res.send({
    //     location: geoRes.data,
    //     weather: wthrRes.data,
    //     pics: imgUrlRes.data
    // });

})