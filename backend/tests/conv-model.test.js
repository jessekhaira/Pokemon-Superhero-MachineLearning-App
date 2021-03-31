const app = require('../app');
const request = require('supertest');
const path = require('path');

test(`end to end test testing express server & flask server -- this one specifically tests 
    POST endpoint located at /convModel using test image 1`, 
    async () => {
    let results = (await request(app)
        .post('/convModel')
        .attach('image', path.resolve(__dirname, 'test_image1.jpg'))
        .expect(201)
        .expect('Content-Type', /json/)).body;

    
    expect(results).toHaveProperty('MostLikelyClass');
    expect(results).toHaveProperty('allProbs');

    expect(results.allProbs.Batman).toBeGreaterThan(0.85)
})

test(`end to end test testing express server & flask server -- this one specifically tests 
    POST endpoint located at /convModel using test image 2`, 
    async() => {
        
    let results = (await request(app)
        .post('/convModel')
        .attach('image', path.resolve(__dirname, 'test_image2.png'))
        .expect(201)
        .expect('Content-Type', /json/)).body;


    expect(results).toHaveProperty('MostLikelyClass');
    expect(results).toHaveProperty('allProbs');

    expect(results.allProbs.Superman).toBeGreaterThan(0.85)
});
