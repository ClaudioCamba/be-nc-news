const db = require("../db/connection");

exports.selectEndpoints = async () => {
    try {
        const endpoints = await require("../endpoints.json");
        return endpoints;
    } catch(err){
        if (err.code === 'MODULE_NOT_FOUND'){
            return Promise.reject({msg: 'Not Found'});
        } else {
            return Promise.reject(err);
        }
    }
};

exports.selectTopics = () => {
    return db.query(`
        SELECT * FROM topics;
    `).then((topics)=>{
        return topics.rows;
    }).catch((err)=>{
        console.log('CATCH ERROR')
    });
};