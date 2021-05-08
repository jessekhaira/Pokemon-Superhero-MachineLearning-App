const app = require("../app");
const request = require("supertest");

test(`testing that static assets are returned appropriately -- test1`, async () => {
  await request(app)
    .get("/conv")
    .expect(200)
    .expect("Content-Type", "text/html; charset=UTF-8");
});

test(`testing that static assets are returned appropriately -- test2`, async () => {
  await request(app)
    .get("/convModel")
    .expect(200)
    .expect("Content-Type", "text/html; charset=UTF-8");
});

test(`testing that static assets are returned appropriately -- test3`, async () => {
  await request(app)
    .get("/languageModel")
    .expect(200)
    .expect("Content-Type", "text/html; charset=UTF-8");
});

test(`testing that static assets are not found`, async () => {
  await request(app).post("/xhyz").expect(404);
});
