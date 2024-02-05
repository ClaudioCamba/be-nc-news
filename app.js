const cors = require('cors');
const express = require("express");

const app = express();
const {
    handleEndpointError,
    handleCustomErrors,
    handlePsqlErrors,
    handleServerErrors,
  } = require('./errors.js');

const { 
    getUsers,
    getTopics, 
    getEndpoints, 
    getArticles, 
    getArticleById,
    getCommentsById,
    postCommentsById,
    patchArticleById,
    deleteCommentsById
} = require("./controllers/news.controllers.js")

app.use(cors());
app.use(express.json());

app.get('/api', getEndpoints)

app.get('/api/topics', getTopics)
app.get('/api/users', getUsers)
app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getCommentsById)

app.post('/api/articles/:article_id/comments', postCommentsById)

app.patch('/api/articles/:article_id', patchArticleById)

app.delete('/api/comments/:comment_id', deleteCommentsById)

app.all('*',handleEndpointError);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app
