const { Pool } = require("pg");
require("dotenv").config();

module.exports = new Pool({
  host: "localhost",
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});
