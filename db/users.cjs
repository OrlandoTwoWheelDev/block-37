const client = require('./client.cjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUsers = async (username, password, name) => {
  try {
    const { rows } = await client.query(`
      INSERT INTO users (username, password, name)
      VALUES ('${username}', '${password}', '${name}')
      RETURNING username, name;
      `);
    return rows[0];
  } catch (err) {
    console.log(`not again`, err);
  }
}

const registerUser = async (username, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await client.query(`
      INSERT INTO users (username, password)
      VALUES ('${username}', '${hashedPassword}')
      RETURNING id, username;
    `);

    return rows[0];
  } catch (err) {
    console.error('Error creating user:', err);
  }
};

const getUserByUsername = async (username) => {
  try {
    const { rows } = await client.query(
      `SELECT * FROM users WHERE username = $1;`,
      [username]
    );
    return rows[0];
  } catch (err) {
    console.error('Error fetching user by Username:', err);
    throw err;
  }
};

const getUserById = async (userId) => {
  try {
    const { rows } = await client.query(
      `SELECT id, username FROM users 
      WHERE id = '${userId}';
      `);
    return rows[0];
  } catch (err) {
    console.error("Error fetching user:", err);
    return null;
  }
};

module.exports = { createUsers, registerUser, getUserByUsername, getUserById };