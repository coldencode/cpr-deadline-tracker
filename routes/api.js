const express = require('express');
const router = express.Router();

// Example route - replace with your actual routes
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

// Add your API routes here
// Example:
// router.use('/deadlines', require('./deadlines'));

module.exports = router;
