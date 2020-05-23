
# Analyse THIS!

This project will take an artilce url and it will display a 3 sentence summary of it using the [Aylien](https://developer.aylien.com) api.

# Project details

The api was developed using the details presented in the module 5. Build Tools and Single Page Web Apps of the Front End Nano Degree program. 

The front end also uses generated Service Worker so that it can be started without internet connectivity. Of course, there will be no summary displayed since no network is available, only the general layout of the page.

# API details

The api called by the front end is a simple one that is available at the following endpoint:

```js
http://localhost:8080/analyse
```

The returned response has the following structure:

```json
{
  "data":["Sentence 1", "Sentence 2", "Sentence3"]
}
```

At the server side level the number of sentences returned can be configured because this is a parameter of the aylien api.

## Run locally 

The project can be started locally. In order to run it the following steps must be executed:

- create the .env file in the root of the project with the expected content
```js
API_ID=your_api_id
API_KEY=your_api_key
```
- use `npm install` or `yarn` in order to install dependencies
- start the webpack-dev server and the express server concurrently using `npm run dev` or `yarn dev`
- to execute the tests use `npm run test` or `yarn test` 

## Deploying
 Work In Progress

