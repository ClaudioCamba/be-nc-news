// topics-router.js
const topicsRouter = require('express').Router();
const { getTopics, postTopics } = require("../controllers/news.controllers")

topicsRouter
.route('/')
.get(getTopics)
.post(postTopics)

module.exports = topicsRouter;