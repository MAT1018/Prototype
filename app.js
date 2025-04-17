const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/default.json');
const apiRoutes = require('./routes/api');
const bodyParser = require('body-parser');
const cors = require('cors');

class App {
  constructor() {
    this.app = express();
    this.server = null;
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  setupRoutes() {
    this.app.use('/api', apiRoutes);

    // Health check route
    this.app.get('/health', (req, res) => {
      res.json({ status: 'healthy' });
    });
  }

  async setupDatabase() {
    try {
      await mongoose.connect(config.database.url);
        // useNewUrlParser: true,
        // useUnifiedTopology: true
      
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error.message);
      process.exit(1);
    }
  }

  async start() {
    console.log('⏳ Starting app...');
    await this.setupDatabase();

    const port = config.server.port || 3000;
    const host = config.server.host || 'localhost';

    this.server = this.app.listen(port, host, () => {
      console.log(`🚀 Server running at http://${host}:${port}`);
    });
  }

  stop() {
    if (this.server) {
      this.server.close(() => {
        console.log('🛑 Server stopped');
        mongoose.disconnect();
      });
    }
  }
}

module.exports = App;