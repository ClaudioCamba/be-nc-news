const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const endPoints = require('../endpoints.json');

beforeEach(() => {return seed(testData)});
afterAll(() => {return db.end()});

describe("GET /api", () => {
  test("GET 200 - should return An object describing all the available endpoints on your API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((result) => {
       expect(result.body.endpoints).toEqual(endPoints);
      });
  });
});

describe("GET /api/topics", () => {
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

describe("GET /api/articles/:article_id", () => {
    test("GET 200 - should receive an article object with the correct article_id", () => {
      return request(app)
        .get("/api/articles/4")
        .expect(200)
        .then((result) => {
          expect(result.body.article.article_id).toBe(4);
          expect(result.body.article.title).toBe('Student SUES Mitch!');
          expect(result.body.article.topic).toBe('mitch');
          expect(result.body.article.author).toBe('rogersop');
          expect(result.body.article.body).toBe('We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages');
          expect(result.body.article.created_at).toBe('2020-05-06T01:14:00.000Z');
          expect(result.body.article.votes).toBe(0);
          expect(result.body.article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');
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

describe("GET /api/articles", () => {
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
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET 200 - should return an array of comments objects matching article_id requested with most recent first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((result) => {
        expect(Array.isArray(result.body.comments)).toBe(true);
        expect(result.body.comments).toHaveLength(11);
        result.body.comments.forEach((comment)=>{
          expect(comment).toHaveProperty('comment_id');
          expect(comment).toHaveProperty('body');
          expect(comment).toHaveProperty('article_id',1);
          expect(comment).toHaveProperty('created_at');
          expect(comment).toHaveProperty('votes');
          expect(comment).toHaveProperty('author');
        })
        expect(result.body.comments).toBeSorted({ 
          key: "created_at",
          descending: true
        })
      });
  });
  test("GET 200 - should return an empty array when article exists but has no comments", () => {
    return request(app)
      .get("/api/articles/10/comments")
      .expect(200)
      .then((result) => {
        expect(result.body.comments).toEqual([]);
      });
  });
  test("GET 404 - should return 'Not Found' when article id doesn't exist yet", () => {
    return request(app)
      .get("/api/articles/100/comments")
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

describe("POST /api/articles/:article_id/comments", () => {
  test("POST 201 - should return comment object once it has been added", () => {
    const comment = {
      username: 'zonamorte',
      body: "This is a comment",
      test: "test additional properties"
    }

    return request(app)
      .post("/api/articles/2/comments")
      .send(comment)
      .expect(201)
      .then((result) => {
        expect(result.body.comment).toHaveProperty('comment_id',19);
        expect(result.body.comment).toHaveProperty('body','This is a comment');
        expect(result.body.comment).toHaveProperty('article_id',2);
        expect(result.body.comment).toHaveProperty('author','zonamorte');
        expect(result.body.comment).toHaveProperty('votes',0);
        expect(result.body.comment).toHaveProperty('created_at');
      });
  });
  test("POST 400 - should return with 'Bad Request' due to missing 'body' key", () => {
    const comment = {
      username: 'zonamorte',
    }

    return request(app)
      .post("/api/articles/2/comments")
      .send(comment)
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe('Bad Request');
      });
  });
  test("POST 404 - should return with 'Not Found' due to article not existing", () => {
    const comment = {
      username: 'zonamorte',
      body: "This is a comment"
    }

    return request(app)
      .post("/api/articles/100/comments")
      .send(comment)
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe('Not Found');
      });
  });
  test("POST 400 - should return with 'Bad Request' due to incorrect article_id formatting", () => {
    const comment = {
      username: 'zonamorte',
      body: "This is a comment"
    }

    return request(app)
      .post("/api/articles/10test0/comments")
      .send(comment)
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe('Bad Request');
      });
  });
  test("POST 404 - should return with 'Not Found' due to non existing user in the database", () => {
    const comment = {
      username: 'test',
      body: "This is a comment"
    }

    return request(app)
      .post("/api/articles/2/comments")
      .send(comment)
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe('Not Found');
      });
  });
});