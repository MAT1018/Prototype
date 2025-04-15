const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// ✅ CORS configuration
const corsOptions = {
  origin: '*', // for development, allow all origins
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions)); // ✅ now using corsOptions

// ✅ Body parser
app.use(bodyParser.json());

// ✅ Log incoming requests
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// ✅ Health check route
app.get('/test', (req, res) => {
  res.send('🚀 Server is working!');
});

// ✅ Routes
const merchantRoutes = require('./routes/merchantRoutes');
app.use('/api/merchants', merchantRoutes);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ MongoDB connected");
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
})
.catch(err => console.error('❌ MongoDB error:', err));