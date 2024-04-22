// comments-router.js
const commentsRouter = require('express').Router();
const { deleteCommentsById } = require("../controllers/news.controllers")

commentsRouter.delete('/:comment_id', deleteCommentsById);

module.exports = commentsRouter;