const {selectTopics, selectEndpoints, selectArticleById} = require('../models/article.models')

exports.getEndpoints = (req, res, next) => {
    selectEndpoints().then((endpoints)=>{
        res.status(200).send({ endpoints });
    }).catch((next));
};

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics)=>{
        res.status(200).send({ topics });
    }).catch(next);
};

exports.getArticleById = (req, res, next) => {
    selectArticleById(req.params)
    .then((article)=> {
        res.status(200).send({ article });
    }).catch(next);
};