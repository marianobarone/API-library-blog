const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();



const joi = require("joi");
const dataUsers = require('../data/usersDB')

loginRouter.post('/', async (request, response) => {

    try {
        const { body } = request;
        console.log("Body:" + JSON.stringify(body));
        const { userName, password } = body

        console.log(userName, password);

        const user = await dataUsers.getUser(userName);

        const passwordCorrect = (user === null) ? false : await bcrypt.compare(password, user.password)

        console.log(passwordCorrect);

        if (!passwordCorrect) {
            console.log("Llega a error");

            return response.status(401).json({
                error: "Invalid credentials"
            })
        }
        console.log("Llega aca");

        const userForToken = {
            id: user._id,
            userName: user.userName,
            email: user.email,
        }

        const token = dataUsers.generateAuthToken(userForToken);

        response.status(200).json({
            user,
            token
        });
    } catch (error) {
        response.status(401).send(error.message);
    }

});

module.exports = loginRouter;

// router.post("/login", async (req, res) => {
//     try {
//       const usuario = await dataUsuarios.findByCredential(
//         req.body.email,
//         req.body.password
//       );
//       const token = dataUsuarios.generateAuthToken(usuario);
//       res.send({ usuario, token });
//     } catch (error) {
//       res.status(401).send(error.message);
//     }
//   });