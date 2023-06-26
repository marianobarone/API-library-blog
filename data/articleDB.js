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

async function updateArticle(article) {
    const clientmongo = await connection.getConnection();
    const query = { _id: new objectId(article._id) };
    const findedArticle = await getArticle(article._id);

    findedArticle.title = article.title;
    // findedArticle.headerImg = article.headerImg;
    findedArticle.body = article.body;
    findedArticle.date = article.date;
    findedArticle.comments = article.comments;

    console.log("FINDED ARTICLE UPDATED : " + JSON.stringify(findedArticle));

    const newvalues = {
        $set: {
            title: article.title,
            body: article.body,
            date: article.date,
            comments: article.comments
        },
    };

    const result = await clientmongo
        .db("BooksBlog")
        .collection("Articles")
        .updateOne(query, newvalues);
    return result;
}

async function updateComment(articleId, comment) {
    console.log("LLEGA A UPDATECOMMENT");
    const query = { _id: new objectId(articleId) };
    const findedArticle = await getArticle(articleId);
    console.log("FINDED ARTICLE: "+JSON.stringify(findedArticle));
    const oldComment = findedArticle.comments.find(item => item._id == comment._id);
    console.log("COMENTARIO OLD: " + JSON.stringify(oldComment));

    oldComment.author = comment.author != "" ? comment.author : oldComment.author;
    oldComment.date = comment.date != "" ? comment.date : oldComment.date;
    oldComment.body = comment.body != "" ? comment.body : oldComment.body;

    const result = updateArticle(findedArticle);

    return result;


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

async function deleteComment(idArticle, idComment) {
    // const clientmongo = await connection.getConnection();
    console.log("ID ARTICLE: " + idArticle);
    console.log("ID idComment: " + idComment);

    try {
        const findedArticle = await getArticle(idArticle);
        console.log("SE ENCUENTRA ARTICULO " + JSON.stringify(findedArticle));

        console.log(findedArticle != null);
        console.log(findedArticle == null);

        if (findedArticle != null) {
            console.log("adentro de if");
            findedArticle.comments = findedArticle.comments.filter(c => c._id != idComment);
            console.log(findedArticle.comments);
            const result = await updateArticle(findedArticle);
            console.log("RESULTADO DELETE COMMENT : " + JSON.stringify(result));
            return result;
        }
    } catch (error) {
        throw new Error("No se puedo eliminar el comentario");
    }
}

module.exports =
{
    getArticles,
    getArticle,
    addArticle,
    addComment,
    deleteArticle,
    deleteComment,
    updateComment
} 