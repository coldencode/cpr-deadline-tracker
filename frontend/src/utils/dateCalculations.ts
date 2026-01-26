/**
 * Date calculation utilities for CPR deadline tracker
 * Based on the flowchart logic for Particulars of Claim deadlines
 */

/**
 * Add days to a date (excluding weekends/bank holidays as per flowchart notes)
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Add months to a date
 */
export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * Calculate deadline for non-Commercial/Circuit Commercial/Admiralty courts
 */
export const calculateStandardDeadline = (
  claimFormIssued: Date,
  claimFormServed: Date,
  servedWithinEngland: boolean
): Date => {
  const monthsToAdd = servedWithinEngland ? 4 : 6;
  const deadline1 = addMonths(claimFormIssued, monthsToAdd);
  const deadline2 = addDays(claimFormServed, 14);
  
  // Return whichever is nearer (earlier date)
  return deadline1 < deadline2 ? deadline1 : deadline2;
};

/**
 * Calculate deadline for Commercial Court or Circuit Commercial Court
 */
export const calculateCommercialDeadline = (acknowledgmentFiled: Date): Date => {
  return addDays(acknowledgmentFiled, 28);
};

/**
 * Calculate deadline for Admiralty Court (claim in rem)
 */
export const calculateAdmiraltyRemDeadline = (claimFormServed: Date): Date => {
  return addDays(claimFormServed, 75);
};

/**
 * Calculate deadline for Admiralty Court (not claim in rem)
 */
export const calculateAdmiraltyNonRemDeadline = (acknowledgmentFiled: Date): Date => {
  return addDays(acknowledgmentFiled, 28);
};

/**
 * Format date for display
 */
export const formatDate = (date: Date | null): string => {
  if (!date) return '';
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Format date for input field (YYYY-MM-DD)
 */
export const formatDateForInput = (date: Date | null): string => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
