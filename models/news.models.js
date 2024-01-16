const db = require("../db/connection");
const {
    articleAddComments,
    checkArticleExists
} = require('../db/seeds/utils')

exports.selectEndpoints = () => {
    return new Promise((resolve, reject) => {
        resolve(require("../endpoints.json"));
    }).then((endpointData) => {
        return endpointData;
    }).catch((err)=>{
        if (err.code === 'MODULE_NOT_FOUND'){
            return Promise.reject({msg: 'Not Found'});
        } else {
            return Promise.reject(err);
        }
    });
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

exports.selectArticles = () => {
    return db.query(`
    SELECT * FROM articles
    ORDER BY created_at DESC;
    `).then((articles)=>{
        const commentedArticles = articles.rows.map((article)=>{
            return articleAddComments(article);
        });

        return Promise.all(commentedArticles)
        .then((allArticles)=>{
            return allArticles;
        }). catch((error)=>{
            console.log(error)
        });
    }).catch((err)=>{
        return Promise.reject(err);
    })
}

exports.selectArticleById = (param) => {
    const id = param.article_id;
    return db.query(`
    SELECT * FROM articles
    WHERE articles.article_id = ${id}
    `).then((articles)=>{
        if (articles.rows.length === 0) {
            return Promise.reject({msg: 'Not Found'});
        }
       return articles.rows[0];
    }).catch((err)=>{
        return Promise.reject(err);
    })
}

exports.selectCommentsById = (param) => {
    const id = param.article_id;
    const getComments = (articleId) => db.query(`
    SELECT * FROM comments
    WHERE comments.article_id = ${articleId}
    ORDER BY created_at DESC`);

    const queries = [getComments(id)];
    if (id){
        const articleExistenceQuery = checkArticleExists(id);
        queries.push(articleExistenceQuery);
    }

    return Promise.all(queries)
    .then((comments)=>{
       return comments[0].rows;
    }).catch((err)=>{
        return Promise.reject(err);
    })
}