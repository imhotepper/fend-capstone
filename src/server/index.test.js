test('can test server', async() => {});

describe('Sample Test', () => {
    it('should test that true === true', () => {
        expect(true).toBe(true)
    })
})

const supertest = require('supertest')
const app = require('./index')
describe('Express Endpoints', () => {
    it('should return some mockdata', async() => {
        await supertest(app)
            .get('/test')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
    })

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