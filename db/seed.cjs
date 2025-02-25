require('dotenv').config();
const client = require('./client.cjs');
const createUsers = require('./users.cjs');

const dropTables = async() => {
  try{
    await client.query(`
      DROP TABLE IF EXISTS users,
      DROP TABLE IF EXISTS products,
      DROP TABLE IF EXISTS reviews;
      `)
  } catch (err) { 
    console.log(`you have an error`, err);
  }
}

const createTables = async() => {
  try{
    await client.query(`
      CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(30) NOT NULL UNIQUE,
      password VARCHAR(30) NOT NULL,
      name VARCHAR(30) 
      );

      
      `)
  } catch(err){
    console.log(`at least you can miss`, err);
  }
}