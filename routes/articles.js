const express = require('express');
const router = express.Router();
const joi = require("joi");
const dataArticles = require('../data/articleDB.js')


router.get('/', async function (req, res, next) {
    let articles = await dataArticles.getArticles();
    res.json(articles);
})

router.get('/:id', async function (req, res, next) {
    let article = await dataArticles.getArticle(req.params.id);
    if (article) {
        res.json(article);
    } else {
        res.status(404).send('Articulo no encontrado');
    }
})

router.post('/', async (req, res) => {
    console.log("ENDPOINT PARA CREAR ARTICULO");
    console.log('Este es el body: ' + JSON.stringify(req.body));

    const schema = joi.object({
        title: joi.string().required(),
        headerImg: joi.string().required(),
        // date: joi.date(),
        body: joi.string().required(),

    })

    var today = new Date();
    var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();

    const result = schema.validate(req.body);
    req.body.date = date;
    req.body.comments = []

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
    } else {
        let article = req.body;
        article = await dataArticles.addArticle(article);
        res.json(article);
    }
})

router.post('/:idArticle/comment', async (req, res) => {
    console.log("Llega a endpoint--> /:idArticle/comment")

    console.log("Body de post" + req.body);

    const schema = joi.object({
        author: joi.string().required(),
        // date: joi.date(),
        body: joi.string().required()
    })

    var today = new Date();
    var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();

    const result = schema.validate(req.body);
    req.body.date = date;

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
    } else {
        let comment = req.body;
        article = await dataArticles.addComment(req.params.idArticle, comment);

        console.log(JSON.stringify(article))
        res.json(article);
    }
});

// router.delete('/:idArticle'), async (req, res) => {
//     console.log("Llega a endpoint DELETE /:idArticle");
//     const articuloEncontrado = await dataArticles.getArticle(req.params.idArticle);

//     if (articuloEncontrado) {
//         dataArticles.deleteArticle(req.params.idArticle);
//         res.status(200).send('Sucursal eliminada');
//     }
//     else {
//         res.status(404).send('Articulo no encontrado');
//     }
// }

router.delete('/:idArticle', async (req, res) => {
    console.log("Llega a endpoint DELETE /:idArticle");
    const articuloEncontrado = await dataArticles.getArticle(req.params.idArticle);

    if (articuloEncontrado) {
        const result = await dataArticles.deleteArticle(req.params.idArticle);
        console.log("Resultado: " + JSON.stringify(result));
        // res.json(result);
        res.status(200).send('Articulo eliminado');
    }
    else {
        res.status(404).send('Articulo no encontrado');
    }
});

module.exports = router;
