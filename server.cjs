require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('./db/client.cjs');
client.connect();
const express = require('express');
const app = express();
app.use(express.json());
const { getProducts, getProductById } = require('./db/products.cjs');
const { getReviewsByProductId, makeReviews, viewOwnReviews } = require('./db/reviews.cjs')
const { registerUser, getUserByUsername, getUserById } = require('./db/users.cjs')


app.get('/api/products', async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});



app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    if (!product) {
      return res.status(404).json({ error: 'product not found' });
    }

    res.json(product);
  } catch (err) {
    console.log(`hey now`, err);
  }
})



app.get('/api/products/:id/reviews', async (req, res) => {
  try {
    const productId = req.params.id;
    const reviews = await getReviewsByProductId(productId);

    if (reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this product." });
    }

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve reviews" });
  }
});



app.post('/api/reviews', async (req, res) => {
  try {
    const { user_id, product_id, review_text } = req.body;
    if (!user_id || !product_id || !review_text) {
      return res.status(400).json({ error: 'Missing Required Fields' });
    }

    const newReview = await makeReviews(user_id, product_id, review_text);
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: 'Failed to Create Review' });
  }
});



app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});



app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await registerUser(username, password);

    if (!user) {
      return res.status(400).json({ error: 'User registration failed' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    return res.status(201).json({ user, token });

  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({ error: 'Error registering user' });
  }
});



app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ user: { id: user.id, username: user.username }, token });
  } catch (err) {
    res.status(500).json({ error: 'Error logging in' });
  }
});



app.get('/api/auth/me', async (req, res) => {
  try {
    console.log("Authorization Header:", req.headers.authorization);
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Extracted Token:", token);

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    const user = await getUserById(decoded.id);
    console.log("User Found:", user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

app.get('/api/reviews/:user_id', async(req, res) => {
  try{
    const { user_id } = req.params;
    console.log(user_id)
    if(!user_id){
      return res.status(400).json({error: 'User id required'});
    }

    const userReviews= await viewOwnReviews(user_id);

    if(userReviews.length === 0){
      return res.status(404).json({error: 'No Reviews Found'});
    }
    res.json(userReviews);
  }catch(err){
    console.log(err);
  }
})