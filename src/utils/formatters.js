/**
 * Utility functions for formatting data
 */

/**
 * Format a date string to human-readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date (e.g., "Jan 15, 2024")
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A'

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  } catch {
    return 'Invalid Date'
  }
}

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency symbol (default: ₱)
 * @returns {string} Formatted currency (e.g., "₱1,234.56")
 */
export function formatCurrency(amount, currency = '₱') {
  if (typeof amount !== 'number') return `${currency}0.00`
  return `${currency}${amount.toFixed(2)}`
}

/**
 * Format phone number
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
export function formatPhoneNumber(phone) {
  if (!phone) return ''
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Format as XXX-XXX-XXXX if 10 digits
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  
  return phone
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

/**
 * Pluralize a word based on count
 * @param {number} count - Count
 * @param {string} singular - Singular form
 * @param {string} plural - Plural form (optional, defaults to singular + 's')
 * @returns {string} Pluralized word
 */
export function pluralize(count, singular, plural) {
  if (count === 1) return singular
  return plural || `${singular}s`
}
