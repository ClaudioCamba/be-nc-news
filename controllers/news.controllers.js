const {
    selectUsers,
    selectTopics, 
    selectEndpoints, 
    selectArticles, 
    selectArticleById,
    selectCommentsById,
    insertCommentsById,
    updateArticleById,
    removeCommentById
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

exports.getArticles = (req, res, next) => {
    selectArticles()
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
    selectCommentsById(req.params)
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

exports.getUsers = (req, res, next) => {
    selectUsers()
    .then((users) =>{
        res.status(200).send({ users });
    }).catch(next);
}