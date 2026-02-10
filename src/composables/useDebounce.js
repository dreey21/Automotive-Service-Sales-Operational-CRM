import { ref } from 'vue'

/**
 * Debounce composable for delaying reactive updates
 * @param {number} delay - Delay in milliseconds
 * @returns {Object} Debounced value and setter
 */

export function useDebounce(delay=300) {
    const debouncedValue = ref ("");
    let timeoutId = null;

    const setValue = (newValue) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          debouncedValue.value = newValue;
        }, delay); 
    };
    
    return {
        debouncedValue,
        setValue,
    }
}