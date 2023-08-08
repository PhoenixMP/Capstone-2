const { Client } = require("pg");
const { general_DB_URI, user_DB_URI } = require("./config");

let generalDB = null; // Connection for general data database
let userDB = null; // Connection for user data database


//database for song information
generalDB = new Client(
  {
    connectionString: general_DB_URI,
    ssl: {
      rejectUnauthorized: false
    }
  });


//database for users and scores
userDB = new Client(
  {
    connectionString: user_DB_URI,
    ssl: {
      rejectUnauthorized: false
    }
  }
);


generalDB.connect()
  .then(() => console.log("Connected to userDB"))
  .catch((err) => console.error("Error connecting to userDB:", err))


userDB.connect()
  .then(() => console.log("Connected to generalDB"))
  .catch((err) => console.error("Error connecting to generalDB:", err));

module.exports = { generalDB, userDB };