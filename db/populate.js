const { Client } = require("pg");
require("dotenv").config();

const SQL = 
`
  DROP TABLE IF EXISTS messages;
  DROP TABLE IF EXISTS users;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR(128),
    last_name VARCHAR(128),
    username VARCHAR(256),
    password VARCHAR(256),
    membership_status INTEGER
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(128),
    timestamp VARCHAR(128),
    text VARCHAR(512),
    created_by_id INTEGER REFERENCES users(id)
  );
`;

async function main() {
  console.log("Seeding...");
  const client = new Client({
    host: "localhost",
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PWORD,
    port: 5432
  });

  await client.connect();
  await client.query(SQL);
  await client.end();

  console.log("done.");
}

main();
