const { Client } = require("pg");
const { DB_URI_info } = require("./config")

let generalDB = null; // Connection for general data database
let userDB = null; // Connection for user data database

let user_DB_URI = {
  ...DB_URI_info,
  database: (process.env.NODE_ENV === "test" ? "melodic2_users_test" : "melodic2_users"),
}

let general_DB_URI = {
  ...DB_URI_info,
  database: (process.env.NODE_ENV === "test" ? "melodic2_songs_test" : "melodic2_songs"),
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