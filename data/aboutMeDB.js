const connection = require('./connection.js')
const objectId = require("mongodb").ObjectId;

async function getAboutMe(id) {
    const clientmongo = await connection.getConnection();

    console.log("id es: " + id);

    if (id != undefined) {
        const article = await clientmongo.db("BooksBlog")
            .collection("AboutMe")
            .findOne({ _id: new objectId(id) });

        return article;
    }
    else {
        return await clientmongo.db("BooksBlog")
            .collection("AboutMe")
            .find()
            .toArray();
    }
}

async function addAboutMe(aboutMe) {
    const clientmongo = await connection.getConnection();

    const result = await clientmongo.db("BooksBlog")
        .collection("AboutMe")
        .insertOne(aboutMe);

    if (result.insertedId) {
        return getAboutMe(result.insertedId)
    }
    else {
        return result;
    }
}

async function deleteAboutMe(id) {
    const clientmongo = await connection.getConnection();
    const result = await clientmongo
        .db("BooksBlog")
        .collection("AboutMe")
        .deleteOne({ _id: new objectId(id) });
    return result;
}

async function updateAboutMe(aboutMe) {
    const clientmongo = await connection.getConnection();
    const query = { _id: new objectId(aboutMe._id) };

    const findedAboutMe = await getAboutMe(aboutMe._id);

    console.log("Finded aboutMe: " + JSON.stringify(findedAboutMe));

    if (findedAboutMe) {
        findedAboutMe.body = aboutMe.body;
        findedAboutMe.img = aboutMe.img;
    }

    const newvalues = {
        $set: {
            body: findedAboutMe.body,
            img: findedAboutMe.img
        },
    };

    const result = await clientmongo
        .db("BooksBlog")
        .collection("AboutMe")
        .updateOne(query, newvalues);

    return result;
}


module.exports = {
    getAboutMe,
    addAboutMe,
    deleteAboutMe,
    updateAboutMe
} 