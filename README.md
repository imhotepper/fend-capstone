
# Travellin

Capstone project for the Udacity Front End Nano Degree. Add a place and a date and you'll get an entry with the weather, if in the next 15 days, a photo of the place an the location and date of the trip.

## Project details

Travellin is a project that will recotd a trip starting date with the weather and an image for the location you intend to go.

The underlying api used are the following:
- [Geonames API](https://www.geonames.org/)
- [Weatherbit API](https://www.weatherbit.io/)
- [Pixabay API](https://pixabay.com/)


## API details

The website is powerd by ExpressJS and it exposes 2 endpoints. One will return the html resulted after webpack executed the plugins and the modules. The other will return the data from the aggregation of the 3 apis.

```js
/forcast?place=[the place to visit]&date=[yyyy-MM-dd]
```


## Run locally 

The project can be started locally. In order to run it the following steps must be executed:

- create the .env file in the root of the project with the expected content
```js
API_GEONAMES_USERNAME=
API_WEATHERBIT_KEY=
API_PIXELBAY_KEY=
```
- use `npm install` or `yarn` in order to install dependencies
- start the webpack-dev server and the express server concurrently using `npm run dev` or `yarn dev`
- start only de Express server use `npm run server` or `yarn server`
- to execute the tests use `npm run test` or `yarn test` 
- to build dist folder use `npm run build-prod` or `yarn build-prod`


## Deploying
 Work In Progress

