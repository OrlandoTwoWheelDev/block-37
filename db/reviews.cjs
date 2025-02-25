const client = require('./client.cjs');

const createReviews = async(user_id, product_id, review_text) => {
  try{
    const { rows } = await client.query(`
      INSERT INTO reviews (user_id, product_id, review_text)
      VALUES ('${user_id}', '${product_id}', '${review_text}')
      RETURNING *;
      `)
      return rows[0];
  }catch(err){
    console.log(`look bro`, err);
  }
}
module.exports = { createReviews };