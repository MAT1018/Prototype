const App = require('./app');

const app = new App();

// Wrap in an async IIFE to use await
(async () => {
  await app.start();
})();

// Handle graceful shutdown
process.on('SIGINT', () => {
  app.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  app.stop();
  process.exit(0);
});