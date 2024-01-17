const express = require("express");
const app = express();
const {
    handleEndpointError,
    handleCustomErrors,
    handlePsqlErrors,
    handleServerErrors,
  } = require('./errors.js');

const { 
    getTopics, 
    getEndpoints, 
    getArticles, 
    getArticleById,
    getCommentsById,
    postCommentsById
} = require("./controllers/news.controllers.js")

app.use(express.json());

app.get('/api', getEndpoints)
app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getCommentsById)

app.post('/api/articles/:article_id/comments', postCommentsById)

  app.all('*',handleEndpointError);
  app.use(handleCustomErrors);
  app.use(handlePsqlErrors);
  app.use(handleServerErrors);

module.exports = app
