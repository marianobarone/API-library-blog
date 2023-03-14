const connection = require('./connection.js')
const objectId = require("mongodb").ObjectId;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function addUser(user) {
    const clientmongo = await connection.getConnection();
    user.password = await bcrypt.hash(user.password, 8);
    const result = await clientmongo
        .db("BooksBlog")
        .collection("Users")
        .insertOne(user);
    return result;
}

async function getUsers() {
    const clientmongo = await connection.getConnection();
    const usuarios = await clientmongo
        .db("BooksBlog")
        .collection("Users")
        .find()
        .toArray();
    return usuarios;
}

async function getUser(email) {
    const clientmongo = await connection.getConnection();
    // console.log(clientmongo);

    console.log('Se llama a getUser')

    const user = await clientmongo
        .db("BooksBlog")
        .collection("Users")
        .findOne({ email: email })

    return user;
}

function generateAuthToken(user) {
    const token = jwt.sign(user, process.env.SECRET, {
        expiresIn: "2h",
    });
    return token;
}



module.exports = {
    addUser,
    getUsers,
    getUser,
    generateAuthToken
} 