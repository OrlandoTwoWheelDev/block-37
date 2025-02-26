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

const getProducts = async () => {
  try {
    const { rows } = await client.query('SELECT * FROM products;');
    return rows;
  } catch (err) {
    console.error('Error retrieving products:', err);
  }
};

const getProductById = async(id) => {
  try{
    const { rows } = await client.query(`
      SELECT * FROM products
      WHERE id = '${id}';
      `);
      return rows[0];
  }catch(err){
    console.log(err)
  }
}

module.exports = { createProducts, getProducts, getProductById };