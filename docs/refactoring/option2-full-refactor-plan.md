# 🚀 Option 2: Full Refactor Plan

## Complete Component-Based Architecture for Your CRM

---

## 📂 **Complete Folder Structure**

```
src/
├── components/
│   ├── common/                          # Shared across entire app
│   │   ├── buttons/
│   │   │   ├── PrimaryButton.vue        # Main action button
│   │   │   ├── SecondaryButton.vue      # Secondary actions
│   │   │   └── IconButton.vue           # Icon-only button
│   │   │
│   │   ├── inputs/
│   │   │   ├── SearchBar.vue            # Search with icon
│   │   │   ├── TextInput.vue            # Standard text input
│   │   │   ├── NumberInput.vue          # Number input with validation
│   │   │   ├── DateInput.vue            # Date picker input
│   │   │   └── PhoneInput.vue           # Phone number input
│   │   │
│   │   ├── feedback/
│   │   │   ├── ToastNotification.vue    # Toast messages
│   │   │   ├── ErrorMessage.vue         # Error display
│   │   │   ├── LoadingSpinner.vue       # Loading indicator
│   │   │   └── EmptyState.vue           # Empty state display
│   │   │
│   │   ├── navigation/
│   │   │   ├── AppHeader.vue            # Top header
│   │   │   ├── SidebarNavigation.vue    # Desktop sidebar
│   │   │   └── BottomNavigation.vue     # Mobile bottom nav
│   │   │
│   │   ├── overlays/
│   │   │   ├── BaseModal.vue            # Modal wrapper
│   │   │   ├── BaseDrawer.vue           # Drawer wrapper
│   │   │   └── BottomSheet.vue          # Mobile bottom sheet
│   │   │
│   │   └── data-display/
│   │       ├── Badge.vue                # Generic badge
│   │       ├── StatusBadge.vue          # Status indicator
│   │       └── DataTable.vue            # Reusable table
│   │
│   ├── features/
│   │   ├── sales/
│   │   │   ├── SalesHeader.vue          # "Recent Transactions" header + Add button
│   │   │   ├── SalesSearchBar.vue       # Search bar (or use common/SearchBar)
│   │   │   ├── SalesFilters.vue         # Month/Year filters + Clear button
│   │   │   │
│   │   │   ├── mobile/
│   │   │   │   ├── MobileRecordCard.vue        # Single mobile card
│   │   │   │   ├── MobileRecordList.vue        # Card list container
│   │   │   │   └── MobilePagination.vue        # Mobile pagination
│   │   │   │
│   │   │   ├── desktop/
│   │   │   │   ├── DesktopTableHeader.vue      # Table header
│   │   │   │   ├── DesktopTableRow.vue         # Single table row
│   │   │   │   ├── DesktopTable.vue            # Table container
│   │   │   │   └── DesktopPagination.vue       # Desktop pagination
│   │   │   │
│   │   │   ├── forms/
│   │   │   │   ├── ServiceForm.vue             # Main form container
│   │   │   │   ├── ServiceFormStep1.vue        # Basic info step
│   │   │   │   ├── ServiceFormStep2.vue        # Jobs & parts step
│   │   │   │   ├── ServiceFormStep3.vue        # Review step
│   │   │   │   ├── JobSelector.vue             # Job selection component
│   │   │   │   ├── PartConditionSelector.vue   # Part condition selector
│   │   │   │   └── StepIndicator.vue           # Form step indicator
│   │   │   │
│   │   │   ├── modals/
│   │   │   │   ├── ViewDetailsModal.vue        # View record modal
│   │   │   │   ├── DeleteConfirmDialog.vue     # Delete confirmation
│   │   │   │   └── ServiceHistoryModal.vue     # Job history modal
│   │   │   │
│   │   │   └── widgets/
│   │   │       ├── PartConditionBadge.vue      # Part condition badge
│   │   │       ├── JobHistoryBadge.vue         # "X Records" badge
│   │   │       ├── RecordActionsMenu.vue       # Edit/Delete dropdown
│   │   │       ├── JobsSummary.vue             # Jobs done summary
│   │   │       ├── MonthFilter.vue             # Month dropdown
│   │   │       ├── YearFilter.vue              # Year dropdown
│   │   │       └── ClearFiltersButton.vue      # Clear filters button
│   │   │
│   │   ├── customers/
│   │   │   ├── CustomerCard.vue                # Customer card display
│   │   │   ├── CustomerList.vue                # Customer list
│   │   │   ├── CustomerForm.vue                # Customer form
│   │   │   ├── CustomerDetails.vue             # Customer details view
│   │   │   └── CustomerSearch.vue              # Customer search
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardStats.vue              # Stats cards
│   │   │   ├── RevenueChart.vue                # Revenue chart
│   │   │   ├── RecentActivity.vue              # Recent activity widget
│   │   │   ├── QuickActions.vue                # Quick action buttons
│   │   │   └── ServiceHistory.vue              # Recent service history
│   │   │
│   │   ├── reports/
│   │   │   ├── ReportFilters.vue               # Report filters
│   │   │   ├── ReportChart.vue                 # Chart display
│   │   │   ├── ReportTable.vue                 # Report table
│   │   │   └── ExportButton.vue                # Export functionality
│   │   │
│   │   └── accounts/
│   │       ├── AccountSettings.vue             # Account settings
│   │       ├── UserProfile.vue                 # User profile
│   │       ├── SecuritySettings.vue            # Security settings
│   │       └── ThemeSelector.vue               # Theme toggle
│   │
│   ├── layout/
│   │   ├── AppLayout.vue                       # Main app layout
│   │   ├── DashboardLayout.vue                 # Dashboard-specific layout
│   │   └── AuthLayout.vue                      # Auth pages layout
│   │
│   ├── skeletons/
│   │   ├── MobileCardSkeleton.vue              # Mobile card loading
│   │   ├── DesktopTableSkeleton.vue            # Desktop table loading
│   │   ├── DashboardSkeleton.vue               # Dashboard loading
│   │   ├── FormSkeleton.vue                    # Form loading
│   │   └── HeaderSkeleton.vue                  # Header loading
│   │
│   └── ui/                                     # shadcn/ui components (keep as-is)
│       ├── alert-dialog/
│       ├── button/
│       ├── pagination/
│       └── ...
│
├── composables/                                # Reusable Vue logic
│   ├── useSearch.js                            # Search functionality
│   ├── useFilters.js                           # Filter logic
│   ├── usePagination.js                        # Pagination logic
│   ├── useDebounce.js                          # Debounce utility
│   ├── useModal.js                             # Modal state management
│   ├── useToast.js                             # Toast notifications
│   ├── useClickOutside.js                      # Click outside detection
│   ├── useSalesRecords.js                      # Sales records CRUD
│   ├── useCustomers.js                         # Customer management
│   ├── useFormValidation.js                    # Form validation
│   └── useLocalStorage.js                      # Local storage helper
│
├── stores/                                     # Pinia stores
│   ├── useSalesStore.js                        # Sales state
│   ├── useCustomerStore.js                     # Customer state
│   ├── useAuthStore.js                         # Auth state
│   └── useUIStore.js                           # UI state (theme, sidebar, etc.)
│
├── services/                                   # API services
│   ├── api.js                                  # Axios/fetch config
│   ├── salesService.js                         # Sales API calls
│   ├── customerService.js                      # Customer API calls
│   ├── reportService.js                        # Report API calls
│   └── authService.js                          # Auth API calls
│
├── utils/                                      # Utility functions
│   ├── formatters.js                           # Date, currency, text formatters
│   ├── validators.js                           # Validation helpers
│   ├── constants.js                            # App constants
│   ├── helpers.js                              # General helpers
│   └── cn.js                                   # Tailwind class merger
│
├── data/                                       # Static/mock data
│   ├── mockData.js                             # Mock database
│   ├── jobLabels.js                            # Job label mappings
│   └── months.js                               # Month data
│
├── styles/                                     # Global styles
│   ├── main.css                                # Main stylesheet
│   ├── variables.css                           # CSS variables
│   └── utilities.css                           # Utility classes
│
├── views/                                      # Page components (thin!)
│   ├── Dashboard.vue                           # Dashboard page
│   ├── SalesRecordList.vue                     # Sales list page
│   ├── Reports.vue                             # Reports page
│   ├── Accounts.vue                            # Accounts page
│   └── NotFound.vue                            # 404 page
│
├── router/
│   └── index.js                                # Router config
│
├── App.vue                                     # Root component
└── main.js                                     # Entry point
```

