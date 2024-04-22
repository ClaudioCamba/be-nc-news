// api-router.js
const apiRouter = require('express').Router();
const { getEndpoints } = require("../controllers/news.controllers")

apiRouter.get('/', getEndpoints);

module.exports = apiRouter;