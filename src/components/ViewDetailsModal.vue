<template>
  <div v-if="show">
    <!-- Backdrop (desktop only) -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="backdropVisible"
        class="hidden md:block fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-40 transition-[left] duration-300 ease-in-out"
        :class="isSidebarCollapsed ? 'md:left-20' : 'md:left-64'"
        @click="close"
      />
    </transition>

    <!-- Main Modal Panel -->
    <div
      class="fixed inset-0 z-50 flex flex-col transition-[left] duration-300 ease-in-out bg-[#eef2f6]"
      :class="[
        isSidebarCollapsed ? 'md:left-20' : 'md:left-64',
        isVisible ? 'modal-enter-to' : 'modal-enter-from modal-leave-to'
      ]"
    >
      <!-- ─── HEADER — split to match content columns ── -->
      <div
        class="flex-shrink-0 flex"
        style="position: relative; z-index: 1;"
      >
        <!-- Left: fills remaining space naturally -->
        <div class="bg-brand-navy px-4 py-3.5 flex items-center gap-3 flex-1">
          <button
            @click="close"
            class="p-2 -ml-1.5 text-brand-ice hover:bg-brand-sky rounded-lg transition-colors flex-shrink-0"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1
            class="flex-1 text-lg font-extrabold text-white tracking-tight uppercase"
            style="font-family: 'Barlow Condensed', sans-serif; letter-spacing: 0.05em;"
          >
            Service Details
          </h1>
          <button
            @click="handleEdit"
            class="p-2 -mr-1.5 text-white hover:bg-brand-sky rounded-lg transition-colors flex-shrink-0"
            title="Edit"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
        <!-- Right: fixed width matching the history sidebar -->
        <div
          v-if="jobHistory.length > 1"
          class="hidden md:flex bg-white px-4 py-3.5 items-center justify-between w-64 lg:w-72 flex-shrink-0 border-l border-brand-navy/15 border-b border-b-brand-sky"
          style="border-bottom: 1px solid white;"
        >
          <div class="flex items-center gap-2">
            <svg class="w-3.5 h-3.5 text-brand-ice" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-[10px] font-semibold text-brand-ice uppercase tracking-widest">Service History</p>
          </div>
          <span class="text-[10px] font-bold text-brand-navy bg-brand-sky px-1.5 py-0.5 rounded">{{ jobHistory.length }}</span>
        </div>
      </div>

      <!--
        Draggable floating FAB — mobile only.
        Rendered via Teleport to body inside the component,
        so it floats above everything including the modal.
      -->
      <div class="md:hidden">
        <RecentServiceHistory
          v-if="currentService.plate_number && jobHistory.length > 1"
          :jobs="jobHistory"
          :current-job-id="currentService.id"
          :plate-number="currentService.plate_number"
          :visible="isVisible && !showEditForm"
          @select-job="viewJob"
        />
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-hidden flex min-h-0">

        <!-- ─── MOBILE LAYOUT ─────────────────────────────────── -->
        <div class="md:hidden flex-1 overflow-y-auto hide-scrollbar p-4 space-y-5 pb-24">

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
              {{ warrantyStatus === 'active' ? 'In Warranty' : 'Out of Warranty' }}
            </span>
          </div>

          <!-- Stat pills -->
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
              <div v-for="job in currentService.jobs_done" :key="job" class="flex items-center justify-between gap-3 px-4 py-3">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-brand-navy">{{ getJobLabel(job) }}</p>
                  <div v-if="getJobPartDetails(job)" class="flex flex-wrap gap-1.5 mt-1">
                    <span v-if="getJobPartDetails(job).condition" :class="['text-[10px] px-2 py-0.5 rounded font-semibold', getJobPartDetails(job).condition === 'brand_new' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700']">
                      {{ getJobPartDetails(job).condition === 'brand_new' ? 'Brand New' : 'Surplus' }}
                    </span>
                    <span v-if="getJobPartDetails(job).isOwnerPart" class="text-[10px] px-2 py-0.5 rounded font-semibold bg-brand-sky text-brand-navy">Owner's Part</span>
                  </div>
                </div>
                <svg class="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div v-else class="p-4 text-center text-sm text-brand-ice bg-white border border-brand-sky rounded-xl">No jobs recorded</div>
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
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
              <span>Created {{ formatDate(currentService.created_at) }}</span>
              <span v-if="currentService.updated_by" class="opacity-60">by {{ currentService.updated_by }}</span>
            </div>
            <div v-if="currentService.updated_at && currentService.updated_at !== currentService.created_at" class="flex items-center gap-1.5 text-xs text-brand-ice">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              <span>Edited {{ formatDate(currentService.updated_at) }}</span>
              <span v-if="currentService.updated_by" class="opacity-60">by {{ currentService.updated_by }}</span>
            </div>
          </div>
          <div class="h-4" />
        </div>

        <!-- ─── DESKTOP LAYOUT ─────────────────────────────────── -->
        <div class="hidden md:flex flex-1 overflow-hidden">

          <div class="flex-1 overflow-y-auto hide-scrollbar p-6 lg:p-8 bg-[#eef2f6]">
            <div class="max-w-5xl mx-auto">

              <div class="flex items-start justify-between gap-6 mb-6 pb-6 border-b border-brand-sky">
                <div>
                  <p class="text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-1">Plate Number</p>
                  <div class="flex items-center gap-3">
                    <p class="text-4xl font-extrabold text-brand-navy tracking-tight" style="font-family: 'Barlow Condensed', sans-serif;">
                      {{ currentService.plate_number || 'Walk-in' }}
                    </p>
                    <span
                      v-if="warrantyStatus"
                      :class="['px-2.5 py-1 text-xs font-bold uppercase tracking-wide rounded-md', warrantyStatus === 'active' ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-red-100 text-red-600 border border-red-300']"
                    >
                      {{ warrantyStatus === 'active' ? 'In Warranty' : 'Out of Warranty' }}
                    </span>
                  </div>
                </div>
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

              <div class="grid grid-cols-5 gap-8 items-start">
                <div class="col-span-3 space-y-6">
                  <div>
                    <p class="text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-3">Jobs Done</p>
                    <div v-if="currentService.jobs_done?.length" class="divide-y divide-brand-sky border border-brand-sky rounded-xl overflow-hidden bg-white shadow-sm">
                      <div v-for="job in currentService.jobs_done" :key="job" class="flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-brand-sky/30 transition-colors">
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-semibold text-brand-navy">{{ getJobLabel(job) }}</p>
                          <div v-if="getJobPartDetails(job)" class="flex flex-wrap gap-1.5 mt-1.5">
                            <span v-if="getJobPartDetails(job).condition" :class="['text-[10px] px-2 py-0.5 rounded font-semibold', getJobPartDetails(job).condition === 'brand_new' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700']">
                              {{ getJobPartDetails(job).condition === 'brand_new' ? 'Brand New' : 'Surplus' }}
                            </span>
                            <span v-if="getJobPartDetails(job).isOwnerPart" class="text-[10px] px-2 py-0.5 rounded font-semibold bg-brand-sky text-brand-navy">Owner's Part</span>
                          </div>
                        </div>
                        <svg class="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div v-else class="p-6 text-center text-sm text-brand-ice bg-white border border-brand-sky rounded-xl">No jobs recorded</div>
                  </div>
                  <div v-if="currentService.description">
                    <p class="text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-3">Service Notes</p>
                    <div class="p-4 bg-white border border-brand-sky rounded-xl shadow-sm">
                      <p class="text-sm text-brand-navy leading-relaxed whitespace-pre-wrap">{{ currentService.description }}</p>
                    </div>
                  </div>
                </div>

                <div class="col-span-2 space-y-4">
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
                  <div v-if="currentService.car_model || currentService.car_year">
                    <p class="text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-3">Vehicle</p>
                    <div class="bg-white border border-brand-sky rounded-xl shadow-sm px-4 py-3">
                      <p class="text-[10px] text-brand-ice mb-0.5">Model & Year</p>
                      <p class="text-sm font-semibold text-brand-navy">
                        {{ currentService.car_model || 'N/A' }}
                        <span v-if="currentService.car_year" class="font-normal text-brand-ice"> ({{ currentService.car_year }})</span>
                      </p>
                    </div>
                  </div>
                  <div class="px-4 py-3 space-y-2 border border-brand-sky rounded-xl bg-white">
                    <div v-if="currentService.created_at" class="flex items-center gap-2 text-xs text-brand-ice">
                      <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
                      <span>Created {{ formatDate(currentService.created_at) }}</span>
                      <span v-if="currentService.updated_by" class="opacity-60">by {{ currentService.updated_by }}</span>
                    </div>
                    <div v-if="currentService.updated_at && currentService.updated_at !== currentService.created_at" class="flex items-center gap-2 text-xs text-brand-ice">
                      <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      <span>Edited {{ formatDate(currentService.updated_at) }}</span>
                      <span v-if="currentService.updated_by" class="opacity-60">by {{ currentService.updated_by }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Desktop inline history panel -->
          <div
            v-if="jobHistory.length > 1"
            class="w-64 lg:w-72 flex-shrink-0 border-l border-brand-navy/15 flex flex-col overflow-hidden bg-white "
          >
            <div class="flex-1 overflow-y-auto hide-scrollbar p-2">
              <template v-for="yearGroup in historyByYear" :key="yearGroup.year">
                <div class="flex items-center gap-2 px-2 py-1.5">
                  <span class="text-[10px] font-bold text-brand-ice uppercase tracking-widest">{{ yearGroup.year }}</span>
                  <div class="flex-1 h-px bg-brand-sky"></div>
                  <span class="text-[10px] text-brand-ice opacity-60">{{ yearGroup.jobs.length }}</span>
                </div>
                <div class="space-y-0.5 mb-3">
                  <button
                    v-for="job in yearGroup.jobs"
                    :key="job.id"
                    :class="[
                      'w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-200',
                      job.id === currentService.id
                        ? 'bg-white text-brand-navy border border-brand-navy/20 shadow-md shadow-brand-navy/15 scale-[1.02]'
                        : 'bg-transparent border-transparent hover:bg-white/80 hover:border-brand-navy/10 hover:shadow-sm'
                    ]"
                    :disabled="job.id === currentService.id"
                    @click="viewJob(job)"
                  >
                    <div class="flex items-center justify-between mb-0.5">
                      <div class="flex items-center gap-1.5">
                        <div v-if="job.id === currentService.id" class="w-1.5 h-1.5 bg-brand-navy rounded-full flex-shrink-0"></div>
                        <span class="text-xs font-bold text-brand-navy">{{ formatDateCompact(job.service_date) }}</span>
                      </div>
                      <span v-if="job.id === currentService.id" class="text-[8px] px-1.5 py-0.5 bg-brand-navy/10 text-brand-navy font-bold uppercase tracking-wider rounded">Now</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <p class="text-[11px] text-brand-ice truncate flex-1 mr-2">
                        {{ job.jobs_done?.length ? getJobLabel(job.jobs_done[0]) + (job.jobs_done.length > 1 ? ` +${job.jobs_done.length - 1}` : '') : 'No jobs' }}
                      </p>
                      <p class="text-[11px] font-bold text-green-600 tabular-nums flex-shrink-0">₱{{ job.cost?.toFixed(0) || '0' }}</p>
                    </div>
                  </button>
                </div>
              </template>
            </div>
          </div>

        </div>
      </div>

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
import { ref, computed, watch, onMounted } from 'vue'
import RecentServiceHistory from './RecentServiceHistory.vue'
import ServiceForm from './ServiceForm.vue'

