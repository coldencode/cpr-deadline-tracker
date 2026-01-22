const express = require('express');
const router = express.Router();
const { calculateDeadline } = require('../utils/dateCalculations');

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

// Calculate deadline route
router.post('/calculate-deadline', (req, res) => {
  try {
    const {
      courtType,
      commercialCourtType,
      isAdmiraltyRem,
      claimFormIssued,
      claimFormServed,
      acknowledgmentFiled,
      servedWithinEngland
    } = req.body;

    // Validate request body
    if (!courtType) {
      return res.status(400).json({ 
        error: 'Missing required field: courtType' 
      });
    }

    console.log('called calculateDeadline');
    // Calculate deadline
    const result = calculateDeadline({
      courtType,
      commercialCourtType,
      isAdmiraltyRem,
      claimFormIssued,
      claimFormServed,
      acknowledgmentFiled,
      servedWithinEngland
    });

    // Return result with formatted date
    res.json({
      success: true,
      deadline: result.deadline.toISOString().split('T')[0], // Format as YYYY-MM-DD
      deadlineDate: result.deadline,
      calculationDetails: result.details
    });
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Invalid calculation request'
    });
  }
});

module.exports = router;
