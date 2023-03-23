require("dotenv").config();
const mongoclient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URI;
const pas = process.env.SECRET;

console.log("MONGO URI: " + uri);
console.log("PASS: " + pas);



const client = new mongoclient(uri);

let instance = null;

async function getConnection() {
  if (instance == null) {
    try {
      instance = await client.connect();      
    } catch (err) {
      console.log(err.message);
      throw new Error("problemas al conectarse con base de datos mongo");
    }
  }
  return instance;
}

module.exports = { getConnection };