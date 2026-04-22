<template>
  <div>
    <!-- Header Bar -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2
          class="text-xl md:text-2xl font-bold text-foreground tracking-tight"
        >
          Recent Transactions
        </h2>
        <p class="text-xs text-muted-foreground mt-0.5">
          <span v-if="hasActiveFilters">
            {{ filteredServices.length }} result{{
              filteredServices.length !== 1 ? "s" : ""
            }}
            found
          </span>
          <span v-else>
            {{ filteredServices.length }} total record{{
              filteredServices.length !== 1 ? "s" : ""
            }}
          </span>
        </p>
      </div>

      <!-- Primary Action -->
      <button
        @click="openAddModal"
        class="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-semibold text-sm shadow-sm active:scale-[0.97] transition-transform"
        style="border-radius: 6px"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="2.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span class="hidden sm:inline">Add Record</span>
        <span class="sm:hidden">Add</span>
      </button>
    </div>

    <!-- Search + Filter Toolbar -->
    <FilterToolbar
      :selectedMonth="selectedMonth"
      :selectedYear="selectedYear"
      :availableYears="availableYears"
      :hasActiveFilters="hasActiveFilters"
      v-model:searchQuery="searchQuery"
      @clear-filters="clearFilters"
      @select-month="selectMonth"
      @select-year="selectYear"
    />
    <!-- Error State -->
    <div
      v-if="error"
      class="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm"
      style="border-radius: 6px"
    >
      {{ error }}
    </div>

    <!-- ─── LOADING SKELETONS ─── -->
    <template v-if="initialLoading">
      <!-- Mobile skeleton -->
      <MobileCardSkeleton />

      <!-- Desktop skeleton -->
      <DesktopTableSkeleton />
    </template>

    <!-- EMPTY STATE -->
    <EmptyState
      v-else-if="paginatedServices.length === 0"
      :hasFilters="hasActiveFilters"
    />

    <!-- RECORDS: MOBILE CARDS + DESKTOP TABLE -->
    <template v-else>
      <!-- Mobile: Card List -->
      <MobileRecordList
        :paginatedServices="paginatedServices"
        v-model:currentPage="currentPage"
        :database="mockDatabase"
        :filteredServicesCount="filteredServices.length"
        :totalPages="totalPages"
        :ITEMS_PER_PAGE="ITEMS_PER_PAGE"
        @view="openViewModal"
        @edit="openEditModal"
        @delete="deleteService"
      />

      <DesktopTable
        :paginatedServices="paginatedServices"
        :currentPage="currentPage"
        :database="mockDatabase"
        @view="openViewModal"
        @edit="openEditModal"
        @delete="deleteService"
      />
    </template>

    <!-- Pagination Controls - Desktop -->
    <div
      v-if="totalPages > 1"
      class="hidden md:flex mt-4 flex-col sm:flex-row items-center justify-between gap-4"
    >
      <div class="text-sm font-medium text-muted-foreground tabular-nums">
        Showing {{ startIndex + 1 }}–{{
          Math.min(endIndex, filteredServices.length)
        }}
        of
        <span class="text-foreground font-semibold">{{
          filteredServices.length
        }}</span>
        results
      </div>
      <Pagination
        v-slot="{ page }"
        :total="filteredServices.length"
        :items-per-page="ITEMS_PER_PAGE"
        :sibling-count="1"
        :show-edges="true"
        v-model:page="currentPage"
      >
        <PaginationList v-slot="{ items }" class="flex items-center gap-1">
          <PaginationFirst
            class="border border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors"
            style="border-radius: 6px"
          />
          <PaginationPrev
            class="border border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors"
            style="border-radius: 6px"
          />
          <template v-for="(item, index) in items">
            <PaginationListItem
              v-if="item.type === 'page'"
              :key="index"
              :value="item.value"
              as-child
            >
              <Button
                class="w-9 h-9 p-0 border"
                style="border-radius: 6px"
                :variant="item.value === page ? 'default' : 'outline'"
              >
                {{ item.value }}
              </Button>
            </PaginationListItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>
          <PaginationNext
            class="border border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors"
            style="border-radius: 6px"
          />
          <PaginationLast
            class="border border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors"
            style="border-radius: 6px"
          />
        </PaginationList>
      </Pagination>
    </div>

    <!-- ─── MODALS ─── -->
    <ServiceForm
      :service="selectedService"
      :show="showModal"
      :show-backdrop="true"
      :existing-records="mockDatabase"
      :is-sidebar-collapsed="props.isSidebarCollapsed"
      @close="closeModal"
      @save="handleSave"
    />

    <!-- ViewDetailsModal — animation handled internally -->
    <ViewDetailsModal
      v-if="showViewModal"
      :service="viewService"
      :all-services="mockDatabase"
      :show="showViewModal"
      :is-sidebar-collapsed="props.isSidebarCollapsed"
      @close="closeViewModal"
      @edit="handleEditFromView"
      @view-job="viewJobFromHistory"
    />

    <ToastNotification
      :show="showToast"
      :message="toastMessage"
      :variant="toastVariant"
      :duration="3000"
      @close="closeToast"
    />

    <AlertDialog v-model:open="showDeleteDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this record?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the sales
            record from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="confirmDelete">
            Delete Record
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup>
import ServiceForm from "../components/ServiceForm.vue";
import ViewDetailsModal from "../components/ViewDetailsModal.vue";
import ToastNotification from "../components/ToastNotification.vue";
import EmptyState from "@/components/common/feedback/EmptyState.vue";
import MobileRecordList from "@/components/features/sales/mobile/MobileRecordList.vue";
import DesktopTable from "@/components/features/sales/desktop/DesktopTable.vue";
import MobileCardSkeleton from "@/components/skeletons/MobileCardSkeleton.vue";
import DesktopTableSkeleton from "@/components/skeletons/DesktopTableSkeleton.vue";
import FilterToolbar from "@/components/common/filtering/FilterToolbar.vue";
import { ref, computed, onMounted } from "vue";
import { useServiceFilter } from "@/composables/useServiceFilter";
import { useToast } from "@/composables/useToast";
import { useDeleteConfirmation } from "@/composables/useDeleteConfirmation";
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { mockDatabase } from "../data/mockData.js";

