const app = require('../app');
const request = require('supertest');

test(`end to end test testing express server & flask server -- this one specifically tests 
    POST endpoint located at /languageModel for 15 names`, async () => {
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
});


test(`end to end test testing express server & flask server -- this one specifically tests 
    POST endpoint located at /languageModel for 1 name`, async () => {
    let results = (await request(app)
        .post('/languageModel')
        .send({
            temperature: 2.5,
            number_to_generate: 1
        })
        .expect(200)
        .expect('Content-Type', /json/)).body;

    expect(results).toHaveProperty('predictedName');
    expect(results.predictedName.length).toEqual(1);
});