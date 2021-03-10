const app = require('../app');
const request = require('supertest');
const fs = require('fs');

test('test POST endpoint located at /convModel', async (done) => {
    const image_data = fs.readFileSync(__dirname + '/test_image.jpg');
    done(); 
})