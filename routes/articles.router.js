// articles-router.js
const articlesRouter = require('express').Router();
const { 
    getArticles, 
    getArticleById,
    getCommentsById,
    postCommentsById,
    patchArticleById,
} = require("../controllers/news.controllers.js")

articlesRouter.get('/', getArticles);

articlesRouter
.route('/:article_id')
.get(getArticleById)
.patch(patchArticleById);

articlesRouter
.route('/:article_id/comments')
.get(getCommentsById)
.post(postCommentsById);


module.exports = articlesRouter;