/**
 * Date calculation utilities for Acknowledgment of Service
 * Based on CPR rules and flowchart logic
 */

/**
 * Add days to a date
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Calculate standard defence deadline (28 days from DATEDOS)
 */
export const calculateStandardDefenceDeadline = (datedos: Date): Date => {
  return addDays(datedos, 28);
};

/**
 * Calculate judgment by default deadline (14 days from DATEDOS)
 */
export const calculateJudgmentByDefaultDeadline = (datedos: Date): Date => {
  return addDays(datedos, 14);
};

/**
 * Calculate defence deadline with extension
 */
export const calculateDefenceDeadlineWithExtension = (
  datedos: Date,
  extensionDays: number
): Date => {
  const standardDeadline = addDays(datedos, 28);
  const extension = Math.min(extensionDays, 28); // Max 28 days extension
  return addDays(standardDeadline, extension);
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
