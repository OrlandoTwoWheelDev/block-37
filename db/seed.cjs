require('dotenv').config();
const client = require('./client.cjs');
const { createUsers } = require('./users.cjs');
const { createProducts } = require('./products.cjs');
const { createReviews } = require('./reviews.cjs');

const dropTables = async () => {
  try {
    await client.query(`
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS users;
    `);
  } catch (err) {
    console.log(`you have an error`, err);
  }
}

const createTables = async () => {
  try {
    await client.query(`
      CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(30) NOT NULL UNIQUE,
      password VARCHAR(30) NOT NULL,
      name VARCHAR(30) 
      );

      CREATE TABLE products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price INTEGER,
      category TEXT
      );

      CREATE TABLE reviews (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      product_id INT REFERENCES products(id) ON DELETE CASCADE,
      review_text TEXT
      );
      `);
  } catch (err) {
    console.log(`at least you can miss`, err);
  }
}

const addAndFold = async () => {
  try {
    console.log(`connecting to DB`)
    await client.connect();
    console.log(`CONNECTED TO DB`);

    console.log(`dropping tables`);
    await dropTables();
    console.log(`TABLES DROPPED`);

    console.log(`creating tables`);
    await createTables();
    console.log(`TABLES CREATED`);

    console.log(`creating users`);
    await createUsers('Superman', 'Clark Kent');
    await createUsers('Noble Six', 'Spartan B312');
    await createUsers('The Jackal', 'Newt Scamander');
    await createUsers('LTinglourious', 'Aldo Raine');
    await createUsers('DocHSR', 'Desmond Doss');
    console.log(`USERS CREATED`);

    console.log(`creating products`);
    await createProducts('Metallic Rubber', 'Component of Kryptonia Suits', 36000, 'armor');
    await createProducts('Mjolnir Armor', 'Worn by Spartans', 2000000000, 'armor');
    await createProducts('SRS99-AM', 'Spartan Sniper Rifle', 16448820, 'weaponry');
    await createProducts('Suitcase Rifle', 'Amazing craftsmanship by Newt', 1000000, 'weaponry');
    await createProducts('Italian Language Guide', 'Few words, Much Comprehension', 5, 'literature');
    await createProducts('M1 Garand', 'You either got it, or you are a doc', 2000, 'weaponry');
    console.log(`PRODUCTS CREATED`);

    console.log(`creating reviews`)
    await createReviews(2, 2, 'Absolutely love this armor, perfect for my needs.');
    await createReviews(2, 3, 'Great rifle, but could use more ammo.');
    await createReviews(1, 1, 'Not sure how useful this is, but it looks cool.');
    await createReviews(3, 4, 'Fantastic craftsmanship, Newt never disappoints.');
    await createReviews(4, 5, 'Helped me blend in with the locals, bawn jairno.');
    await createReviews(5, 6, 'Classic rifle, i just dont use it.');
    console.log(`REVIEWS CREATED`);

    console.log(`disconnecting from DB`)
    await client.end();
    console.log(`Disconnected`);
  } catch (err) {
    console.log(`maybe you should practice`, err);
  }
}
addAndFold();