const app = require('../app');
const request = require('supertest');

test(`testing that static assets are returned appropriately -- test1`, async () => {
    let results = (await request(app)
        .get('/conv')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=UTF-8'));
});

test(`testing that static assets are returned appropriately -- test2`, async () => {
    let results = (await request(app)
        .get('/convModel')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=UTF-8'));
});

test(`testing that static assets are returned appropriately -- test3`, async () => {
    let results = (await request(app)
        .get('/languageModel')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=UTF-8'))
});


test(`testing that static assets are not found`, async () => {
    let results = (await request(app)
        .post('/xhyz')
        .expect(404));
});
