# 📁 Component-Based Folder Structure Guide

## 🎯 Overview

This guide provides a comprehensive folder structure for refactoring your Automotive Service Sales CRM into a clean, scalable, 100% component-based Vue.js architecture.

---

## 📂 Recommended Folder Structure

```
src/
├── assets/                          # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── components/                      # All reusable components
│   ├── common/                      # Shared/common components
│   │   ├── buttons/
│   │   │   ├── PrimaryButton.vue
│   │   │   ├── SecondaryButton.vue
│   │   │   └── IconButton.vue
│   │   │
│   │   ├── inputs/
│   │   │   ├── SearchBar.vue
│   │   │   ├── TextInput.vue
│   │   │   ├── DatePicker.vue
│   │   │   └── NumberInput.vue
│   │   │
│   │   ├── feedback/
│   │   │   ├── ToastNotification.vue
│   │   │   ├── ErrorMessage.vue
│   │   │   ├── LoadingSpinner.vue
│   │   │   └── EmptyState.vue
│   │   │
│   │   ├── navigation/
│   │   │   ├── AppHeader.vue
│   │   │   ├── SidebarNavigation.vue
│   │   │   └── BottomNavigation.vue
│   │   │
│   │   └── overlays/
│   │       ├── Modal.vue
│   │       ├── Drawer.vue
│   │       └── BottomSheet.vue
│   │
│   ├── features/                    # Feature-specific components
│   │   ├── sales/
│   │   │   ├── SalesRecordCard.vue
│   │   │   ├── SalesRecordTable.vue
│   │   │   ├── SalesRecordRow.vue
│   │   │   ├── SalesFilters.vue
│   │   │   ├── SalesHeader.vue
│   │   │   ├── SalesPagination.vue
│   │   │   ├── forms/
│   │   │   │   ├── ServiceForm.vue
│   │   │   │   ├── ServiceFormStep1.vue
│   │   │   │   ├── ServiceFormStep2.vue
│   │   │   │   └── ServiceFormStep3.vue
│   │   │   ├── modals/
│   │   │   │   ├── ViewDetailsModal.vue
│   │   │   │   └── DeleteConfirmationDialog.vue
│   │   │   └── widgets/
│   │   │       ├── PartConditionBadge.vue
│   │   │       ├── JobHistoryBadge.vue
│   │   │       ├── RecordActionsMenu.vue
│   │   │       └── JobsSummary.vue
│   │   │
│   │   ├── customers/
│   │   │   ├── CustomerCard.vue
│   │   │   ├── CustomerList.vue
│   │   │   ├── CustomerForm.vue
│   │   │   └── CustomerDetails.vue
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardStats.vue
│   │   │   ├── RevenueChart.vue
│   │   │   ├── RecentActivity.vue
│   │   │   └── QuickActions.vue
│   │   │
│   │   ├── reports/
│   │   │   ├── ReportFilters.vue
│   │   │   ├── ReportChart.vue
│   │   │   └── ReportTable.vue
│   │   │
│   │   └── accounts/
│   │       ├── AccountSettings.vue
│   │       ├── UserProfile.vue
│   │       └── SecuritySettings.vue
│   │
│   ├── layout/                      # Layout components
│   │   ├── AppLayout.vue
│   │   ├── DashboardLayout.vue
│   │   ├── AuthLayout.vue
│   │   └── MobileLayout.vue
│   │
│   ├── ui/                          # UI library components (shadcn/ui)
│   │   ├── alert-dialog/
│   │   ├── button/
│   │   ├── pagination/
│   │   ├── dropdown/
│   │   ├── select/
│   │   ├── checkbox/
│   │   ├── radio/
│   │   └── ...
│   │
│   └── skeletons/                   # Loading skeleton components
│       ├── MobileCardSkeleton.vue
│       ├── DesktopTableSkeleton.vue
│       ├── DashboardSkeleton.vue
│       └── FormSkeleton.vue
│
├── composables/                     # Vue composables (reusable logic)
│   ├── useSearch.js
│   ├── useFilters.js
│   ├── usePagination.js
│   ├── useDebounce.js
│   ├── useModal.js
│   ├── useToast.js
│   ├── useClickOutside.js
│   ├── useSalesRecords.js
│   ├── useCustomers.js
│   └── useAuth.js
│
├── views/                           # Page-level components (route views)
│   ├── Dashboard.vue
│   ├── SalesRecordList.vue
│   ├── Reports.vue
│   ├── Accounts.vue
│   ├── CustomerManagement.vue
│   └── NotFound.vue
│
├── router/                          # Vue Router configuration
│   ├── index.js
│   └── routes.js
│
├── stores/                          # State management (Pinia recommended)
│   ├── useSalesStore.js
│   ├── useCustomerStore.js
│   ├── useAuthStore.js
│   └── useUIStore.js
│
├── services/                        # API services
│   ├── api.js                       # Base API configuration
│   ├── salesService.js
│   ├── customerService.js
│   ├── reportService.js
│   └── authService.js
│
├── utils/                           # Utility functions
│   ├── formatters.js                # Date, currency, text formatters
│   ├── validators.js                # Form validation helpers
│   ├── constants.js                 # App-wide constants
│   ├── helpers.js                   # General helper functions
│   └── cn.js                        # Class name utility (for Tailwind)
│
├── lib/                             # Third-party library configurations
│   └── utils.js
│
├── data/                            # Static data / mock data
│   ├── mockData.js
│   ├── jobLabels.js
│   └── constants.js
│
├── types/                           # TypeScript types (if using TS)
│   ├── sales.ts
│   ├── customer.ts
│   └── common.ts
│
├── styles/                          # Global styles
│   ├── main.css                     # Main stylesheet
│   ├── variables.css                # CSS variables
│   ├── utilities.css                # Utility classes
│   └── animations.css               # Custom animations
│
├── App.vue                          # Root component
└── main.js                          # Application entry point
```

