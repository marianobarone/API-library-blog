const connection = require('./connection.js')
const objectId = require("mongodb").ObjectId;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const tokenList = {};

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

function generateAuthTokens(user) {
    console.log("Llega a generateAuthToken");
    console.log(process.env.SECRET);
    // console.log(process.env.REFRESH_TOKEN_SECRET);

    const tokens = {
        token: jwt.sign(user, process.env.SECRET, { expiresIn: "7h" }),
        // refreshToken: jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1" })
    }

    // tokenList[tokens.refreshToken] = tokens
    console.log("TOKEN LIST: " + JSON.stringify(tokenList));
    return tokens;
}


module.exports = {
    addUser,
    getUsers,
    getUser,
    generateAuthTokens
} 