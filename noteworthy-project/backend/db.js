const { Client } = require("pg");
const { DB_URI_info_1, DB_URI_info_2 } = require("./config")

let generalDB = null; // Connection for general data database
let userDB = null; // Connection for user data database



let general_DB_URI = (process.env.general_DB_URI || "postgresql://szuibmwj:UMCAdc65cGdL3ZvdWTRpoBUVx2u-A4V1@mahmud.db.elephantsql.com/szuibmwj")

let user_DB_URI = (process.env.user_DB_URI || "postgresql://fnfivnrh:glg9DbPKWN6Lt0lxx0B8w2gnC25fnl2m@mahmud.db.elephantsql.com/fnfivnrh")


generalDB = new Client(
  {
    connectionString: general_DB_URI,
    ssl: {
      rejectUnauthorized: false
    }
  });

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