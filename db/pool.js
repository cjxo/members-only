const { Pool } = require("pg");
require("dotenv").config();

module.exports = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});
console.log(process.env.PGPORT);
