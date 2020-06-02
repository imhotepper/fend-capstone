const supertest = require('supertest')
const app = require('./server')
describe('Express Endpoint', () => {
    it('should return data for bucharest', async() => {
        let dt = new Date().toISOString().split('T')[0];
        await supertest(app)
            .get('/forcast')
            .query({
                place: "Bucharest",
                date: dt
            })
            //.set('Accept', 'application/json')
            // .expect('Content-Type', /json/)
            .expect(200)
            //.then(response => console.log(response))
    })
})