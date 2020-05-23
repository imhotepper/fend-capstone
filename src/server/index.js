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
    //res.sendFile(path.resolve('dist/index.html'))
    res.sendFile(path.resolve('src/client/views/index.html'))
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

    const geonamesUser = process.env.API_GEONAMES_USERNAME;
    const place = req.query.place;
    const date = req.query.date;
    var geoRes = await axios.get(`http://api.geonames.org/postalCodeSearch?placename=${place}&maxRows=10&username=${geonamesUser}`, {
        headers: {
            Accept: "application/json"
        }
    });

    console.log("Geonames returned :", JSON.stringify(geoRes.data));

    //get first record from array
    //TODO: check if present
    var locationGeo = geoRes.data.postalCodes[0];
    console.log(`location: ${locationGeo.placeName} long: ${locationGeo.lng} and lat: ${locationGeo.lat}`)

    res.send(geoRes.data);


    // .then(geoRes => {
    //         console.log("Geonames returned :", JSON.stringify(geoRes.data));
    //         res.send(geoRes.data);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.status(500).send(err);
    //     })

    /*
     axios.get(`http://api.geonames.org/postalCodeSearch?placename=${place}&maxRows=10&username=${geonamesUser}`, {
        headers: {
            Accept: "application/json"
        }
    })
    .then(geoRes => {
        console.log("Geonames returned :", JSON.stringify(geoRes.data));
        res.send(geoRes.data);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send(err);
    }) */

})