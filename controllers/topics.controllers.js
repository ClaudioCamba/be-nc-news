const {selectTopics, selectEndpoints} = require('../models/topics.models')

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