const props = defineProps({
  isSidebarCollapsed: {
    type: Boolean,
    default: false,
  },
});

// Filtered state & actions from useServiceFilter
const {
  selectedMonth,
  selectedYear,
  searchQuery,
  currentPage,
  filteredServices,
  selectMonth,
  selectYear,
  availableYears,
  hasActiveFilters,
  clearFilters,
  clearCache,
} = useServiceFilter(mockDatabase);

// ToastNotification states and functions from useToast
const {
  showToast,
  toastMessage,
  toastVariant,
  showToastNotification,
  closeToast,
} = useToast();

// Delete confirmation state and functions from useDeleteConfirmation
const { deleteService, confirmDelete, showDeleteDialog } =
  useDeleteConfirmation(mockDatabase, clearCache, showToastNotification);

const ITEMS_PER_PAGE = 50;
const initialLoading = ref(true);
const showModal = ref(false);
const showViewModal = ref(false);
const selectedService = ref(null);
const viewService = ref(null);
const error = ref(null);

const totalPages = computed(() =>
  Math.ceil(filteredServices.value.length / ITEMS_PER_PAGE),
);
const startIndex = computed(() => (currentPage.value - 1) * ITEMS_PER_PAGE);
const endIndex = computed(() => startIndex.value + ITEMS_PER_PAGE);
const paginatedServices = computed(() =>
  filteredServices.value.slice(startIndex.value, endIndex.value),
);

function viewJobFromHistory(job) {
  viewService.value = job;
}

onMounted(() => {
  initialLoading.value = true;
  setTimeout(() => {
    initialLoading.value = false;
  }, 300);
});

function openAddModal() {
  selectedService.value = null;
  showModal.value = true;
}

function openViewModal(service) {
  viewService.value = { ...service };
  showViewModal.value = true;
}

function closeViewModal() {
  showViewModal.value = false;
  viewService.value = null;
}

function openEditModal(service) {
  selectedService.value = { ...service };
  showModal.value = true;
  showViewModal.value = false;
}

function handleEditFromView(service) {
  const dbIndex = mockDatabase.findIndex((s) => s.id === service.id);
  if (dbIndex !== -1) mockDatabase[dbIndex] = { ...service };
  viewService.value = { ...service };
  showToastNotification("Record has been updated successfully", "success");
}

function closeModal() {
  showModal.value = false;
  setTimeout(() => {
    selectedService.value = null;
  }, 250);
}

async function handleSave(serviceData) {
  const isEditMode = !!serviceData.id;

  if (isEditMode) {
    const dbIndex = mockDatabase.findIndex((s) => s.id === serviceData.id);
    if (dbIndex !== -1) mockDatabase[dbIndex] = { ...serviceData };
    clearCache();
    showToastNotification("Record has been updated successfully", "success");
  } else {
    const newService = {
      ...serviceData,
      id: `temp-${Date.now()}`,
      loading: true,
      created_at: new Date().toISOString().split("T")[0],
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const newId = Math.max(...mockDatabase.map((s) => s.id), 0) + 1;
      const savedService = { ...newService, id: newId, loading: false };
      mockDatabase.unshift(savedService);
      clearCache();
      showToastNotification("New record created successfully", "success");
    } catch (err) {
      error.value = "Failed to save record. Please try again.";
      showToastNotification(
        "Failed to save record. Please try again.",
        "error",
      );
      console.error("Error saving service:", err);
    }
  }

  closeModal();
}
</script>