---

## 📋 **Detailed Component Breakdown**

### **Sales Feature - Complete Component List**

#### **1. Page-Level (View)**

- **`SalesRecordList.vue`** (~150 lines)
  - Orchestrates all sales components
  - Handles route params
  - Minimal logic, mostly composition

#### **2. Layout Components**

- **`SalesHeader.vue`** (~50 lines)
  - Title + result count
  - Add Record button
  - Emits: `@add-record`

- **`SalesSearchBar.vue`** (~40 lines)
  - Search input with icon
  - Debounced search
  - Props: `modelValue`
  - Emits: `@update:modelValue`

- **`SalesFilters.vue`** (~100 lines)
  - Contains MonthFilter, YearFilter, ClearFiltersButton
  - Props: `selectedMonth`, `selectedYear`, `months`, `availableYears`
  - Emits: `@update:selectedMonth`, `@update:selectedYear`, `@clear-filters`

#### **3. Mobile Components**

- **`MobileRecordCard.vue`** (~120 lines)
  - Single card with all record info
  - Loading overlay
  - Click hint icon
  - Menu button
  - Props: `service`, `openMenuId`
  - Emits: `@click`, `@toggle-menu`, `@edit`, `@delete`

- **`MobileRecordList.vue`** (~80 lines)
  - Scrollable container
  - Maps cards
  - Handles pagination
  - Props: `services`, `totalPages`, `currentPage`
  - Emits: `@update:currentPage`, `@view-record`

