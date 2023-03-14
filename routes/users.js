const bcrypt = require('bcrypt');
const joi = require("joi");
const usersRouter = require('express').Router();
const dataUsers = require('../data/usersDB.js')

// router.get("/", auth, async function (req, res) {
  usersRouter.get("/", async function (request, response) {
  const users = await dataUsers.getUsers();
  response.send(users)
});

usersRouter.post("/", async (request, response) => {
  const schema = joi.object({
    name: joi.string().required(),
    surname: joi.string().required(),
    password: joi.string().alphanum().required(),
    email: joi.string().required(),
  });

  const result = schema.validate(request.body);

  if (result.error) {
    response.status(400).send(result.error.details[0].message);
  }
  else {
    let user = request.body;
    let userName = request.body.email.split("@")[0];
    user = { ...user, userName: userName }
    user = await dataUsers.addUser(user);
    response.status(200).json(user);
  }
});

module.exports = usersRouter;
