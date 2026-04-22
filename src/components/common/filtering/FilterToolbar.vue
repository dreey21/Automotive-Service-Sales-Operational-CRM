<template>
  <div class="mb-4">
    <!-- Mobile: Search full width on its own row -->
    <div class="mb-2 md:hidden">
      <SearchBar
        :modelValue="searchQuery"
        @update:modelValue="updateSearchQuery"
        placeholder="Search plate number, customer, invoice..."
      />
    </div>

    <!-- Filter row: desktop includes search inline, mobile just filters -->
    <div class="flex flex-wrap items-center gap-2">
      <!-- Search: desktop only, inline -->
      <div class="hidden md:block w-72">
        <SearchBar
          :modelValue="searchQuery"
          @update:modelValue="updateSearchQuery"
          placeholder="Search plate number, customer, invoice..."
        />
      </div>

      <!-- Month Filter Dropdown -->
      <div class="relative" ref="monthDropdownRef">
        <button
          @click="toggleMonthDropdown"
          :class="[
            'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border transition-colors',
            selectedMonth
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card text-foreground border-border hover:border-primary',
          ]"
          style="border-radius: 6px"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{{
            selectedMonth ? getMonthName(selectedMonth) : "Month"
          }}</span>
          <svg
            class="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <!-- Month Dropdown -->
        <div
          v-if="showMonthDropdown"
          class="absolute top-full left-0 mt-1 bg-white border border-border shadow-md z-20 min-w-[140px] max-h-[280px] overflow-y-auto"
          style="border-radius: 6px"
          @click.stop
        >
          <button
            v-for="month in months"
            :key="month.value"
            @click="selectMonth(month.value)"
            :class="[
              'w-full px-3 py-2 text-left text-sm transition-colors',
              selectedMonth === month.value
                ? 'bg-brand-sky text-brand-navy font-medium'
                : 'text-foreground hover:bg-muted',
            ]"
          >
            {{ month.label }}
          </button>
        </div>
      </div>

      <!-- Year Filter Dropdown -->
      <div class="relative" ref="yearDropdownRef">
        <button
          @click="toggleYearDropdown"
          :class="[
            'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border transition-colors',
            selectedYear
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card text-foreground border-border hover:border-primary',
          ]"
          style="border-radius: 6px"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{{ selectedYear || "Year" }}</span>
          <svg
            class="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <!-- Year Dropdown -->
        <div
          v-if="showYearDropdown"
          class="absolute top-full left-0 mt-1 bg-white border border-border shadow-md z-20 min-w-[100px]"
          style="border-radius: 6px"
          @click.stop
        >
          <button
            v-for="year in availableYears"
            :key="year"
            @click="selectYear(year)"
            :class="[
              'w-full px-3 py-2 text-left text-sm transition-colors',
              selectedYear === year
                ? 'bg-brand-sky text-brand-navy font-medium'
                : 'text-foreground hover:bg-muted',
            ]"
          >
            {{ year }}
          </button>
        </div>
      </div>

      <!-- Clear Filters Button -->
      <button
        v-if="hasActiveFilters"
        @click="clearFilters"
        class="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        style="border-radius: 6px"
      >
        <svg
          class="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="2.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        Clear filters
      </button>
    </div>
  </div>
</template>

<script setup>
import { months, getMonthName } from "@/utils/formatters";
import { onMounted, onUnmounted, ref } from "vue";
import SearchBar from "@/components/common/inputs/SearchBar.vue" 
const props = defineProps({
  selectedMonth: String,
  selectedYear: String,
  availableYears: Array,
  hasActiveFilters: Boolean,
  searchQuery: String,
});

const emit = defineEmits([
  "clearFilters",
  "selectMonth",
  "selectYear",
  "update:searchQuery",
]);

const clearFilters = () => {
  emit("clearFilters");
};

const selectMonth = (month) => {
  emit("selectMonth", month);
};

const selectYear = (year) => {
  emit("selectYear", year);
};

const updateSearchQuery = (newQuery) => {
  emit("update:searchQuery", newQuery);
};

const showMonthDropdown = ref(false);
const showYearDropdown = ref(false);
const monthDropdownRef = ref(null);
const yearDropdownRef = ref(null);

function handleClickOutside(event) {
  if (
    monthDropdownRef.value &&
    !monthDropdownRef.value.contains(event.target)
  ) {
    showMonthDropdown.value = false;
  }
  if (yearDropdownRef.value && !yearDropdownRef.value.contains(event.target)) {
    showYearDropdown.value = false;
  }
}

const toggleMonthDropdown = () => {
  showMonthDropdown.value = !showMonthDropdown.value;
  showYearDropdown.value = false;
};

const toggleYearDropdown = () => {
  showYearDropdown.value = !showYearDropdown.value;
  showMonthDropdown.value = false;
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
