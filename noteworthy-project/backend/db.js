const { Client } = require("pg");
const { DB_URI_info_1, DB_URI_info_2 } = require("./config")

let generalDB = null; // Connection for general data database
let userDB = null; // Connection for user data database



let general_DB_URI = {
  ...DB_URI_info_1,
  database: process.env.general_DB_URI
}


let user_DB_URI = {
  ...DB_URI_info_2,
  database: process.env.user_DB_URI
}

userDB = new Client(user_DB_URI);
generalDB = new Client(general_DB_URI);

generalDB.connect()
  .then(() => console.log("Connected to userDB"))
  .catch((err) => console.error("Error connecting to userDB:", err))


userDB.connect()
  .then(() => console.log("Connected to generalDB"))
  .catch((err) => console.error("Error connecting to generalDB:", err));

module.exports = { generalDB, userDB };