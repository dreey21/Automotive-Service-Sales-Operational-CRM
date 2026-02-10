/**
 * Application-wide constants
 */

// Pagination
export const ITEMS_PER_PAGE = 50

// Part conditions
export const PART_CONDITIONS = {
  BRAND_NEW: 'brand_new',
  SURPLUS: 'surplus',
  OWNER_PART: 'owner_part'
}

export const PART_CONDITION_LABELS = {
  [PART_CONDITIONS.BRAND_NEW]: 'Brand New',
  [PART_CONDITIONS.SURPLUS]: 'Surplus',
  OWNER_PART: "Owner's Part"
}

// Toast variants
export const TOAST_VARIANTS = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// Debounce delays (in milliseconds)
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  FILTER: 200,
  RESIZE: 150
}