- **`MobilePagination.vue`** (~60 lines)
  - Pagination controls
  - Results info
  - Props: `totalResults`, `currentPage`, `itemsPerPage`

#### **4. Desktop Components**

- **`DesktopTableHeader.vue`** (~30 lines)
  - Sticky header
  - Column titles
  - Static component

- **`DesktopTableRow.vue`** (~100 lines)
  - Single table row
  - Hover effects
  - Loading overlay
  - Actions menu
  - Props: `service`, `openMenuId`
  - Emits: `@click`, `@toggle-menu`, `@edit`, `@delete`

- **`DesktopTable.vue`** (~80 lines)
  - Table container
  - Header + scrollable body
  - Props: `services`
  - Emits: `@view-record`, `@edit-record`, `@delete-record`

- **`DesktopPagination.vue`** (~60 lines)
  - Desktop pagination
  - Same as mobile but different styling

#### **5. Form Components**

- **`ServiceForm.vue`** (~150 lines)
  - Form container
  - Step management
  - Progress indicator
  - Props: `service`, `show`, `existingRecords`
  - Emits: `@close`, `@save`

- **`ServiceFormStep1.vue`** (~120 lines)
  - Basic info: customer, phone, car, plate, date
  - Props: `modelValue`
  - Emits: `@update:modelValue`

- **`ServiceFormStep2.vue`** (~150 lines)
  - Jobs selection
  - Part conditions
  - Cost calculation
  - Props: `modelValue`
  - Emits: `@update:modelValue`

- **`ServiceFormStep3.vue`** (~80 lines)
  - Review all data
  - Summary display
  - Props: `formData`

- **`JobSelector.vue`** (~100 lines)
  - Checkbox grid for jobs
  - Props: `selectedJobs`
  - Emits: `@update:selectedJobs`

- **`PartConditionSelector.vue`** (~80 lines)
  - Radio buttons for part condition
  - Props: `job`, `condition`
  - Emits: `@update:condition`

- **`StepIndicator.vue`** (~50 lines)
  - Visual step progress
  - Props: `currentStep`, `totalSteps`

#### **6. Modal Components**

- **`ViewDetailsModal.vue`** (~200 lines)
  - Full record details
  - Job history
  - Edit button
  - Props: `service`, `show`, `allServices`
  - Emits: `@close`, `@edit`, `@view-job`

- **`DeleteConfirmDialog.vue`** (~40 lines)
  - Confirmation dialog
  - Props: `show`, `recordId`
  - Emits: `@confirm`, `@cancel`

- **`ServiceHistoryModal.vue`** (~100 lines)
  - Shows all jobs for a plate number
  - Props: `plateNumber`, `services`
  - Emits: `@view-job`, `@close`

#### **7. Widget Components**

