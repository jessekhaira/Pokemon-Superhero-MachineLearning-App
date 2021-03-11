const app = require('../app');
const request = require('supertest');

describe('group of tests testing /languageModel POST endpoint', () => {
    test('test POST endpoint located at /convModel using test image 1', async (done) => {
        let results = (await request(app)
            .post('/languageModel')
            .send({
                temperature: 2.5,
                number_to_generate: 15
            })
            .expect(200)
            .expect('Content-Type', /json/)).body;

        expect(results).toHaveProperty('predictedName');
        expect(results.predictedName.length).toEqual(15);
        done();
    });
}); 