const props = defineProps({
  service: { type: Object, required: true },
  allServices: { type: Array, default: () => [] },
  show: { type: Boolean, default: true },
  showBackdrop: { type: Boolean, default: true },
  isSidebarCollapsed: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'edit', 'viewJob'])

const showEditForm    = ref(false)
const currentService  = ref({ ...props.service })

watch(() => props.service, (v) => { currentService.value = { ...v } }, { deep: true })

const isVisible      = ref(false)
const backdropVisible = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      isVisible.value      = true
      backdropVisible.value = true
    })
  })
})

function close() {
  isVisible.value      = false
  backdropVisible.value = false
  const delay = window.innerWidth < 768 ? 420 : 0
  setTimeout(() => emit('close'), delay)
}

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

const historyByYear = computed(() => {
  const groups = {}
  jobHistory.value.forEach(job => {
    const year = job.service_date?.split('-')[0] || 'Unknown'
    if (!groups[year]) groups[year] = []
    groups[year].push(job)
  })
  return Object.keys(groups).sort((a, b) => b - a).map(year => ({ year, jobs: groups[year] }))
})

const warrantyStatus = computed(() => {
  if (!currentService.value.service_date) return null
  const days = Math.floor((new Date() - new Date(currentService.value.service_date)) / 86400000)
  return days <= 30 ? 'active' : 'expired'
})


