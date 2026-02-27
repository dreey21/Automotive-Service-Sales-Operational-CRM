<template>
  <div v-if="show">
    <!-- Backdrop -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showBackdrop"
        class="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-40 transition-[left] duration-300 ease-in-out"
        :class="isSidebarCollapsed ? 'md:left-20' : 'md:left-64'"
        @click="close"
      />
    </transition>

    <!-- Main Modal Panel -->
    <div
      class="fixed inset-0 z-50 flex flex-col transition-[left] duration-300 ease-in-out bg-brand-offwhite"
      :class="isSidebarCollapsed ? 'md:left-20' : 'md:left-64'"
    >
      <!-- Header Bar — matches content bg -->
      <div class="bg-brand-offwhite px-4 py-3.5 flex items-center gap-3 border-b border-brand-sky flex-shrink-0">
        <button
          @click="close"
          class="p-2 -ml-1.5 text-brand-ice hover:bg-brand-sky rounded-lg transition-colors flex-shrink-0"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h1
          class="flex-1 text-lg font-extrabold text-brand-navy tracking-tight uppercase"
          style="font-family: 'Barlow Condensed', sans-serif; letter-spacing: 0.05em;"
        >
          Service Details
        </h1>

        <button
          @click="handleEdit"
          class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold text-sm shadow-sm active:scale-[0.97] transition-transform flex-shrink-0"
          style="border-radius: 6px;"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
      </div>

      <!-- Recent Service History strip -->
      <RecentServiceHistory
        v-if="currentService.plate_number && jobHistory.length > 1"
        :jobs="jobHistory"
        :current-job-id="currentService.id"
        @select-job="viewJob"
        @view-all="showFullHistory = true"
      />

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto hide-scrollbar">

        <!-- ─── MOBILE LAYOUT ─────────────────────────────────── -->
        <div class="md:hidden p-4 space-y-5 pb-24">

          <!-- Plate + Warranty -->
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-0.5">Plate Number</p>
              <p class="text-2xl font-extrabold text-brand-navy tracking-tight" style="font-family: 'Barlow Condensed', sans-serif;">
                {{ currentService.plate_number || 'Walk-in' }}
              </p>
            </div>
            <span
              v-if="warrantyStatus"
              :class="[
                'px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-md flex-shrink-0',
                warrantyStatus === 'active'
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : 'bg-red-100 text-red-600 border border-red-300'
              ]"
            >
              {{ warrantyStatus === 'active' ? '✓ In Warranty' : '✗ Expired' }}
            </span>
          </div>

          <!-- Stat pills: Invoice / Date / Cost -->
          <div class="grid grid-cols-3 gap-2">
            <div v-if="currentService.invoice" class="bg-white border border-brand-sky rounded-xl p-3 shadow-sm">
              <p class="text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-1">Invoice</p>
              <p class="text-sm font-bold text-brand-navy">#{{ currentService.invoice }}</p>
            </div>
            <div class="bg-white border border-brand-sky rounded-xl p-3 shadow-sm">
              <p class="text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-1">Date</p>
              <p class="text-sm font-bold text-brand-navy">{{ formatDate(currentService.service_date) }}</p>
            </div>
            <div class="bg-white border border-brand-sky rounded-xl p-3 shadow-sm">
              <p class="text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-1">Cost</p>
              <p class="text-sm font-bold text-green-600 tabular-nums">₱{{ currentService.cost?.toFixed(2) || '0.00' }}</p>
            </div>
          </div>

          <div class="border-t border-brand-sky" />

          <!-- Jobs Done -->
          <div>
            <p class="text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-3">Jobs Done</p>
            <div v-if="currentService.jobs_done?.length" class="divide-y divide-brand-sky border border-brand-sky rounded-xl overflow-hidden bg-white shadow-sm">
              <div
                v-for="job in currentService.jobs_done"
                :key="job"
                class="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-brand-navy">{{ getJobLabel(job) }}</p>
                  <div v-if="getJobPartDetails(job)" class="flex flex-wrap gap-1.5 mt-1">
                    <span
                      v-if="getJobPartDetails(job).condition"
                      :class="[
                        'text-[10px] px-2 py-0.5 rounded font-semibold',
                        getJobPartDetails(job).condition === 'brand_new'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      ]"
                    >
                      {{ getJobPartDetails(job).condition === 'brand_new' ? 'Brand New' : 'Surplus' }}
                    </span>
                    <span
                      v-if="getJobPartDetails(job).isOwnerPart"
                      class="text-[10px] px-2 py-0.5 rounded font-semibold bg-brand-sky text-brand-navy"
                    >
                      Owner's Part
                    </span>
                  </div>
                </div>
                <svg class="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div v-else class="p-4 text-center text-sm text-brand-ice bg-white border border-brand-sky rounded-xl">
              No jobs recorded
            </div>
          </div>

          <!-- Notes -->
          <div v-if="currentService.description">
            <p class="text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-2">Service Notes</p>
            <div class="p-3.5 bg-white border border-brand-sky rounded-xl shadow-sm">
              <p class="text-sm text-brand-navy leading-relaxed whitespace-pre-wrap">{{ currentService.description }}</p>
            </div>
          </div>

          <div class="border-t border-brand-sky" />

          <!-- Customer -->
          <div>
            <p class="text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-2">Customer</p>
            <div class="bg-white border border-brand-sky rounded-xl p-4 shadow-sm space-y-2">
              <div>
                <p class="text-[10px] text-brand-ice mb-0.5">Name</p>
                <p class="text-sm font-semibold text-brand-navy">{{ currentService.customer_name || 'Walk-in Customer' }}</p>
              </div>
              <div v-if="currentService.phone">
                <p class="text-[10px] text-brand-ice mb-0.5">Phone</p>
                <p class="text-sm font-semibold text-brand-navy">{{ currentService.phone }}</p>
              </div>
            </div>
          </div>

          <!-- Vehicle -->
          <div v-if="currentService.car_model || currentService.car_year">
            <p class="text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-2">Vehicle</p>
            <div class="bg-white border border-brand-sky rounded-xl p-4 shadow-sm">
              <p class="text-[10px] text-brand-ice mb-0.5">Model & Year</p>
              <p class="text-sm font-semibold text-brand-navy">
                {{ currentService.car_model || 'N/A' }}
                <span v-if="currentService.car_year" class="font-normal text-brand-ice"> ({{ currentService.car_year }})</span>
              </p>
            </div>
          </div>

          <!-- Audit trail -->
          <div class="pt-2 space-y-1.5">
            <div v-if="currentService.created_at" class="flex items-center gap-1.5 text-xs text-brand-ice">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Created {{ formatDate(currentService.created_at) }}</span>
              <span v-if="currentService.updated_by" class="opacity-60">by {{ currentService.updated_by }}</span>
            </div>
            <div
              v-if="currentService.updated_at && currentService.updated_at !== currentService.created_at"
              class="flex items-center gap-1.5 text-xs text-brand-ice"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edited {{ formatDate(currentService.updated_at) }}</span>
              <span v-if="currentService.updated_by" class="opacity-60">by {{ currentService.updated_by }}</span>
            </div>
          </div>

          <div class="h-4" />
        </div>

        <!-- ─── DESKTOP LAYOUT ─────────────────────────────────── -->
        <div class="hidden md:block p-6 lg:p-8">

          <!-- Top identity row: Plate + Warranty + metadata chips -->
          <div class="flex items-start justify-between gap-6 mb-6 pb-6 border-b border-brand-sky">
            <!-- Left: plate + warranty -->
            <div>
              <p class="text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-1">Plate Number</p>
              <div class="flex items-center gap-3">
                <p class="text-4xl font-extrabold text-brand-navy tracking-tight" style="font-family: 'Barlow Condensed', sans-serif;">
                  {{ currentService.plate_number || 'Walk-in' }}
                </p>
                <span
                  v-if="warrantyStatus"
                  :class="[
                    'px-2.5 py-1 text-xs font-bold uppercase tracking-wide rounded-md',
                    warrantyStatus === 'active'
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                      : 'bg-red-100 text-red-600 border border-red-300'
                  ]"
                >
                  {{ warrantyStatus === 'active' ? '✓ In Warranty' : '✗ Out of Warranty' }}
                </span>
              </div>
            </div>

            <!-- Right: Invoice / Date / Cost chips -->
            <div class="flex items-stretch gap-3 flex-shrink-0">
              <div v-if="currentService.invoice" class="bg-white border border-brand-sky rounded-xl px-4 py-3 shadow-sm min-w-[100px]">
                <p class="text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-1">Invoice</p>
                <p class="text-base font-bold text-brand-navy">#{{ currentService.invoice }}</p>
              </div>
              <div class="bg-white border border-brand-sky rounded-xl px-4 py-3 shadow-sm min-w-[120px]">
                <p class="text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-1">Service Date</p>
                <p class="text-base font-bold text-brand-navy">{{ formatDate(currentService.service_date) }}</p>
              </div>
              <div class="bg-white border border-brand-sky rounded-xl px-4 py-3 shadow-sm min-w-[110px]">
                <p class="text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-1">Total Cost</p>
                <p class="text-base font-bold text-green-600 tabular-nums">₱{{ currentService.cost?.toFixed(2) || '0.00' }}</p>
              </div>
            </div>
          </div>

          <!-- Two-column content -->
          <div class="grid grid-cols-2 gap-8 items-start">

            <!-- LEFT: Jobs + Notes -->
            <div class="space-y-6">
              <!-- Jobs Done -->
              <div>
                <p class="text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-3">Jobs Done</p>
                <div v-if="currentService.jobs_done?.length" class="divide-y divide-brand-sky border border-brand-sky rounded-xl overflow-hidden bg-white shadow-sm">
                  <div
                    v-for="job in currentService.jobs_done"
                    :key="job"
                    class="flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-brand-sky/30 transition-colors"
                  >
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-brand-navy">{{ getJobLabel(job) }}</p>
                      <div v-if="getJobPartDetails(job)" class="flex flex-wrap gap-1.5 mt-1.5">
                        <span
                          v-if="getJobPartDetails(job).condition"
                          :class="[
                            'text-[10px] px-2 py-0.5 rounded font-semibold',
                            getJobPartDetails(job).condition === 'brand_new'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          ]"
                        >
                          {{ getJobPartDetails(job).condition === 'brand_new' ? 'Brand New' : 'Surplus' }}
                        </span>
                        <span
                          v-if="getJobPartDetails(job).isOwnerPart"
                          class="text-[10px] px-2 py-0.5 rounded font-semibold bg-brand-sky text-brand-navy"
                        >
                          Owner's Part
                        </span>
                      </div>
                    </div>
                    <svg class="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div v-else class="p-6 text-center text-sm text-brand-ice bg-white border border-brand-sky rounded-xl">
                  No jobs recorded
                </div>
              </div>

              <!-- Notes -->
              <div v-if="currentService.description">
                <p class="text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-3">Service Notes</p>
                <div class="p-4 bg-white border border-brand-sky rounded-xl shadow-sm">
                  <p class="text-sm text-brand-navy leading-relaxed whitespace-pre-wrap">{{ currentService.description }}</p>
                </div>
              </div>
            </div>

            <!-- RIGHT: Customer / Vehicle / Audit -->
            <div class="space-y-4">
              <!-- Customer -->
              <div>
                <p class="text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-3">Customer</p>
                <div class="bg-white border border-brand-sky rounded-xl shadow-sm overflow-hidden">
                  <div class="px-4 py-3 border-b border-brand-sky">
                    <p class="text-[10px] text-brand-ice mb-0.5">Name</p>
                    <p class="text-sm font-semibold text-brand-navy">{{ currentService.customer_name || 'Walk-in Customer' }}</p>
                  </div>
                  <div v-if="currentService.phone" class="px-4 py-3">
                    <p class="text-[10px] text-brand-ice mb-0.5">Phone</p>
                    <p class="text-sm font-semibold text-brand-navy">{{ currentService.phone }}</p>
                  </div>
                </div>
              </div>

              <!-- Vehicle -->
              <div v-if="currentService.car_model || currentService.car_year">
                <p class="text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-3">Vehicle</p>
                <div class="bg-white border border-brand-sky rounded-xl shadow-sm px-4 py-3 inline-block w-full">
                  <p class="text-[10px] text-brand-ice mb-0.5">Model & Year</p>
                  <p class="text-sm font-semibold text-brand-navy">
                    {{ currentService.car_model || 'N/A' }}
                    <span v-if="currentService.car_year" class="font-normal text-brand-ice"> ({{ currentService.car_year }})</span>
                  </p>
                </div>
              </div>

              <!-- Audit trail -->
              <div class="px-4 py-3 space-y-2 border border-brand-sky rounded-xl bg-white inline-block w-full">
                <div v-if="currentService.created_at" class="flex items-center gap-2 text-xs text-brand-ice">
                  <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Created {{ formatDate(currentService.created_at) }}</span>
                  <span v-if="currentService.updated_by" class="opacity-60">by {{ currentService.updated_by }}</span>
                </div>
                <div
                  v-if="currentService.updated_at && currentService.updated_at !== currentService.created_at"
                  class="flex items-center gap-2 text-xs text-brand-ice"
                >
                  <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edited {{ formatDate(currentService.updated_at) }}</span>
                  <span v-if="currentService.updated_by" class="opacity-60">by {{ currentService.updated_by }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Full History Slide-over -->
      <ServiceHistoryList
        v-if="showFullHistory"
        :jobs="jobHistory"
        :plate-number="currentService.plate_number"
        :current-job-id="currentService.id"
        :is-sidebar-collapsed="isSidebarCollapsed"
        @close="showFullHistory = false"
        @select-job="handleJobSelect"
      />

      <!-- Edit Form -->
      <ServiceForm
        :service="currentService"
        :show="showEditForm"
        :show-backdrop="true"
        :is-sidebar-collapsed="isSidebarCollapsed"
        @close="showEditForm = false"
        @save="handleSave"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import RecentServiceHistory from './RecentServiceHistory.vue'
import ServiceHistoryList from './ServiceHistoryList.vue'
import ServiceForm from './ServiceForm.vue'

const props = defineProps({
  service: { type: Object, required: true },
  allServices: { type: Array, default: () => [] },
  show: { type: Boolean, default: true },
  showBackdrop: { type: Boolean, default: true },
  isSidebarCollapsed: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'edit', 'viewJob'])

const showFullHistory = ref(false)
const showEditForm = ref(false)
const currentService = computed(() => props.service)

const jobLabels = {
  replace_evaporator_front: 'Replace Evaporator Front',
  replace_evaporator_rear: 'Replace Evaporator Rear',
  replace_condenser: 'Replace Condenser',
  replace_compressor: 'Replace Compressor',
  replace_blower_motor: 'Replace Blower Motor',
  replace_expansion_valve: 'Replace Expansion Valve',
  replace_pulley_assembly: 'Replace Pulley Assembly',
  replace_fan_motor: 'Replace Fan Motor',
  replace_suction_hose_assembly: 'Replace Suction Hose Assembly',
  replace_fan_belt: 'Replace Fan Belt',
  replace_filter_drier: 'Replace Filter Drier',
  replace_discharge_hose_suction: 'Replace Discharge Hose Suction',
  replace_ecv: 'Replace ECV',
  replace_oring: 'Replace O-ring',
  replace_radiator: 'Replace Radiator',
  replace_cabin_filter: 'Replace Cabin Filter',
  replace_magnetic: 'Replace Magnetic',
  pulldown_evaporator: 'Pulldown Evaporator',
  pulldown_condenser: 'Pulldown Condenser',
  pulldown_compressor: 'Pulldown Compressor',
  flushing_system: 'Flushing System',
  install_cabin_filter: 'Install Cabin Filter',
  cleaning: 'Cleaning',
  freon: 'Freon'
}

const jobHistory = computed(() => {
  if (!currentService.value.plate_number || !props.allServices.length) return []
  return props.allServices
    .filter(s => s.plate_number === currentService.value.plate_number)
    .sort((a, b) => new Date(b.service_date) - new Date(a.service_date))
})

const warrantyStatus = computed(() => {
  if (!currentService.value.service_date) return null
  const daysDiff = Math.floor((new Date() - new Date(currentService.value.service_date)) / (1000 * 60 * 60 * 24))
  return daysDiff <= 30 ? 'active' : 'expired'
})

function getJobLabel(jobKey) {
  return jobLabels[jobKey] || jobKey
}

function getJobPartDetails(jobKey) {
  const condition = currentService.value.part_condition?.[jobKey]
  const isOwnerPart = currentService.value.owner_parts?.[jobKey]
  if (!condition && !isOwnerPart) return null
  return { condition, isOwnerPart }
}

function close() { emit('close') }
function handleEdit() { showEditForm.value = true }
function handleSave(serviceData) { showEditForm.value = false; emit('edit', serviceData) }
function viewJob(job) { emit('viewJob', job) }
function handleJobSelect(job) { viewJob(job) }

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date)
  } catch { return 'Invalid Date' }
}
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>