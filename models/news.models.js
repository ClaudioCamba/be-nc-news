const db = require("../db/connection");
const format = require('pg-format');

const {
    checkArticleExists,
    createRef,
    checkUserExists,
    formatComments,
    checkTopicExists,
    checkValidQueries,
    convertTimestampToDate,
} = require('../db/seeds/utils')

exports.selectEndpoints = () => {
    return new Promise((resolve, reject) => {
        resolve(require("../endpoints.json"));
    }).then((endpointData) => {
        return endpointData;
    });
};

exports.selectTopics = () => {
    return db.query(`
        SELECT * FROM topics;
    `).then((topics)=>{
        return topics.rows;
    });
};

exports.selectArticles = (reqQuery) => {

    if(!checkValidQueries(reqQuery)) return Promise.reject({ msg: 'Not Found' })
    
    const order = reqQuery.order || "desc";
    const sort_by = reqQuery.sort_by || "created_at";

    let articleStr1 =`
    SELECT
    articles.author,
    articles.title,
    articles.article_id,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    `;

    let articleStr2 = `
    COUNT(comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id`

    if (!['asc', 'desc'].includes(order)) {
        return Promise.reject({ status: 404, msg: 'Invalid order query' });
    }

    if (!['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'article_img_url', 'comment_count'].includes(sort_by)) {
        return Promise.reject({ status: 404, msg: 'Invalid sort query' });
    }

    let articleStr3 = `
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}
    `;

    if (reqQuery.limit === '' || reqQuery.limit && reqQuery.p === '' || reqQuery.p){
        if (isNaN(reqQuery.limit)) return Promise.reject({ msg: 'Bad Request' })
        if (isNaN(reqQuery.p)) return Promise.reject({ msg: 'Bad Request' })

        const limit = reqQuery.limit === '' ? 10 : parseInt(reqQuery.limit) || 10;
        const pageNumber = reqQuery.p === '' ? 1 : parseInt(reqQuery.p) || 1;

        if (limit < 1) return Promise.reject({ msg: 'Bad Request' })
        if (pageNumber < 1) return Promise.reject({ msg: 'Bad Request' })
        
        const offset = (limit * pageNumber) - limit;
        
        articleStr1 += `COUNT(*) OVER() AS total_count,
        `
        articleStr3 += `LIMIT ${limit} OFFSET ${offset};
        `
    }
    
    const fullStr = () => articleStr1 + articleStr2 + articleStr3;
    let promiseFunction = db.query(fullStr());
    let queryExists = false;

    if (reqQuery.topic){
        promiseFunction = 
        checkTopicExists(reqQuery)
        .then((data)=>{
            if(data) {
                articleStr1 += ` articles.*,`;
                articleStr2 += ` WHERE articles.topic = $1`;
                queryExists = true;
            }

            return db.query(fullStr(), [reqQuery.topic]);
        });
    }
 
    return promiseFunction.then((articles)=>{
        // console.log(articles)

        if (queryExists) {
            return articles.rows;
        } else if (articles.rows.length === 0){
            return Promise.reject({ msg: 'Not Found' });
        } else return articles.rows;
    })
}
exports.insertArticles = (articleData) => {
    articleData.created_at = Date.now();
    articleData.votes = 0;

    const formattedArticleData = [articleData].map(convertTimestampToDate);
    const insertArticlesQueryStr = format(
      `INSERT INTO articles 
      (title, topic, author, body, created_at, votes, article_img_url) 
      VALUES %L RETURNING *;`,
      formattedArticleData.map(({ title,topic,author,body,created_at,votes,article_img_url
        }) => [title, topic, author, body, created_at, votes, article_img_url])
    );

    return db.query(insertArticlesQueryStr)
    .then((article)=>{

        return db.query(`
        SELECT articles.*,
        COUNT(comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;
        `,[article.rows[0].article_id])

    }).then((article)=> {
        return article.rows[0];
    });
}

exports.selectArticleById = ({article_id}) => {
    return db.query(`
    SELECT articles.*, 
    COUNT(comment_id) AS comment_count 
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;
    `,[article_id])
    .then((articles)=>{
        if (articles.rows.length === 0) {
            return Promise.reject({msg: 'Not Found'});
        }
       return articles.rows[0];
    });
}

exports.selectCommentsById = (request) => {
    const id = request.article_id;
    const getComments = (articleId) => db.query(`
    SELECT * FROM comments
    WHERE comments.article_id = $1
    ORDER BY created_at DESC`, [articleId]);

    const queries = [getComments(id)];
    if (id){
        const articleExistenceQuery = checkArticleExists(id);
        queries.push(articleExistenceQuery);
    }

    return Promise.all(queries)
    .then((comments)=>{
       return comments[0].rows;
    });
}

exports.insertCommentsById = (reqBody, reqParams) => {
    const commentData = [{
        body: reqBody.body,
        author: reqBody.username,
        article_id: reqParams.article_id,
        created_at: Date.now()
    }];

    return checkUserExists(reqBody.username).then((user)=>{
        return db.query(`
        SELECT * FROM articles
        WHERE articles.article_id = $1;`
        ,[reqParams.article_id])

    }).then((articles) => {

        if (articles.rows.length === 0) return Promise.reject({msg: 'Not Found'});

        const articleIdLookup = createRef(articles.rows, 'title', 'article_id');
        const formattedCommentData = formatComments(commentData, articleIdLookup);

        const insertCommentsQueryStr = format(
            'INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L RETURNING *;',
            formattedCommentData.map(
                (comment) => [
                comment.body,
                comment.author,
                comment.article_id,
                comment.votes = 0,
                comment.created_at
                ])
        );
        
        return db.query(insertCommentsQueryStr);
    }).then((response)=>{
        return response.rows[0];
    });
}

exports.updateArticleById = (reqBody, reqParams) => {
    return db.query(`
    UPDATE articles
    SET
      votes = votes + $1
    WHERE articles.article_id = $2
    RETURNING *;`, [reqBody.inc_votes,reqParams.article_id])
    .then((article)=>{
        if (article.rows.length === 0) {
            return Promise.reject({msg: 'Not Found'});
        }
        return article.rows[0];
    });
}

exports.removeCommentById = (reqParams) => {
    return db.query(`
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *`, [reqParams.comment_id])
    .then((response)=>{
        if (response.rows.length === 0){
            return Promise.reject({msg: 'Not Found'})
        }
        return response.rows;
    });
}

exports.updateCommentById = ({ inc_votes }, { comment_id }) => {
    return db.query(`
    UPDATE comments
    SET
      votes = votes + $1
    WHERE comments.comment_id = $2
    RETURNING *;`, [inc_votes, comment_id])
    .then((response)=>{
        if (response.rows.length === 0){
            return Promise.reject({msg: 'Not Found'})
        }
        return response.rows[0];
    });
}

exports.selectUsers = () => {
    return db.query(`
        SELECT * FROM users;
    `).then((users)=>{
        return users.rows;
    });
};

exports.selectUsersByUsername = ({username}) => {
    return db.query(`
        SELECT * FROM users
        WHERE username = $1`, [username])
    .then((user)=>{
        if (user.rows.length === 0){
            return Promise.reject({msg: 'Not Found'})
        }
        return user.rows[0];
    });
};