- **`PartConditionBadge.vue`** (~30 lines)
  - Color-coded badge
  - Props: `condition` (Brand New, Surplus, Owner's Part)

- **`JobHistoryBadge.vue`** (~25 lines)
  - "X Records" badge
  - Props: `count`

- **`RecordActionsMenu.vue`** (~50 lines)
  - Edit/Delete dropdown
  - Props: `isOpen`, `recordId`
  - Emits: `@edit`, `@delete`, `@close`

- **`JobsSummary.vue`** (~40 lines)
  - Display jobs done with truncation
  - Props: `jobs`, `maxVisible`

- **`MonthFilter.vue`** (~60 lines)
  - Month dropdown
  - Props: `selectedMonth`, `months`
  - Emits: `@update:selectedMonth`

- **`YearFilter.vue`** (~60 lines)
  - Year dropdown
  - Props: `selectedYear`, `availableYears`
  - Emits: `@update:selectedYear`

- **`ClearFiltersButton.vue`** (~20 lines)
  - Clear filters button
  - Props: `show` (v-if logic)
  - Emits: `@clear`

---

## 🔧 **Composables Breakdown**

### **`useSearch.js`**

```javascript
// Search with debouncing
export function useSearch(items, searchableFields) {
  const searchQuery = ref("");
  const debouncedQuery = ref("");

  const filteredItems = computed(() => {
    // Search logic
  });

  return { searchQuery, debouncedQuery, filteredItems };
}
```

### **`useFilters.js`**

```javascript
// Month/Year filtering
export function useFilters(items) {
  const selectedMonth = ref("");
  const selectedYear = ref("");

  const filteredItems = computed(() => {
    // Filter logic
  });

  const clearFilters = () => {
    selectedMonth.value = "";
    selectedYear.value = "";
  };

  return { selectedMonth, selectedYear, filteredItems, clearFilters };
}
```

### **`usePagination.js`**

```javascript
// Pagination logic
export function usePagination(items, itemsPerPage = 50) {
  const currentPage = ref(1);

  const totalPages = computed(() => {
    return Math.ceil(items.value.length / itemsPerPage);
  });

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return items.value.slice(start, start + itemsPerPage);
  });

  return { currentPage, totalPages, paginatedItems };
}
```

### **`useSalesRecords.js`**

```javascript
// Sales CRUD operations
export function useSalesRecords() {
  const records = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchRecords = async () => {
    /* ... */
  };
  const createRecord = async (data) => {
    /* ... */
  };
  const updateRecord = async (id, data) => {
    /* ... */
  };
  const deleteRecord = async (id) => {
    /* ... */
  };

  return {
    records,
    loading,
    error,
    fetchRecords,
    createRecord,
    updateRecord,
    deleteRecord,
  };
}
```

---

## 📦 **Migration Roadmap**

### **Phase 1: Setup (Week 1)**

1. ✅ Create folder structure (DONE)
2. Create utility files (`formatters.js`, `constants.js`)
3. Extract job labels to `data/jobLabels.js`
4. Move mock data to proper location

### **Phase 2: Extract Composables (Week 1-2)**

1. Create `useSearch.js`
2. Create `useFilters.js`
3. Create `usePagination.js`
4. Create `useDebounce.js`
5. Create `useModal.js`

### **Phase 3: Common Components (Week 2)**

1. Extract `SearchBar.vue`
2. Extract `EmptyState.vue`
3. Extract `ErrorMessage.vue`
4. Extract `LoadingSpinner.vue`
5. Move `ToastNotification.vue` to `common/feedback/`

### **Phase 4: Sales Widgets (Week 2-3)**

1. Create `PartConditionBadge.vue`
2. Create `JobHistoryBadge.vue`
3. Create `RecordActionsMenu.vue`
4. Create `JobsSummary.vue`
5. Create `MonthFilter.vue`
6. Create `YearFilter.vue`

### **Phase 5: Sales Layout (Week 3)**

1. Create `SalesHeader.vue`
2. Create `SalesFilters.vue` (compose filters)
3. Create `DesktopTableHeader.vue`

### **Phase 6: Sales Cards/Rows (Week 3-4)**

1. Create `MobileRecordCard.vue`
2. Create `DesktopTableRow.vue`
3. Create `MobileRecordList.vue`
4. Create `DesktopTable.vue`

### **Phase 7: Forms (Week 4-5)**

1. Break down `ServiceForm.vue` into steps
2. Create `ServiceFormStep1.vue`
3. Create `ServiceFormStep2.vue`
4. Create `ServiceFormStep3.vue`
5. Create `JobSelector.vue`
6. Create `PartConditionSelector.vue`

### **Phase 8: Modals (Week 5)**

1. Refactor `ViewDetailsModal.vue`
2. Create `DeleteConfirmDialog.vue`
3. Create `ServiceHistoryModal.vue`

### **Phase 9: Skeletons (Week 5)**

1. Create `MobileCardSkeleton.vue`
2. Create `DesktopTableSkeleton.vue`

### **Phase 10: Refactor View (Week 6)**

1. Slim down `SalesRecordList.vue` to <200 lines
2. Use all extracted components
3. Test everything

### **Phase 11: Other Features (Week 6+)**

1. Apply same patterns to Dashboard
2. Apply to Reports
3. Apply to Accounts
4. Apply to Customers

---

## ✅ **Success Metrics**

After refactoring, you should have:

- ✅ No component over 200 lines
- ✅ Clear separation of concerns
- ✅ Reusable components across features
- ✅ Easy to test individual components
- ✅ Fast to add new features
- ✅ Easy for new developers to understand

---

## 🎯 **Key Differences from Option 1**

| Aspect              | Option 1 (Hybrid) | Option 2 (Full)      |
| ------------------- | ----------------- | -------------------- |
| **Depth**           | Shallow nesting   | Deep feature folders |
| **Granularity**     | Larger components | Micro-components     |
| **Composables**     | Basic (2-3)       | Comprehensive (10+)  |
| **Time Investment** | 1-2 weeks         | 4-6 weeks            |
| **Scalability**     | Good              | Excellent            |
| **Learning Curve**  | Low               | Medium               |
| **Best For**        | Solo dev, MVP     | Team, long-term      |
