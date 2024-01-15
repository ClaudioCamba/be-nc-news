const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const endPoints = require('../endpoints.json');

beforeEach(() => {return seed(testData)});
afterAll(() => {return db.end()});

describe("/api", () => {
  test("GET 200 - should return An object describing all the available endpoints on your API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((result) => {
       expect(result.body.endpoints).toEqual(endPoints);
      });
  });
});

describe("/api/topics", () => {
  test("GET 200 - should receive an array of topic objects contains slug and description keys with strings as values", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((result) => {
        expect(Array.isArray(result.body.topics)).toBe(true);
        expect(result.body.topics.length).toBe(3);
        result.body.topics.forEach((topic)=>{
          expect(typeof topic.slug).toBe('string');
          expect(typeof topic.description).toBe('string');
        })
      });
  });
  test("Error 400 - should receive status 400 and message 'Bad request' when path is incorrect", () => {
    return request(app)
      .get("/api/test")
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe('Not Found')
      });
  });
});

describe("/api/topics", () => {
    test("GET 200 - should receive an array of topic objects contains slug and description keys with strings as values", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((result) => {
          expect(Array.isArray(result.body.topics)).toBe(true);
          expect(result.body.topics.length).toBe(3);
          result.body.topics.forEach((topic)=>{
            expect(typeof topic.slug).toBe('string');
            expect(typeof topic.description).toBe('string');
          })
        });
    });
    test("Error 400 - should receive status 400 and message 'Bad request' when path is incorrect", () => {
      return request(app)
        .get("/api/test")
        .expect(404)
        .then((result) => {
          expect(result.body.msg).toBe('Not Found')
        });
    });
});