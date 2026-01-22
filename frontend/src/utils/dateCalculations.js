/**
 * Date calculation utilities for CPR deadline tracker
 * Based on the flowchart logic for Particulars of Claim deadlines
 */

/**
 * Add days to a date (excluding weekends/bank holidays as per flowchart notes)
 * @param {Date} date - Starting date
 * @param {number} days - Number of days to add
 * @returns {Date} - New date
 */
export const addDays = (date, days) => {
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
export const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * Calculate deadline for non-Commercial/Circuit Commercial/Admiralty courts
 * @param {Date} claimFormIssued - When claim form was issued
 * @param {Date} claimFormServed - When claim form was served
 * @param {boolean} servedWithinEngland - Whether served within England
 * @returns {Date} - Calculated deadline
 */
export const calculateStandardDeadline = (claimFormIssued, claimFormServed, servedWithinEngland) => {
  const monthsToAdd = servedWithinEngland ? 4 : 6;
  const deadline1 = addMonths(claimFormIssued, monthsToAdd);
  const deadline2 = addDays(claimFormServed, 14);
  
  // Return whichever is nearer (earlier date)
  return deadline1 < deadline2 ? deadline1 : deadline2;
};

/**
 * Calculate deadline for Commercial Court or Circuit Commercial Court
 * @param {Date} acknowledgmentFiled - When acknowledgment of service was filed
 * @returns {Date} - Calculated deadline (acknowledgment + 28 days)
 */
export const calculateCommercialDeadline = (acknowledgmentFiled) => {
  return addDays(acknowledgmentFiled, 28);
};

/**
 * Calculate deadline for Admiralty Court (claim in rem)
 * @param {Date} claimFormServed - When claim form was served
 * @returns {Date} - Calculated deadline (served + 75 days)
 */
export const calculateAdmiraltyRemDeadline = (claimFormServed) => {
  return addDays(claimFormServed, 75);
};

/**
 * Calculate deadline for Admiralty Court (not claim in rem)
 * @param {Date} acknowledgmentFiled - When acknowledgment of service was filed
 * @returns {Date} - Calculated deadline (acknowledgment + 28 days)
 */
export const calculateAdmiraltyNonRemDeadline = (acknowledgmentFiled) => {
  return addDays(acknowledgmentFiled, 28);
};

/**
 * Format date for display
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Format date for input field (YYYY-MM-DD)
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
