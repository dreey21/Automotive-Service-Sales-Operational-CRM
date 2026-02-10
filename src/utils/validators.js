/**
 * Utility functions for validation
 */

/**
 * Check if a value is required (not empty)
 * @param {any} value - Value to check
 * @returns {boolean} True if value exists
 */
export function isRequired(value) {
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return value !== null && value !== undefined
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export function isValidEmail(email) {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (basic validation)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone
 */
export function isValidPhone(phone) {
  if (!phone) return false
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length >= 10 && cleaned.length <= 15
}

/**
 * Validate number is positive
 * @param {number} value - Number to validate
 * @returns {boolean} True if positive number
 */
export function isPositiveNumber(value) {
  return typeof value === 'number' && value > 0
}

/**
 * Validate plate number format (basic)
 * @param {string} plateNumber - Plate number to validate
 * @returns {boolean} True if valid format
 */
export function isValidPlateNumber(plateNumber) {
  if (!plateNumber) return false
  // Basic validation: at least 3 characters, alphanumeric
  return /^[A-Z0-9]{3,}$/i.test(plateNumber.replace(/[\s-]/g, ''))
}

/**
 * Validate date is not in the future
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if date is not in future
 */
export function isNotFutureDate(dateString) {
  if (!dateString) return false
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(23, 59, 59, 999) // End of today
  return date <= today
}
