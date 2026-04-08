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

// Month Filtering Dropdown
export const months = [
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

export function getMonthName(monthValue) {
  const month = months.find(m => m.value === monthValue)
  return month ? month.label : monthValue
}

//
export const jobLabels = {
  replace_evaporator_front: 'Evaporator Front',
  replace_evaporator_rear: 'Evaporator Rear',
  replace_condenser: 'Condenser',
  replace_compressor: 'Compressor',
  replace_blower_motor: 'Blower Motor',
  replace_expansion_valve: 'Expansion Valve',
  replace_pulley_assembly: 'Pulley Assembly',
  replace_fan_motor: 'Fan Motor',
  replace_suction_hose_assembly: 'Suction Hose Assembly',
  replace_fan_belt: 'Fan Belt',
  replace_filter_drier: 'Filter Drier',
  replace_discharge_hose_suction: 'Discharge Hose Suction',
  replace_ecv: 'ECV',
  replace_oring: 'O-ring',
  replace_radiator: 'Radiator',
  replace_cabin_filter: 'Cabin Filter',
  replace_magnetic: 'Magnetic',
  pulldown_evaporator: 'Pulldown Evaporator',
  pulldown_condenser: 'Pulldown Condenser',
  pulldown_compressor: 'Pulldown Compressor',
  flushing_system: 'Flushing System',
  install_cabin_filter: 'Install Cabin Filter',
  cleaning: 'Cleaning',
  freon: 'Freon'
}

export function getJobsSummary(jobs) {
  if (!jobs || jobs.length === 0) return 'No jobs'
  if (jobs.length === 1) return jobLabels[jobs[0]] || jobs[0]
  if (jobs.length === 2) return `${jobLabels[jobs[0]] || jobs[0]}, ${jobLabels[jobs[1]] || jobs[1]}`
  if (jobs.length === 3) return `${jobLabels[jobs[0]] || jobs[0]}, ${jobLabels[jobs[1]] || jobs[1]}, ${jobLabels[jobs[2]] || jobs[2]}`
  return `${jobLabels[jobs[0]] || jobs[0]}, ${jobLabels[jobs[1]] || jobs[1]} +${jobs.length - 2} more`
}



