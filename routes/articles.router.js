// articles-router.js
const articlesRouter = require('express').Router();
const { 
    getArticles, 
    getArticleById,
    getCommentsById,
    postArticle,
    postCommentsById,
    patchArticleById,
    deleteArticleById,
} = require("../controllers/news.controllers.js")

articlesRouter
.route('/')
.get(getArticles)
.post(postArticle);

articlesRouter
.route('/:article_id')
.get(getArticleById)
.patch(patchArticleById)
.delete(deleteArticleById);

articlesRouter
.route('/:article_id/comments')
.get(getCommentsById)
.post(postCommentsById);


module.exports = articlesRouter;