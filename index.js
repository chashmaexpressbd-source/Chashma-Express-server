const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// ---------- Middleware ----------
app.use(cors());
app.use(
  cors({
    origin: [
      'https://chashma-express-client.vercel.app',
      'http://localhost:5173',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

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

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Save order
app.post('/orders', async (req, res) => {
  try {
    const db = await connectDB();
    const ordersCollection = db.collection('orders');

    const order = req.body;
    order.createdAt = new Date();

    const result = await ordersCollection.insertOne(order);

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'chashmaexpressbd@gmail.com',
      subject: '🛒 New Order Received',
      html: `
  <div style="margin:0;padding:30px;background:#f3f4f6;font-family:Arial,sans-serif;">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">

      <!-- Header -->
      <div style="background:#dc2626;padding:20px;text-align:center;">
        <h1 style="color:#ffffff;margin:0;font-size:26px;">
          🛒 New Order Received
        </h1>
      </div>

      <!-- Body -->
      <div style="padding:30px;">

        <p style="font-size:16px;color:#374151;margin-bottom:20px;">
          A new customer has placed an order.
        </p>

        <div style="background:#f9fafb;padding:20px;border-radius:10px;border-left:5px solid #dc2626;">

          <table style="width:100%;border-collapse:collapse;font-size:15px;">

            <tr>
              <td style="padding:10px 0;font-weight:bold;color:#111827;">
                👤 Customer
              </td>
              <td style="padding:10px 0;color:#4b5563;">
                ${order.name}
              </td>
            </tr>

            <tr>
              <td style="padding:10px 0;font-weight:bold;color:#111827;">
                📞 Phone
              </td>
              <td style="padding:10px 0;color:#4b5563;">
                ${order.phone}
              </td>
            </tr>

            <tr>
              <td style="padding:10px 0;font-weight:bold;color:#111827;">
                📍 Address
              </td>
              <td style="padding:10px 0;color:#4b5563;">
                ${order.address}
              </td>
            </tr>

          </table>

        </div>

      </div>

      <!-- Footer -->
      <div style="background:#f9fafb;padding:18px;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="margin:0;font-size:13px;color:#6b7280;">
          This email was automatically generated from your website.
        </p>
      </div>

    </div>
  </div>
  `,
    });
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
