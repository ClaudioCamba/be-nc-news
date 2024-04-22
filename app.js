const cors = require('cors');
const express = require("express");
const apiRouter = require('./routes/api.router.js');
const topicsRouter = require('./routes/topics.router.js');
const usersRouter = require('./routes/users.router.js');
const articlesRouter = require('./routes/articles.router.js');
const commentsRouter = require('./routes/comments.router.js');

const app = express();

const {
    handleEndpointError,
    handleCustomErrors,
    handlePsqlErrors,
    handleServerErrors,
  } = require('./errors.js');

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);
app.use('/api/topics', topicsRouter);
app.use('/api/users', usersRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/comments', commentsRouter);

app.all('*',handleEndpointError);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app
