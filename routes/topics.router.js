// topics-router.js
const topicsRouter = require('express').Router();
const { getTopics } = require("../controllers/news.controllers")

topicsRouter.get('/', getTopics)

module.exports = topicsRouter;