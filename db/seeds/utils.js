const db = require("../connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

exports.checkArticleExists = (id) =>{
    return db.query(`
    SELECT * FROM articles
    WHERE articles.article_id = $1`,[id])
    .then((article)=>{
    if(article.rows.length === 0){
      return Promise.reject({msg: 'Not Found'});
    }
  });
}

exports.checkTopicExists = (reqTopic) => {
      return db.query(`
      SELECT * FROM topics
      WHERE slug = $1`, [reqTopic.topic])
    .then((topics)=>{
      if (topics.rows.length === 0){
        return Promise.reject({msg: 'Not Found'})
      } 

      return true;
    });
}

exports.checkValidQueries = (reqQuery) => {
    const qualifiedQuery = ['topic','sort_by','order'];

  if (Object.keys(reqQuery).length > 0){
    const queryArr = Object.keys(reqQuery);
    for (let i = 0; i < queryArr.length; i++) {
        if (!qualifiedQuery.includes(queryArr[i])){
            return false;
        }
    }
  };

  return true
};