function getJobLabel(k)        { return jobLabels[k] || k }
function getJobPartDetails(k)  {
  const condition   = currentService.value.part_condition?.[k]
  const isOwnerPart = currentService.value.owner_parts?.[k]
  if (!condition && !isOwnerPart) return null
  return { condition, isOwnerPart }
}
function handleEdit()          { showEditForm.value = true }
function handleSave(data)      { currentService.value = { ...data }; showEditForm.value = false; emit('edit', data) }
function viewJob(job)          { currentService.value = { ...job }; emit('viewJob', job) }

function formatDate(s) {
  if (!s) return 'N/A'
  try {
    const d = new Date(s)
    return isNaN(d) ? 'Invalid Date' : new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(d)
  } catch { return 'Invalid Date' }
}
function formatDateCompact(s) {
  if (!s) return 'N/A'
  try {
    const d = new Date(s)
    return isNaN(d) ? 'Invalid Date' : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(d)
  } catch { return 'Invalid Date' }
}
</script>

<style scoped>
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.hide-scrollbar::-webkit-scrollbar { display: none; }

@media (max-width: 767px) {
  .modal-enter-from { transform: translateY(100%); }
  .modal-enter-to   { transform: translateY(0); transition: transform 420ms cubic-bezier(0.32, 0.72, 0, 1); }
  .modal-leave-from { transform: translateY(0); }
  .modal-leave-to   { transform: translateY(100%); transition: transform 380ms cubic-bezier(0.32, 0.72, 0, 1); }
}
@media (min-width: 768px) {
  .modal-enter-from, .modal-enter-to,
  .modal-leave-from, .modal-leave-to { transition: none; }
}
</style>