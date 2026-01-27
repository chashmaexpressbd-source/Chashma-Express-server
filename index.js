const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());

// ---------- MongoDB Setup ----------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hyxzws2.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// 🔥 Vercel-friendly cached connection
let cachedDb = null;

async function connectDB() {
  if (cachedDb) {
    return cachedDb;
  }

  await client.connect();
  console.log('✅ MongoDB connected');

  const db = client.db('ChashmaExpressBD');
  cachedDb = db;
  return db;
}

// ---------- Root Route ----------
app.get('/', (req, res) => {
  res.send('🚀 Chashma Express BD Server is running fine!');
});

// ---------- Product Routes ----------

// Dummy product test route
app.get('/products', (req, res) => {
  res.json({
    _id: '697600d90d3b6c54a84bd4d9',
    name: 'Mercedes Dotson',
    category: 'Carbon Fiber',
    price: '692',
    discountPrice: '2',
    stock: '96',
    brand: 'Nike',
    images: ['https://i.ibb.co/1fTjX88w/end-game.jpg'],
  });
});

// Save product
app.post('/products', async (req, res) => {
  try {
    const db = await connectDB();
    const productCollection = db.collection('products');

    const productData = req.body;
    productData.createdAt = new Date();

    const result = await productCollection.insertOne(productData);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all products (search supported)
app.get('/get-products', async (req, res) => {
  try {
    const db = await connectDB();
    const productCollection = db.collection('products');

    const search = req.query.search;
    let query = {};

    if (search) {
      query = { name: { $regex: search, $options: 'i' } };
    }

    const result = await productCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      details: error.message,
    });
  }
});

// Get single product
app.get('/single-products/:id', async (req, res) => {
  try {
    const db = await connectDB();
    const productCollection = db.collection('products');

    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const product = await productCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product
app.delete('/products/:id', async (req, res) => {
  try {
    const db = await connectDB();
    const productCollection = db.collection('products');

    const id = req.params.id;

    const result = await productCollection.deleteOne({
      _id: new ObjectId(id),
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------- Order Routes ----------

// Save order
app.post('/orders', async (req, res) => {
  try {
    const db = await connectDB();
    const ordersCollection = db.collection('orders');

    const order = req.body;
    order.createdAt = new Date();

    const result = await ordersCollection.insertOne(order);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all orders
app.get('/get-orders', async (req, res) => {
  try {
    const db = await connectDB();
    const ordersCollection = db.collection('orders');

    const result = await ordersCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
app.patch('/update-order/:id', async (req, res) => {
  try {
    const db = await connectDB();
    const ordersCollection = db.collection('orders');

    const { id } = req.params;
    const { status } = req.body;

    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } },
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------- Admin Login ----------
app.post('/admin-login', async (req, res) => {
  try {
    const db = await connectDB();
    const usersCollection = db.collection('users');

    const { email, password } = req.body;

    // ENV admin check
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      return res.json({
        success: true,
        role: 'admin',
        email,
      });
    }

    const user = await usersCollection.findOne({ email });

    if (!user || user.password !== password || user.role !== 'admin') {
      return res.status(401).json({ success: false });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------- Start Server ----------
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
