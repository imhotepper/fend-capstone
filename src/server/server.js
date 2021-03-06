var path = require('path')
const express = require('express')


const app = express()

app.use(express.static('dist'))

const cors = require('cors')
app.use(cors());

const bodyParser = require('body-parser')
    // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//console.log(__dirname)

const dotenv = require('dotenv');
dotenv.config();


//axios
const axios = require('axios');


app.get('/', function(req, res) {
    res.sendFile(path.resolve('dist/index.html'))
        //res.sendFile(path.resolve('src/client/views/index.html'))
})

// designates what port the app will listen to for incoming requests
app.listen(8080, function() {
    console.log('Server listening on port 8080!')
})

app.get('/forcast', async(req, res) => {
    console.log(`looking for: ${req.query.place} with date: ${req.query.date}`);

    const place = encodeURIComponent(req.query.place);
    const date = req.query.date;

    try {
        if (!place || !date) throw Error('Date or place invalid');
        var dataToSave = await GetComputedData(place, date);
        res.send(dataToSave);
    } catch (error) {
        console.error(error)
        res.status(500).send();

    }

})

async function GetComputedData(place, date) {
    const headers = {
        headers: {
            Accept: "application/json"
        }
    }
    const geonamesUser = process.env.API_GEONAMES_USERNAME
    let geoURL = `http://api.geonames.org/searchJSON?q=${place}&maxRows=1&username=${geonamesUser}`
    var geoRes = await axios.get(geoURL, headers)
        //get first record from array
        //TODO: check if present
    var locationGeo = geoRes.data.geonames[0]

    let weather = {}
    if (getWeatherData(date) == true) {
        //TODO: get weather in date
        const weatherBitKey = process.env.API_WEATHERBIT_KEY
        const wthrUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${locationGeo.lat}&lon=${locationGeo.lng}&key=${weatherBitKey}`
        var wthrRes = await axios.get(wthrUrl, headers)
        const weatherData = wthrRes.data.data[0]
        const onDate = wthrRes.data.data.find(x => x.datetime == date)
        if (onDate) {
            weather.temperature = onDate.temp
            weather.min_temp = onDate.min_temp
            weather.max_temp = onDate.max_temp
            weather.icon = onDate.weather.icon
            weather.description = onDate.weather.description
        }
    }
    //image url
    const pixaBayKey = process.env.API_PIXELBAY_KEY
    const imgUrl = `https://pixabay.com/api/?key=${pixaBayKey}&q=${place}&image_type=photo&pretty=true`
    var imgUrlRes = await axios.get(imgUrl, headers)
    let imageUrl = ""
    if (imgUrlRes.data != null && imgUrlRes.data.hits != null && imgUrlRes.data.hits.length > 0)
        imageUrl = imgUrlRes.data.hits[0]
    var dataToSave = {
        date: date,
        location: locationGeo,
        weather: weather,
        image: imageUrl
    }
    return dataToSave
}

function getWeatherData(date) {
    let dt = new Date(date)
    const diffTime = Math.abs(dt - new Date())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays < 16;
}


module.exports = app;