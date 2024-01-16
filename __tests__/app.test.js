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
  test("GET 404 - should receive status 404 and message 'Bad request' when path is incorrect", () => {
    return request(app)
      .get("/api/test")
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe('Not Found')
      });
  });
});

describe("/api/articles/:article_id", () => {
    test("GET 200 - should receive an article object with the correct article_id", () => {
      return request(app)
        .get("/api/articles/4")
        .expect(200)
        .then((result) => {
          expect(typeof result.body.article.article_id).toBe('number');
          expect(typeof result.body.article.title).toBe('string');
          expect(typeof result.body.article.topic).toBe('string');
          expect(typeof result.body.article.author).toBe('string');
          expect(typeof result.body.article.body).toBe('string');
          expect(typeof result.body.article.created_at).toBe('string');
          expect(typeof result.body.article.votes).toBe('number');
          expect(typeof result.body.article.article_img_url).toBe('string');
        });
    });
    test("GET 404 - should return 'Not Found' when article id doesn't exist yet", () => {
      return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then((result) => {
          expect(result.body.msg).toBe('Not Found');
        });
    });
    test("GET 400 - should return 'Bad Request' due to incorrect formatting", () => {
      return request(app)
        .get("/api/articles/fgt98")
        .expect(400)
        .then((result) => {
          expect(result.body.msg).toBe('Bad Request');
        });
    });
});