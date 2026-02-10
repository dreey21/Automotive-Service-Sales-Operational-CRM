# Refactor CRM to Industry-Standard Component Architecture

## Goal

Transform the automotive CRM into a production-ready, component-based architecture following Vue.js industry best practices to demonstrate professional-level skills for job applications.

## Phase 1: Foundation Setup

- [/] Create utility files and constants
- [/] Extract job labels to separate file
- [/] Create formatters utility
- [/] Create validators utility
- [/] Set up constants file

## Phase 2: Core Composables

- [ ] Create `useSearch.js` composable
- [ ] Create `useFilters.js` composable
- [ ] Create `usePagination.js` composable
- [/] Create `useDebounce.js` composable
- [ ] Create `useModal.js` composable
- [ ] Create `useToast.js` composable

## Phase 3: Common Components

- [/] Extract `SearchBar.vue` component
- [/] Extract `EmptyState.vue` component
- [ ] Extract `ErrorMessage.vue` component
- [ ] Create `LoadingSpinner.vue` component
- [ ] Move `ToastNotification.vue` to common/feedback

## Phase 4: Sales Widgets (Small Components)

- [/] Create `PartConditionBadge.vue`
- [ ] Create `JobHistoryBadge.vue`
- [ ] Create `RecordActionsMenu.vue`
- [ ] Create `JobsSummary.vue`
- [ ] Create `MonthFilter.vue`
- [ ] Create `YearFilter.vue`
- [ ] Create `ClearFiltersButton.vue`

## Phase 5: Sales Layout Components

- [ ] Create `SalesHeader.vue`
- [ ] Create `SalesFilters.vue`
- [ ] Create `DesktopTableHeader.vue`

## Phase 6: Sales Data Display

- [ ] Create `MobileRecordCard.vue`
- [ ] Create `DesktopTableRow.vue`
- [ ] Create `MobileRecordList.vue`
- [ ] Create `DesktopTable.vue`

## Phase 7: Loading States

- [ ] Create `MobileCardSkeleton.vue`
- [ ] Create `DesktopTableSkeleton.vue`

## Phase 8: Refactor Main View

- [ ] Refactor `SalesRecordList.vue` to use new components
- [ ] Reduce to <200 lines
- [ ] Test all functionality

## Phase 9: Forms (If Time Permits)

- [ ] Break down `ServiceForm.vue` into steps
- [ ] Create form step components
- [ ] Create `JobSelector.vue`
- [ ] Create `PartConditionSelector.vue`

## Phase 10: Documentation & Polish

- [ ] Add JSDoc comments to composables
- [ ] Add prop documentation to components
- [ ] Create README for component structure
- [ ] Test on mobile and desktop
