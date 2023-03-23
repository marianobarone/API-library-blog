const aboutMeRouter = require('express').Router();
const joi = require("joi");
const auth = require("../middleware/auth.js");
const dataAboutMe = require('../data/aboutMeDB')

aboutMeRouter.get('/', async function (request, response, next) {
    try {
        let aboutMe = await dataAboutMe.getAboutMe();
        // console.log("About me devuelto: " + JSON.stringify(aboutMe))
        if (aboutMe) {
            response.json(aboutMe[0]);
        } else {
            response.status(404).send('AboutMe no encontrado');
        }
    } catch (error) {
        response.status(401).send("Error:" + error);
    }
})

aboutMeRouter.get('/:id', async function (req, res, next) {
    try {
        let aboutMe = await dataAboutMe.getAboutMe(req.params.id);
        if (aboutMe) {
            res.json(aboutMe);
        } else {
            res.status(404).send('AboutMe no encontrado');
        }
    } catch (error) {
        response.status(401).send("Error:" + error);
    }
})

aboutMeRouter.post('/', auth, async (request, response) => {
    console.log("ENDPOINT PARA CREAR ABOUT ME");
    console.log('Este es el body: ' + JSON.stringify(request.body));

    const schema = joi.object({
        body: joi.string().required(),
        img: joi.string().allow(null, '')
    })

    const result = schema.validate(request.body);

    console.log("Validate result: " + JSON.stringify(result));

    if (result.error) {
        response.status(400).send(result.error.details[0].message);
    } else {
        let aboutMe = request.body;
        aboutMe = await dataAboutMe.addAboutMe(aboutMe);
        response.json(aboutMe);
    }
})

aboutMeRouter.put("/:id", auth, async (request, response) => {
    try {
        const schema = joi.object({
            body: joi.string().required(),
            img: joi.string().allow(null, '')
        })

        const result = schema.validate(request.body);

        if (result.error) {
            response.status(400).send(result.error.details[0].message);
        }
        else {

            let aboutMe = request.body;
            aboutMe._id = request.params.id;

            console.log("aboutMe para actualizar " + JSON.stringify(aboutMe));

            let result = await dataAboutMe.updateAboutMe(aboutMe);

            console.log(JSON.stringify(result.acknowledged));

            if (result.acknowledged) {
                response.status(200).json({ data: await dataAboutMe.getAboutMe(aboutMe._id), message: "AboutMe was succesfully updated" });
            }
            else {
                response.json(result);
            }
        }
    } catch (error) {
        console.log("error:" + error);
        response.status(401).send("Error al intentar actualizar aboutMe:" + error);
    }
});


aboutMeRouter.delete('/:id', auth, async (request, response) => {
    try {
        console.log("Llega a endpoint DELETE /:idArticle");
        const findedAboutMe = await dataAboutMe.getAboutMe(request.params.id);

        if (findedAboutMe) {
            const result = await dataAboutMe.deleteAboutMe(request.params.id);
            console.log("Resultado: " + JSON.stringify(result));
            // res.json(result);
            response.status(200).send('AboutMe eliminado');
        }
        else {
            response.status(404).send('AboutMe no encontrado');
        }
    } catch (error) {
        response.status(401).send("Error al intentar eliminar aboutMe:" + error);
    }

});

module.exports = aboutMeRouter;
