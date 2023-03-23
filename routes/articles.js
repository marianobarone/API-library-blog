const express = require('express');
const articlesRouter = express.Router();
const joi = require("joi");
const auth = require("../middleware/auth.js");
const dataArticles = require('../data/articleDB.js')

articlesRouter.get('/', async function (request, response, next) {
    let articles = await dataArticles.getArticles();
    response.json(articles);
})

articlesRouter.get('/:id', async function (request, response, next) {
    let article = await dataArticles.getArticle(request.params.id);
    if (article) {
        response.json(article);
    } else {
        response.status(404).send('Articulo no encontrado');
    }
})

articlesRouter.post('/', auth, async (request, response) => {
    console.log("ENDPOINT PARA CREAR ARTICULO");
    console.log('Este es el body: ' + JSON.stringify(request.body));

    const schema = joi.object({
        title: joi.string().required(),
        headerImg: joi.string().required(),
        // date: joi.date(),
        body: joi.string().required(),

    })

    var today = new Date();
    var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();

    const result = schema.validate(request.body);
    request.body.date = date;
    request.body.comments = []

    if (result.error) {
        response.status(400).send(result.error.details[0].message);
    } else {
        let article = request.body;
        article = await dataArticles.addArticle(article);
        response.json(article);
    }
})

articlesRouter.post('/:idArticle/comment', async (request, response) => {
    console.log("Llega a endpoint--> /:idArticle/comment")

    console.log("Body de post" + request.body);

    const schema = joi.object({
        author: joi.string().required(),
        // date: joi.date(),
        body: joi.string().required()
    })

    var today = new Date();
    var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();

    const result = schema.validate(request.body);
    request.body.date = date;

    if (result.error) {
        response.status(400).send(result.error.details[0].message);
    } else {
        let comment = request.body;
        article = await dataArticles.addComment(request.params.idArticle, comment);

        console.log(JSON.stringify(article))
        response.json(article);
    }
});

articlesRouter.delete('/:idArticle', auth, async (request, response) => {
    console.log("Llega a endpoint DELETE /:idArticle");
    const articuloEncontrado = await dataArticles.getArticle(request.params.idArticle);

    if (articuloEncontrado) {
        const result = await dataArticles.deleteArticle(request.params.idArticle);
        console.log("Resultado: " + JSON.stringify(result));
        // response.json(result);
        response.status(200).send('Articulo eliminado');
    }
    else {
        response.status(404).send('Articulo no encontrado');
    }
});

module.exports = articlesRouter;
