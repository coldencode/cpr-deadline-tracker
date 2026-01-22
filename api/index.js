const app = require('../app');

// Export Express app as serverless function for Vercel
// Vercel expects a handler function that receives (req, res)
module.exports = (req, res) => {
  // Set VERCEL environment variable so app.js doesn't start a server
  process.env.VERCEL = '1';
  return app(req, res);
};
