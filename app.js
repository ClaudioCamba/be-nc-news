const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controllers.js")

app.use(express.json());
app.get('/api/topics', getTopics)

app.all('*', (req,res)=>{
    console.log('OTHER PATH REQUEST')
})

app.use((err, req, res, next) => {
if (err.status && err.msg) {
    console.log('OTHER ERROR')
    res.status(err.status).send({ msg: err.msg });
} else next(err);
});

app.use((err, req, res, next) => {
console.log(err);
res.status(500).send({ msg: 'Internal Server Error' });
});


module.exports = app
