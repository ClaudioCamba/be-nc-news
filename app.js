const express = require("express");
const app = express();

const { getTopics, getEndpoints } = require("./controllers/topics.controllers.js")

app.get('/api', getEndpoints)
app.get('/api/topics', getTopics)

app.all('*', (req,res)=>{
    res.status(404).send({msg : 'Not Found'})
})

app.use((err, req, res, next) => {
    if (err.msg === 'Not Found') {
        res.status(404).send({msg: err.msg});
    } else if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else next(err);
});

app.use((err, req, res, next) => {
console.log(err);
res.status(500).send({ msg: 'Internal Server Error' });
});


module.exports = app
