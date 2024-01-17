const app = require('./app');

exports.handleEndpointError = (req,res)=> {
    res.status(404).send({msg : 'Not Found'});
};

exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === '42883') {
        res.status(400).send({msg: 'Bad Request'});
    } else if (err.code === '22P02') {
        res.status(400).send({msg: 'Bad Request'});
    } else if (err.code === '42703') {
        res.status(400).send({msg: 'Bad Request'});
    } else if (err.code === '42601') {
        res.status(400).send({msg: 'Bad Request'});
    } else if (err.code === '23502') {
        res.status(400).send({msg: 'Bad Request'});
    } else if (err.code === '23503') {
        res.status(404).send({msg: 'Not Found'});
    } else  next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.msg === 'Not Found') {
        res.status(404).send({msg: err.msg});
    } else if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
};