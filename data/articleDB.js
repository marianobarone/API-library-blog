const connection = require('./connection.js')
const objectId = require("mongodb").ObjectId;

async function getArticles() {
    const clientmongo = await connection.getConnection();
    // console.log(clientmongo);

    console.log('Se llama a getArticles')

    const articles = await clientmongo.db("BooksBlog")
        .collection("Articles")
        .find()
        .toArray();

    return articles;
}

async function getArticle(id) {
    const clientmongo = await connection.getConnection();

    const article = await clientmongo.db("BooksBlog")
        .collection("Articles")
        .findOne({ _id: new objectId(id) });

    return article;
}

async function addArticle(article) {
    const clientmongo = await connection.getConnection();

    const result = await clientmongo.db("BooksBlog")
        .collection("Articles")
        .insertOne(article);

    if (result.insertedId) {
        return getArticle(result.insertedId)
    }
    else {
        return result;
    }
}

async function addComment(articleId, comment) {
    const clientmongo = await connection.getConnection();

    console.log(articleId);
    console.log(comment);
    const article = await getArticle(articleId);

    comment = { "_id": new objectId(), ...comment };

    console.log(comment);

    const query = { _id: new objectId(article._id) };
    console.log("Imprime resultadao de query:" + JSON.stringify(query));

    console.log("Articulo encontrado: " + JSON.stringify(article));
    console.log("Comentarios de articulo: " + JSON.stringify(article.comments));
    article.comments.push(comment);

    console.log("Comentarios de articulo: " + JSON.stringify(article.comments));


    const newvalues = {
        $set: {
            title: article.title,
            body: article.body,
            date: article.date,
            comments: article.comments
        },
    };

    console.log(JSON.stringify(newvalues))

    const result = await clientmongo
        .db("BooksBlog")
        .collection("Articles")
        .updateOne(query, newvalues);
    return result;
}

async function deleteArticle(idArticle) {
    const clientmongo = await connection.getConnection();
    const result = await clientmongo
        .db("BooksBlog")
        .collection("Articles")
        .deleteOne({ _id: new objectId(idArticle) });
    return result;
}


module.exports = { getArticles, getArticle, addArticle, addComment, deleteArticle } 