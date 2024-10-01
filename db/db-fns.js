const bcrypt = require("bcryptjs");
const dbPool = require("./pool");

const insertNewUser = async (first_name, last_name, username, password, membership_status) => {
  try {
    const sql = `
      insert into users (first_name, last_name, username, password, membership_status)
      values ($1, $2, $3, $4, $5);
    `;
    const hashedPassword = await bcrypt.hash(password, 10); 
    await dbPool.query(sql, [first_name, last_name, username, hashedPassword, membership_status]);
  } catch (err) {
    throw err;
  }
};

const insertNewPost = async (title, post, user_id) => {
  const getTimeNow = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  }

  try {
    const SQL = `
      INSERT INTO messages (title, timestamp, text, created_by_id)
      VALUES ($1, $2, $3, $4)
    `;

    await dbPool.query(SQL, [title, getTimeNow(), post, user_id]);
  } catch (err) {
    throw err;
  }
};

const getPosts = async () => {
  try {
    const SQL = `
      SELECT title, timestamp, text, username
      FROM messages
      INNER JOIN users
      ON messages.created_by_id = users.id;
    `;
    const { rows } = await dbPool.query(SQL);
    return rows;
  } catch (err) {
    throw err;
  }
};

const getRiddles = async () => {
  try {
    const SQL = `
      SELECT * FROM riddles;
    `;
    const { rows } = await dbPool.query(SQL);
    return rows;
  } catch (err) {
    throw err;
  }
};

const getRiddleById = async (id) => {
  try {
    const SQL = `
      SELECT * FROM riddles
      WHERE id = $1;
    `;
    const { rows } = await dbPool.query(SQL, [id]);
    return rows[0];
  } catch (err) {
    throw err;
  }
};

const getUserByUsername = async (username) => {
  try {
    const SQL = `
      SELECT * FROM users
      WHERE LOWER(username) = LOWER($1);
    `;
    const { rows } = await dbPool.query(SQL, [username]);
    return rows;
  } catch (err) {
    throw err;
  }
};

const updateUserMembership = async (id, newStatus) => {
  try {
    const SQL = `
      UPDATE users
      SET membership_status = $1
      WHERE id = $2;
    `;
    const { rows } = await dbPool.query(SQL, [newStatus, id]);
    return rows[0];
  } catch (err) {
    throw err;
  }
};

module.exports = {
  insertNewUser,
  insertNewPost,
  getPosts,
  getRiddles,
  getRiddleById,
  getUserByUsername,
  updateUserMembership,
};
