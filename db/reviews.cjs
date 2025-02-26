const client = require('./client.cjs');

const createReviews = async (user_id, product_id, review_text) => {
  try {
    const { rows } = await client.query(`
      INSERT INTO reviews (user_id, product_id, review_text)
      VALUES ('${user_id}', '${product_id}', '${review_text}')
      RETURNING *;
      `)
    return rows[0];
  } catch (err) {
    console.log(`look bro`, err);
  }
}

const getReviewsByProductId = async (productId) => {
  try {
    const { rows } = await client.query(`
      SELECT * FROM reviews
      WHERE product_id = '${productId}';
    `);
    return rows;
  } catch (err) {
    console.error("Error fetching reviews:", err);
  }
};

const makeReviews = async (user_id, product_id, review_text) => {
  try {
    const { rows } = await client.query(
      `INSERT INTO reviews (user_id, product_id, review_text)
       VALUES ('${user_id}', '${product_id}', '${review_text}')
       RETURNING *;
       `);
    return rows[0];
  } catch (err) {
    console.error('Error creating review:', err);
    throw err;
  }
};

const viewOwnReviews = async (user_id) => {
  const { rows } = await client.query(
    `
    SELECT * FROM reviews
    WHERE user_id = $1;
    `,
    [user_id]
  );
  return rows;
};

module.exports = {
  createReviews, getReviewsByProductId,
  makeReviews, viewOwnReviews
};