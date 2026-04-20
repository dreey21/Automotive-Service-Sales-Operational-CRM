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
    <div class="mb-4">
      <!-- Mobile: Search full width on its own row -->
      <div class="mb-2 md:hidden">
        <SearchBar
          v-model="searchQuery"
          placeholder="Search plate number, customer, invoice..."
        />
      </div>

      <!-- Filter row: desktop includes search inline, mobile just filters -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Search: desktop only, inline -->
        <div class="hidden md:block w-72">
          <SearchBar
            v-model="searchQuery"
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
      <div class="md:hidden h-[calc(100vh-380px)] pb-20 overflow-y-auto">
        <div class="space-y-2">
          <template v-for="i in 8" :key="`skel-card-${i}`">
            <!-- Cards with badge (indices 2, 4, 7 — mimics ~every 2-3 cards having a badge) -->
            <div
              v-if="[2, 4, 7].includes(i)"
              class="bg-card border border-border p-2.5 animate-pulse"
              style="border-radius: 6px"
            >
              <!-- Row 1: Plate + Date -->
              <div class="flex items-baseline justify-between mb-1">
                <div
                  class="h-[18px] bg-muted w-28"
                  style="border-radius: 3px"
                ></div>
                <div class="h-3 bg-muted w-20" style="border-radius: 3px"></div>
              </div>
              <!-- Row 2: Jobs done -->
              <div class="flex items-center gap-1.5 mb-1">
                <div
                  class="h-3.5 bg-muted w-3.5 flex-shrink-0"
                  style="border-radius: 3px"
                ></div>
                <div
                  class="h-3 bg-muted w-2/3"
                  style="border-radius: 3px"
                ></div>
              </div>
              <!-- Row 3: Badge row -->
              <div class="flex gap-1 mb-1">
                <div class="h-5 bg-muted w-16" style="border-radius: 4px"></div>
                <div
                  v-if="i === 4"
                  class="h-5 bg-muted w-20"
                  style="border-radius: 4px"
                ></div>
              </div>
              <!-- Row 4: Vehicle + Cost -->
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-1.5 flex-1 min-w-0">
                  <div
                    class="h-3.5 bg-muted w-3.5 flex-shrink-0"
                    style="border-radius: 3px"
                  ></div>
                  <div
                    class="h-3 bg-muted w-36"
                    style="border-radius: 3px"
                  ></div>
                </div>
                <div
                  class="h-5 bg-muted w-20 flex-shrink-0"
                  style="border-radius: 3px"
                ></div>
              </div>
            </div>

            <!-- Cards without badge (regular 3-row height) -->
            <div
              v-else
              class="bg-card border border-border p-2.5 animate-pulse"
              style="border-radius: 6px"
            >
              <!-- Row 1: Plate + Date -->
              <div class="flex items-baseline justify-between mb-1">
                <div
                  class="h-[18px] bg-muted w-24"
                  style="border-radius: 3px"
                ></div>
                <div class="h-3 bg-muted w-20" style="border-radius: 3px"></div>
              </div>
              <!-- Row 2: Jobs done -->
              <div class="flex items-center gap-1.5 mb-1">
                <div
                  class="h-3.5 bg-muted w-3.5 flex-shrink-0"
                  style="border-radius: 3px"
                ></div>
                <div
                  class="h-3 bg-muted"
                  :style="{
                    width: [1, 3, 6].includes(i) ? '45%' : '60%',
                    borderRadius: '3px',
                  }"
                ></div>
              </div>
              <!-- Row 3: Vehicle + Cost -->
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-1.5 flex-1 min-w-0">
                  <div
                    class="h-3.5 bg-muted w-3.5 flex-shrink-0"
                    style="border-radius: 3px"
                  ></div>
                  <div
                    class="h-3 bg-muted"
                    :style="{
                      width: [1, 5].includes(i) ? '7rem' : '9rem',
                      borderRadius: '3px',
                    }"
                  ></div>
                </div>
                <div
                  class="h-5 bg-muted w-16 flex-shrink-0"
                  style="border-radius: 3px"
                ></div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Desktop skeleton -->
      <div
        class="hidden md:block h-[calc(100vh-410px)] bg-card border border-border"
        style="border-radius: 6px"
      >
        <div class="border-b border-border bg-[var(--foreground)]">
          <table class="w-full border-collapse table-fixed">
            <colgroup>
              <col style="width: 200px" />
              <col style="width: 140px" />
              <col style="width: auto" />
              <col style="width: 140px" />
              <col style="width: 180px" />
              <col style="width: 140px" />
              <col style="width: 180px" />
              <col style="width: 48px" />
            </colgroup>
            <thead>
              <tr>
                <th
                  class="h-10 pl-10 pr-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
                >
                  Plate No.
                </th>
                <th
                  class="h-10 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  class="h-10 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
                >
                  Jobs Done
                </th>
                <th
                  class="h-10 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
                >
                  Phone
                </th>
                <th
                  class="h-10 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
                >
                  Part Details
                </th>
                <th
                  class="h-10 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
                >
                  Cost
                </th>
                <th
                  class="h-10 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
                >
                  Vehicle
                </th>
                <th class="h-10 w-[48px]"></th>
              </tr>
            </thead>
          </table>
        </div>

        <div class="overflow-y-auto" style="height: calc(100% - 40px)">
          <table class="w-full border-collapse table-fixed">
            <colgroup>
              <col style="width: 200px" />
              <col style="width: 140px" />
              <col style="width: auto" />
              <col style="width: 140px" />
              <col style="width: 180px" />
              <col style="width: 140px" />
              <col style="width: 180px" />
              <col style="width: 48px" />
            </colgroup>
            <tbody>
              <tr
                v-for="i in 10"
                :key="`skel-row-${i}`"
                class="border-b border-border animate-pulse"
              >
                <td class="px-4 py-2">
                  <div class="flex items-center gap-2">
                    <div class="w-4 h-4 flex-shrink-0"></div>
                    <div
                      class="h-3.5 bg-muted w-[70px]"
                      style="border-radius: 3px"
                    ></div>
                  </div>
                </td>
                <td class="px-4 py-2">
                  <div
                    class="h-3.5 bg-muted w-[80px]"
                    style="border-radius: 3px"
                  ></div>
                </td>
                <td class="px-4 py-2">
                  <div
                    class="h-3.5 bg-muted w-[120px]"
                    style="border-radius: 3px"
                  ></div>
                </td>
                <td class="px-4 py-2">
                  <div
                    class="h-3.5 bg-muted w-[100px]"
                    style="border-radius: 3px"
                  ></div>
                </td>
                <td class="px-4 py-2">
                  <div class="flex flex-wrap gap-1">
                    <div
                      class="h-5 bg-muted w-[70px]"
                      style="border-radius: 3px"
                    ></div>
                    <div
                      class="h-5 bg-muted w-[60px]"
                      style="border-radius: 3px"
                    ></div>
                  </div>
                </td>
                <td class="px-4 py-2">
                  <div
                    class="h-4 bg-muted w-[80px]"
                    style="border-radius: 3px"
                  ></div>
                </td>
                <td class="px-4 py-2">
                  <div
                    class="h-3.5 bg-muted w-[90px]"
                    style="border-radius: 3px"
                  ></div>
                </td>
                <td class="px-2 py-2">
                  <div class="p-1.5">
                    <div
                      class="h-[18px] bg-muted w-[18px] mx-auto"
                      style="border-radius: 3px"
                    ></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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
import SearchBar from "@/components/common/inputs/SearchBar.vue";
import EmptyState from "@/components/common/feedback/EmptyState.vue";
import MobileRecordList from "@/components/features/sales/mobile/MobileRecordList.vue";
import DesktopTable from "@/components/features/sales/desktop/DesktopTable.vue";
import { ref, computed, onMounted, onUnmounted} from "vue";
import {
  getMonthName,
  months,
} from "@/utils/formatters.js";
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
const monthDropdownRef = ref(null);
const yearDropdownRef = ref(null);
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
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
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
</script>
