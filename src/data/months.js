/**
 * Month data for filter dropdowns
 */
export const MONTHS = [
  { value: '01', label: 'Jan' },
  { value: '02', label: 'Feb' },
  { value: '03', label: 'Mar' },
  { value: '04', label: 'Apr' },
  { value: '05', label: 'May' },
  { value: '06', label: 'Jun' },
  { value: '07', label: 'Jul' },
  { value: '08', label: 'Aug' },
  { value: '09', label: 'Sep' },
  { value: '10', label: 'Oct' },
  { value: '11', label: 'Nov' },
  { value: '12', label: 'Dec' }
]

/**
 * Get month label by value
 * @param {string} monthValue - Month value (e.g., '01')
 * @returns {string} Month label (e.g., 'Jan')
 */
export function getMonthLabel(monthValue) {
  const month = MONTHS.find(m => m.value === monthValue)
  return month ? month.label : monthValue
}
