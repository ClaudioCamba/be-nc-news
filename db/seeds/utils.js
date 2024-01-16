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

exports.articleAddComments = (article) => {
  return db.query(`
    SELECT * FROM comments
    WHERE comments.article_id = ${article.article_id}
  `).then((comments) => {
    article.comments = comments.rows;
    article.comment_count = comments.rows.length;
    delete article.body;
    return article;
  }).catch((err) => {
    console.log(err)
  })
}