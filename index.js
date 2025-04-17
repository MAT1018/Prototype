const App = require('./app');

const app = new App();
app.start();

// Handle graceful shutdown
process.on('SIGINT', () => {
  app.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  app.stop();
  process.exit(0);
});