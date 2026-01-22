const { calculateDeadline } = require('../utils/dateCalculations');

// Serverless function for calculating deadline
// Accessible at /api/calculate-deadline
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

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
        success: false,
        error: 'Missing required field: courtType' 
      });
    }

    // Calculate deadline using the utility function
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
    res.status(200).json({
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
};
