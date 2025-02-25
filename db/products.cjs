const client = require('./client.cjs');

const createProducts = async(name, description, price, category) => {
  try{
    const { rows } = await client.query(`
      INSERT INTO products (name, description, price, category) 
      VALUES ('${name}', '${description}', '${price}', '${category}')
      RETURNING *;
      `);
      return rows[0];
  }catch (err){
    console.log(`maybe start studying`, err);
  }
}
module.exports = { createProducts };