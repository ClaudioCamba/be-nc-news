const {
    selectUsers,
    selectUsersByUsername,
    selectTopics, 
    selectEndpoints, 
    selectArticles, 
    selectArticleById,
    selectCommentsById,
    insertCommentsById,
    insertArticles,
    insertTopics,
    updateArticleById,
    removeCommentById,
    updateCommentById,
} = require('../models/news.models')


exports.getEndpoints = (req, res, next) => {
    selectEndpoints()
    .then((endpoints)=>{
        res.status(200).send({ endpoints });
    }).catch((next));
};

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics)=>{
        res.status(200).send({ topics });
    }).catch(next);
};

exports.postTopics = (req, res, next) => {
    insertTopics(req.body)
    .then((topic)=>{
        res.status(201).send({ topic });
    }).catch(next);
};

exports.postArticle = (req, res, next) => {
    insertArticles(req.body)
    .then((article)=> {
        res.status(201).send({ article });
    }).catch(next);
}

exports.getArticles = (req, res, next) => {
    selectArticles(req.query)
    .then((articles)=> {
        res.status(200).send({ articles });
    }).catch(next);
}

exports.getArticleById = (req, res, next) => {
    selectArticleById(req.params)
    .then((article)=> {
        res.status(200).send({ article });
    }).catch(next);
};

exports.getCommentsById = (req, res, next) => {
    selectCommentsById(req.params, req.query)
    .then((comments)=> {
        res.status(200).send({ comments });
    }).catch(next);
}

exports.postCommentsById = (req, res, next) => {
    insertCommentsById(req.body, req.params)
    .then((comment)=> {
        res.status(201).send({ comment });
    }).catch(next);
}

exports.patchArticleById = (req, res, next) => {
    updateArticleById(req.body, req.params)
    .then((article)=> {
        res.status(200).send({ article });
    }).catch(next);
}

exports.deleteCommentsById = (req, res, next) => {
    removeCommentById(req.params)
    .then(()=> {
        res.status(204).send();
    }).catch(next);
};

exports.patchCommentById = (req, res, next) => {
    updateCommentById(req.body, req.params)
    .then((comment)=> {
        res.status(200).send({comment});
    }).catch(next);
};

exports.getUsers = (req, res, next) => {
    selectUsers()
    .then((users) =>{
        res.status(200).send({ users });
    }).catch(next);
}

exports.getUserByUsername = (req, res, next) => {
    selectUsersByUsername(req.params)
    .then((user) =>{
        res.status(200).send({ user });
    }).catch(next);
}