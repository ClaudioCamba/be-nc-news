// comments-router.js
const commentsRouter = require('express').Router();
const { deleteCommentsById, patchCommentById } = require("../controllers/news.controllers")

commentsRouter
.route('/:comment_id')
.patch(patchCommentById)
.delete(deleteCommentsById);

module.exports = commentsRouter;