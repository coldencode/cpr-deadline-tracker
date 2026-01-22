/**
 * Backend date calculation utilities for CPR deadline tracker
 * Based on the flowchart logic for Particulars of Claim deadlines
 */

/**
 * Add days to a date (excluding weekends/bank holidays as per flowchart notes)
 * @param {Date} date - Starting date
 * @param {number} days - Number of days to add
 * @returns {Date} - New date
 */
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Add months to a date
 * @param {Date} date - Starting date
 * @param {number} months - Number of months to add
 * @returns {Date} - New date
 */
const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * Calculate deadline for non-Commercial/Circuit Commercial/Admiralty courts
 * @param {Date} claimFormIssued - When claim form was issued
 * @param {Date} claimFormServed - When claim form was served
 * @param {boolean} servedWithinEngland - Whether served within England
 * @returns {Object} - Calculated deadline and details
 */
const calculateStandardDeadline = (claimFormIssued, claimFormServed, servedWithinEngland) => {
  const monthsToAdd = servedWithinEngland ? 4 : 6;
  const deadline1 = addMonths(claimFormIssued, monthsToAdd);
  const deadline2 = addDays(claimFormServed, 14);
  
  // Return whichever is nearer (earlier date)
  const result = deadline1 < deadline2 ? deadline1 : deadline2;
  const location = servedWithinEngland ? 'within England' : 'outside England';
  
  return {
    deadline: result,
    details: `Claim Form issued: ${claimFormIssued.toISOString().split('T')[0]} + ${monthsToAdd} months = ${deadline1.toISOString().split('T')[0]}, OR Claim Form served: ${claimFormServed.toISOString().split('T')[0]} + 14 days = ${deadline2.toISOString().split('T')[0]}. Whichever is nearer (served ${location}).`
  };
};

/**
 * Calculate deadline for Commercial Court or Circuit Commercial Court
 * @param {Date} acknowledgmentFiled - When acknowledgment of service was filed
 * @returns {Object} - Calculated deadline and details
 */
const calculateCommercialDeadline = (acknowledgmentFiled) => {
  const deadline = addDays(acknowledgmentFiled, 28);
  return {
    deadline,
    details: `Acknowledgment of Service filed: ${acknowledgmentFiled.toISOString().split('T')[0]} + 28 days.`
  };
};

/**
 * Calculate deadline for Admiralty Court (claim in rem)
 * @param {Date} claimFormServed - When claim form was served
 * @returns {Object} - Calculated deadline and details
 */
const calculateAdmiraltyRemDeadline = (claimFormServed) => {
  const deadline = addDays(claimFormServed, 75);
  return {
    deadline,
    details: `Claim Form served: ${claimFormServed.toISOString().split('T')[0]} + 75 days.`
  };
};

/**
 * Calculate deadline for Admiralty Court (not claim in rem)
 * @param {Date} acknowledgmentFiled - When acknowledgment of service was filed
 * @returns {Object} - Calculated deadline and details
 */
const calculateAdmiraltyNonRemDeadline = (acknowledgmentFiled) => {
  const deadline = addDays(acknowledgmentFiled, 28);
  return {
    deadline,
    details: `Acknowledgment of Service filed: ${acknowledgmentFiled.toISOString().split('T')[0]} + 28 days.`
  };
};

/**
 * Main calculation function that routes to appropriate calculator
 * @param {Object} data - Input data from frontend
 * @returns {Object} - Calculated deadline and details
 */
const calculateDeadline = (data) => {
  const { courtType, commercialCourtType, isAdmiraltyRem, claimFormIssued, claimFormServed, acknowledgmentFiled, servedWithinEngland } = data;

  // Validate required fields based on path
  if (courtType === 'no') {
    // Standard court path
    if (!claimFormIssued || !claimFormServed || servedWithinEngland === null || servedWithinEngland === undefined) {
      throw new Error('Missing required fields for standard court calculation');
    }
    const issuedDate = new Date(claimFormIssued);
    const servedDate = new Date(claimFormServed);
    return calculateStandardDeadline(issuedDate, servedDate, servedWithinEngland);
  } 
  
  if (courtType === 'yes') {
    // Commercial/Circuit Commercial/Admiralty Court path
    if (commercialCourtType === 'commercial' || commercialCourtType === 'circuit') {
      // Commercial Court or Circuit Commercial Court
      if (!acknowledgmentFiled) {
        throw new Error('Missing required field: acknowledgmentFiled');
      }
      const ackDate = new Date(acknowledgmentFiled);
      return calculateCommercialDeadline(ackDate);
    } 
    
    if (commercialCourtType === 'admiralty') {
      // Admiralty Court
      if (isAdmiraltyRem === true) {
        // Claim in rem
        if (!claimFormServed) {
          throw new Error('Missing required field: claimFormServed');
        }
        const servedDate = new Date(claimFormServed);
        return calculateAdmiraltyRemDeadline(servedDate);
      } 
      
      if (isAdmiraltyRem === false) {
        // Not claim in rem
        if (!acknowledgmentFiled) {
          throw new Error('Missing required field: acknowledgmentFiled');
        }
        const ackDate = new Date(acknowledgmentFiled);
        return calculateAdmiraltyNonRemDeadline(ackDate);
      }
    }
  }

  throw new Error('Invalid input data for deadline calculation');
};

module.exports = {
  calculateDeadline,
  calculateStandardDeadline,
  calculateCommercialDeadline,
  calculateAdmiraltyRemDeadline,
  calculateAdmiraltyNonRemDeadline
};