---

## 📋 Component Organization Principles

### **1. Common Components** (`components/common/`)

- **Purpose**: Highly reusable, generic components
- **Examples**: Buttons, inputs, modals, notifications
- **Rule**: Should NOT contain business logic
- **Usage**: Can be used across multiple features

### **2. Feature Components** (`components/features/`)

- **Purpose**: Feature-specific, domain-driven components
- **Examples**: SalesRecordCard, CustomerForm, DashboardStats
- **Rule**: Can contain business logic specific to that feature
- **Organization**: Group by feature domain (sales, customers, reports)

### **3. Layout Components** (`components/layout/`)

- **Purpose**: Page structure and layout wrappers
- **Examples**: AppLayout, DashboardLayout, AuthLayout
- **Rule**: Handle overall page structure, not content

### **4. UI Components** (`components/ui/`)

- **Purpose**: Design system components (shadcn/ui, etc.)
- **Examples**: alert-dialog, button, pagination
- **Rule**: Keep as-is from the library, minimal customization

### **5. Skeleton Components** (`components/skeletons/`)

- **Purpose**: Loading state representations
- **Examples**: MobileCardSkeleton, TableSkeleton
- **Rule**: Mirror the structure of actual components

---

## 🔧 Composables Organization

### **What Goes in Composables?**

- Reusable reactive logic
- State management logic
- Side effects (API calls, event listeners)
- Shared computed properties

### **Naming Convention**

- Always prefix with `use`: `useSearch`, `useFilters`, `usePagination`
- One composable per file
- Export as default or named export

### **Example Structure**

```javascript
// composables/useSearch.js
import { ref, computed } from "vue";

export function useSearch(items, searchableFields) {
  const searchQuery = ref("");
  const debouncedQuery = ref("");

  const filteredItems = computed(() => {
    // Search logic here
  });

  return {
    searchQuery,
    debouncedQuery,
    filteredItems,
  };
}
```

---

## 📦 Services Organization

### **Purpose**

- Centralize API calls
- Abstract HTTP logic from components
- Handle request/response transformation

### **Example Structure**

```javascript
// services/salesService.js
import api from "./api";

export const salesService = {
  async getAll() {
    const response = await api.get("/sales");
    return response.data;
  },

  async create(data) {
    const response = await api.post("/sales", data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/sales/${id}`, data);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/sales/${id}`);
  },
};
```

