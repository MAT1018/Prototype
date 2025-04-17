const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const apiRoutes = require('./routes/api');
const bodyParser = require('body-parser');
const cors = require('cors');

class App {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupDatabase();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  setupRoutes() {
    this.app.use('/api', apiRoutes);
    
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ status: 'healthy' });
    });
  }

  async setupDatabase() {
    try {
      await mongoose.connect(config.database.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  }

  start() {
    const port = config.server.port;
    this.server = this.app.listen(port, config.server.host, () => {
      console.log(`Server running on http://${config.server.host}:${port}`);
    });
  }

  stop() {
    if (this.server) {
      this.server.close();
      mongoose.disconnect();
    }
  }
}

module.exports = App;