const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {return seed(testData)});
afterAll(() => {return db.end()});

describe("/api/topics", () => {
    test("GET 200 and an array of topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((result) => {
          expect(Array.isArray(result.body.topics)).toBe(true)
        });
    });
});