---

## 🎨 Utilities Organization

### **formatters.js**

```javascript
export const formatDate = (date) => {
  /* ... */
};
export const formatCurrency = (amount) => {
  /* ... */
};
export const formatPhoneNumber = (phone) => {
  /* ... */
};
```

### **validators.js**

```javascript
export const isValidEmail = (email) => {
  /* ... */
};
export const isValidPhone = (phone) => {
  /* ... */
};
export const isRequired = (value) => {
  /* ... */
};
```

### **constants.js**

```javascript
export const ITEMS_PER_PAGE = 50;
export const JOB_LABELS = {
  /* ... */
};
export const MONTHS = [
  /* ... */
];
```

---

## 🗂️ Feature-Based Organization Example

### **Sales Feature Structure**

```
components/features/sales/
├── SalesRecordCard.vue          # Mobile card view
├── SalesRecordTable.vue         # Desktop table container
├── SalesRecordRow.vue           # Desktop table row
├── SalesHeader.vue              # Header with title & add button
├── SalesFilters.vue             # Filter chips container
├── SalesPagination.vue          # Pagination wrapper
│
├── forms/
│   ├── ServiceForm.vue          # Main form container
│   ├── ServiceFormStep1.vue     # Step 1: Basic info
│   ├── ServiceFormStep2.vue     # Step 2: Jobs & parts
│   └── ServiceFormStep3.vue     # Step 3: Review
│
├── modals/
│   ├── ViewDetailsModal.vue     # View record details
│   └── DeleteConfirmDialog.vue  # Delete confirmation
│
└── widgets/
    ├── PartConditionBadge.vue   # Part condition badge
    ├── JobHistoryBadge.vue      # Job history indicator
    ├── RecordActionsMenu.vue    # Edit/Delete menu
    └── JobsSummary.vue          # Jobs summary display
```

---

## 🚀 Migration Strategy

### **Phase 1: Setup New Structure**

1. Create new folder structure
2. Move existing files to appropriate locations
3. Update import paths

### **Phase 2: Extract Common Components**

1. Start with smallest components (badges, buttons)
2. Extract input components (SearchBar, filters)
3. Extract feedback components (Toast, EmptyState)

### **Phase 3: Extract Feature Components**

1. Break down SalesRecordList.vue
2. Create mobile and desktop specific components
3. Extract form components

### **Phase 4: Create Composables**

1. Extract search logic → `useSearch`
2. Extract filter logic → `useFilters`
3. Extract pagination logic → `usePagination`

### **Phase 5: Refactor Other Views**

1. Apply same patterns to Dashboard, Reports, Accounts
2. Identify shared components
3. Move to common or create new features

---

## ✅ Best Practices

### **Component Naming**

- Use PascalCase: `SalesRecordCard.vue`
- Be descriptive: `MobileRecordCard.vue` not `Card.vue`
- Prefix feature-specific: `SalesHeader.vue` not `Header.vue`

### **File Organization**

- One component per file
- Keep components under 300 lines
- Co-locate related files (component + test + story)

### **Props & Events**

- Use descriptive prop names
- Emit events with kebab-case: `@update-record`
- Document props with PropTypes

### **Composables**

- Keep focused on single responsibility
- Return object with named properties
- Document usage with JSDoc comments

### **Imports**

- Use absolute imports with `@/` alias
- Group imports: Vue → libraries → components → utils
- Alphabetize within groups

---

## 🎯 Benefits of This Structure

✅ **Scalability**: Easy to add new features without cluttering existing code  
✅ **Maintainability**: Clear separation of concerns  
✅ **Reusability**: Components can be easily shared across features  
✅ **Testability**: Isolated components are easier to test  
✅ **Developer Experience**: Intuitive structure, easy to navigate  
✅ **Performance**: Smaller components enable better code-splitting  
✅ **Collaboration**: Team members can work on different features independently

---

## 📝 Next Steps

1. Review this structure and adjust to your needs
2. Create the folder structure in your project
3. Start with one feature (e.g., Sales) as a pilot
4. Gradually migrate other features
5. Update documentation as you go
