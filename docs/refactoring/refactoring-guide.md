# 🎓 Step-by-Step Refactoring Guide

## Your Learning Path to Industry-Standard Vue.js

This guide will walk you through refactoring your CRM application component by component. Each step includes what to do, why you're doing it, and how to verify it works.

---

## ✅ Phase 1: Foundation (COMPLETED)

You now have:

- ✅ `src/data/jobLabels.js` - Job label mappings
- ✅ `src/data/months.js` - Month data
- ✅ `src/utils/constants.js` - App constants
- ✅ `src/utils/formatters.js` - Formatting functions
- ✅ `src/utils/validators.js` - Validation helpers
- ✅ `src/utils/helpers.js` - General utilities

---

## 🎯 Phase 2: Your First Composable - `useDebounce`

### **What You'll Learn:**

- How to create Vue composables
- Reactive state management
- Reusable logic patterns

### **Step 1: Create the Composable**

Create file: `src/composables/useDebounce.js`

```javascript
import { ref } from "vue";

/**
 * Debounce composable for delaying reactive updates
 * @param {number} delay - Delay in milliseconds
 * @returns {Object} Debounced value and setter
 */
export function useDebounce(delay = 300) {
  const debouncedValue = ref("");
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
  };
}
```

### **Step 2: Test It**

In `SalesRecordList.vue`, replace the debounce logic:

**Find this (around line 1027-1036):**

```javascript
const debouncedSearch = debounce((query) => {
  debouncedSearchQuery.value = query;
  currentPage.value = 1;
}, 300);

watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery);
});
```

**Replace with:**

```javascript
import { useDebounce } from "@/composables/useDebounce";

// In setup
const { debouncedValue: debouncedSearchQuery, setValue: setSearchQuery } =
  useDebounce(300);

watch(searchQuery, (newQuery) => {
  setSearchQuery(newQuery);
  currentPage.value = 1;
});
```

### **Why This Matters:**

- ✅ Reusable across components
- ✅ Testable in isolation
- ✅ Industry-standard pattern
- ✅ Cleaner component code

---

## 🎯 Phase 3: Your First Component - `SearchBar`

### **What You'll Learn:**

- Component props and emits
- v-model pattern
- Component composition

### **Step 1: Create the Component**

Create file: `src/components/common/inputs/SearchBar.vue`

```vue
<template>
  <div class="relative">
    <svg
      class="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[var(--muted-foreground)]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      :placeholder="placeholder"
      class="w-full h-11 pl-11 pr-3 bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent)] transition-colors"
      style="border-radius: 6px;"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Search...",
  },
});

defineEmits(["update:modelValue"]);
</script>
```

### **Step 2: Use It in SalesRecordList.vue**

**Find this (lines 33-47):**

```vue
<!-- Search Bar -->
<div class="mb-3">
  <div class="relative">
    <svg>...</svg>
    <input v-model="searchQuery" ... />
  </div>
</div>
```

**Replace with:**

```vue
<SearchBar
  v-model="searchQuery"
  placeholder="Search plate number, customer, invoice..."
  class="mb-3"
/>
```

**Add import at top of script:**

```javascript
import SearchBar from "@/components/common/inputs/SearchBar.vue";
```

### **Step 3: Verify**

1. Save files
2. Check browser - search should still work
3. Your component is now reusable!

---

## 📝 Your Next Steps

After completing SearchBar, tackle these in order:

1. **`EmptyState.vue`** - Empty state component
2. **`PartConditionBadge.vue`** - Badge component
3. **`JobHistoryBadge.vue`** - Another badge
4. **`RecordActionsMenu.vue`** - Dropdown menu

---

## 💡 Tips for Success

### **Before Creating Each Component:**

1. Find the code in `SalesRecordList.vue`
2. Identify what's reusable
3. Determine props and emits
4. Extract to new file
5. Import and use
6. Test thoroughly

### **Good Practices:**

- ✅ Keep components under 200 lines
- ✅ Use descriptive prop names
- ✅ Document with comments
- ✅ Test after each extraction

### **When You Get Stuck:**

Ask me:

- "How do I extract [specific part]?"
- "What props should this component have?"
- "Is this the right approach?"

---

## 🎯 Your Goal

By the end, you'll have:

- ✅ Professional component-based architecture
- ✅ Deep understanding of Vue composition
- ✅ Portfolio-worthy code
- ✅ Skills employers want

**Ready? Start with Phase 2!** 🚀
