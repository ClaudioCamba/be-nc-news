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

describe("/api/articles", () => {
  test("GET 200 - should receive an array of articles objects contains specific keys", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((result) => {
        expect(Array.isArray(result.body.articles)).toBe(true);
        expect(result.body.articles).toHaveLength(13);
        result.body.articles.forEach((article)=>{
          expect(article).toHaveProperty('author');
          expect(article).toHaveProperty('title');
          expect(article).toHaveProperty('article_id');
          expect(article).toHaveProperty('topic');
          expect(article).toHaveProperty('created_at');
          expect(article).toHaveProperty('votes');
          expect(article).toHaveProperty('article_img_url');
          expect(article).toHaveProperty('comment_count');
        })
      });
  });
  test("GET 200 - should receive an array of article objects in desc order by created_at without the body key", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((result) => {
        result.body.articles.forEach((article)=>{
          expect(article).not.toHaveProperty('body');
        });

        expect(result.body.articles).toBeSorted({ 
          key: "created_at",
          descending: true
        })
      });
  });
  test("GET 404 - should receive status 404 and message 'Bad request' when path is incorrect", () => {
    return request(app)
      .get("/api/art1cl3s")
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe('Not Found')
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET 200 - should receive an array of comments objects matching article_id requested with most recent first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((result) => {
        expect(Array.isArray(result.body.comments)).toBe(true);
        expect(result.body.comments).toHaveLength(11);
        result.body.comments.forEach((comment)=>{
          expect(comment).toHaveProperty('comment_id');
          expect(comment).toHaveProperty('body');
          expect(comment).toHaveProperty('article_id');
          expect(comment).toHaveProperty('created_at');
          expect(comment).toHaveProperty('votes');
          expect(comment).toHaveProperty('author');
          expect(comment).toHaveProperty('article_id',1);
        })
        expect(result.body.comments).toBeSorted({ 
          key: "created_at",
          descending: true
        })
      });
  });
  test("GET 404 - should return 'Not Found' when article id doesn't exist yet", () => {
    return request(app)
      .get("/api/articles/99978/comments")
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe('Not Found');
      });
  });
  test("GET 400 - should return 'Bad Request' due to incorrect formatted article_id", () => {
    return request(app)
      .get("/api/articles/45tes/comments")
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe('Bad Request');
      });
  });
});