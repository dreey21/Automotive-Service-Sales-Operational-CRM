import { ref, watch, computed } from 'vue'
import { useDebounce } from './useDebounce'
import { jobLabels } from '@/utils/formatters'
export function useServiceFilter(database) {

    //refs
    const searchQuery = ref('')
    const currentPage = ref(1) 
    const selectedMonth = ref('')   
    const selectedYear = ref('')
    const showMonthDropdown = ref(false)
    const showYearDropdown = ref(false)
    const filteredCache = ref(new Map())
    const { debouncedValue: debouncedSearchQuery, setValue: setSearchQuery, reset: resetDebounce } = useDebounce(300)
    //computeds
    const filteredServices = computed(() => {
        return getFilteredRecords(debouncedSearchQuery.value, selectedMonth.value, selectedYear.value)
    })

    const availableYears = computed(() => {
        const years = new Set()
        database.forEach(service => {
            if (service.service_date) {
            years.add(service.service_date.split('-')[0])
            }
        })
        return Array.from(years).sort((a, b) => b - a)
    })

    const hasActiveFilters = computed(() => 
        !!(debouncedSearchQuery.value || selectedMonth.value || selectedYear.value)
    )

    const indexedRecords = computed(() => {
        return database.map(record => ({
            ...record,
            searchableText: [
            record.customer_name,
            record.phone,
            record.car_model,
            record.plate_number,
            record.invoice,
            ...(record.jobs_done || []).map(job => jobLabels[job])
            ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
        }))
    })

    //Actions
    function clearFilters() {
        selectedMonth.value = ''
        selectedYear.value = ''
        searchQuery.value = ''
        resetDebounce()
    }

    function selectMonth(month) {
        selectedMonth.value = selectedMonth.value === month ? '' : month
        showMonthDropdown.value = false
    }

    function selectYear(year) {
        selectedYear.value = selectedYear.value === year ? '' : year
        showYearDropdown.value = false
    }

    function toggleMonthDropdown() {
        showMonthDropdown.value = !showMonthDropdown.value
        showYearDropdown.value = false
    }

    function toggleYearDropdown() {
        showYearDropdown.value = !showYearDropdown.value
        showMonthDropdown.value = false
    }

    function getFilteredRecords(query = '', month = '', year = '') {
        const key = `${query}|${month}|${year}`
        
        if (filteredCache.value.has(key)) {
            return filteredCache.value.get(key)
        }
        
        let filtered = indexedRecords.value

        if (year) {
            filtered = filtered.filter(s => s.service_date?.startsWith(year))
        }

        if (month) {
            filtered = filtered.filter(s => s.service_date?.split('-')[1] === month)
        }

        if (query) {
            const q = query.toLowerCase()
            filtered = filtered.filter(s => s.searchableText.includes(q))
        }

        const result = filtered
            .slice()
            .sort((a, b) => new Date(b.service_date) - new Date(a.service_date))
        
        if (filteredCache.value.size > 50) {
            const firstKey = filteredCache.value.keys().next().value
            filteredCache.value.delete(firstKey)
        }
        filteredCache.value.set(key, result)
        
        return result
    }

    function clearCache() {
        filteredCache.value.clear()
    }

    //Search Debounce
    watch(searchQuery, (newQuery) => {
        setSearchQuery(newQuery)
        currentPage.value = 1 
    })

    watch([selectedMonth, selectedYear], () => {
        currentPage.value = 1
    })

    return{
        selectedMonth,
        selectedYear,
        showMonthDropdown,
        showYearDropdown,
        searchQuery,
        toggleMonthDropdown,
        toggleYearDropdown,
        currentPage,
        filteredServices,
        selectMonth,
        selectYear,
        availableYears,
        hasActiveFilters,
        clearFilters,
        clearCache   
    }
}