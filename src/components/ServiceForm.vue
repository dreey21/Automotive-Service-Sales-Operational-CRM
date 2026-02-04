<template>
  <div v-if="show">
    <!-- Backdrop with fade -->
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
        class="fixed inset-0 bg-black/50 z-40 transition-[left] duration-300 ease-in-out"
        :class="isSidebarCollapsed ? 'md:left-16' : 'md:left-64'"
        @click="close"
      ></div>
    </transition>

    <!-- Slide-over Panel with CSS animation -->
    <div class="fixed inset-y-0 right-0 z-50 w-full lg:w-[480px] xl:w-[560px] bg-[var(--background)] shadow-2xl flex flex-col slide-in">
      <!-- Header -->
      <div class="bg-[var(--card)] border-b border-[var(--border)] px-4 lg:px-6 py-3.5 flex items-center justify-between">
        <button @click="close" type="button" class="md:hidden text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h1 class="text-base lg:text-lg font-bold text-[var(--foreground)] tracking-tight">
          {{ service ? 'Edit Record' : 'New Record' }}
        </h1>
        <div class="w-10 md:w-20"></div>
      </div>

      <!-- Form Content -->
      <div class="flex-1 overflow-y-auto">
        <form @submit.prevent="handleSubmit" class="p-4 lg:p-6 space-y-5">
          <!-- Customer Name -->
          <div>
            <label for="customer_name" class="block text-xs font-semibold text-[var(--foreground)] mb-2 uppercase tracking-wide">
              Customer Name <span class="text-red-500">*</span>
            </label>
            <input
              id="customer_name"
              v-model="formData.customer_name"
              type="text"
              required
              class="w-full h-11 px-3.5 bg-[var(--card)] border border-[var(--border)] text-[15px] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all rounded-md"
              placeholder="Enter customer name"
            />
          </div>

          <!-- Phone -->
          <div>
            <label for="phone" class="block text-xs font-semibold text-[var(--foreground)] mb-2 uppercase tracking-wide">
              Phone Number
            </label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              class="w-full h-11 px-3.5 bg-[var(--card)] border border-[var(--border)] text-[15px] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all rounded-md"
              placeholder="09xxxxxxxxx"
            />
          </div>

          <!-- Divider -->
          <div class="border-t border-[var(--border)] -mx-4 lg:-mx-6"></div>

          <!-- Car Model -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="car_model" class="block text-xs font-semibold text-[var(--foreground)] mb-2 uppercase tracking-wide">
                Car Model
              </label>
              <input
                id="car_model"
                v-model="formData.car_model"
                type="text"
                class="w-full h-11 px-3.5 bg-[var(--card)] border border-[var(--border)] text-[15px] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all rounded-md"
                placeholder="e.g., Toyota Vios"
              />
            </div>
            <div>
              <label for="invoice" class="block text-xs font-semibold text-[var(--foreground)] mb-2 uppercase tracking-wide">Invoice NO. </label>
              <input
                id="invoice"
                v-model="formData.invoice"
                type="text"
                class="w-full h-11 px-3.5 bg-[var(--card)] border border-[var(--border)] text-[15px] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all rounded-md"
                placeholder="1234"
              />
            </div>
          </div>

          <!-- Plate Number & Year -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="plate_number" class="block text-xs font-semibold text-[var(--foreground)] mb-2 uppercase tracking-wide">
                Plate No.
              </label>
              <input
                id="plate_number"
                v-model="formData.plate_number"
                type="text"
                class="w-full h-11 px-3.5 bg-[var(--card)] border border-[var(--border)] text-[15px] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all rounded-md"
                placeholder="ABC 1234"
              />
            </div>
            <div>
              <label for="car_year" class="block text-xs font-semibold text-[var(--foreground)] mb-2 uppercase tracking-wide">
                Year
              </label>
              <input
                id="car_year"
                v-model="formData.car_year"
                type="text"
                pattern="[0-9]{4}"
                maxlength="4"
                class="w-full h-11 px-3.5 bg-[var(--card)] border border-[var(--border)] text-[15px] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all rounded-md"
                placeholder="2024"
              />
            </div>
          </div>

          <!-- Divider -->
          <div class="border-t border-[var(--border)] -mx-4 lg:-mx-6"></div>

          <!-- Job Done (Multi-select with collapsible sections) -->
          <div>
            <label class="block text-xs font-semibold text-[var(--foreground)] mb-3 uppercase tracking-wide">
              Job Done <span class="text-red-500">*</span>
            </label>
            
            <div class="space-y-3">
              <!-- Replace Group (Collapsible) -->
              <div class="bg-[var(--card)] border border-[var(--border)] rounded-lg overflow-hidden">
                <button
                  type="button"
                  @click="replaceExpanded = !replaceExpanded"
                  class="w-full px-4 py-3 flex items-center justify-between hover:bg-[var(--accent)]/5 transition-colors"
                >
                  <div class="flex items-center gap-2">
                    <h3 class="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider">Replace</h3>
                    <span v-if="getSelectedCount(replaceJobs) > 0" class="text-xs text-[var(--accent)] font-bold">
                      [{{ getSelectedCount(replaceJobs) }}]
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      v-if="getSelectedCount(replaceJobs) > 0"
                      type="button"
                      @click.stop="confirmClearSection(replaceJobs, 'Replace')"
                      class="text-xs text-[var(--muted-foreground)] hover:text-red-500 underline transition-colors"
                    >
                      Clear
                    </button>
                    <svg 
                      class="w-4 h-4 text-[var(--muted-foreground)] transition-transform" 
                      :class="{ 'rotate-180': replaceExpanded }"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                <transition
                  enter-active-class="transition-all duration-200 ease-out"
                  enter-from-class="max-h-0 opacity-0"
                  enter-to-class="max-h-[2000px] opacity-100"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="max-h-[2000px] opacity-100"
                  leave-to-class="max-h-0 opacity-0"
                >
                  <div v-if="replaceExpanded" class="px-4 pb-4">
                    <!-- Two-column grid on larger screens -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-2">
                      <div v-for="job in replaceJobs" :key="job.value" class="flex items-start gap-2.5">
                        <Checkbox
                          :id="job.value"
                          :checked="formData.jobs_done.includes(job.value)"
                          @update:checked="(checked) => toggleJob(job.value, checked)"
                          class="mt-0.5"
                        />
                        <div class="flex-1 min-w-0">
                          <label :for="job.value" class="text-sm text-[var(--foreground)] cursor-pointer select-none leading-tight block">
                            {{ job.label }}
                          </label>
                          <div v-if="formData.jobs_done.includes(job.value)" class="mt-1.5 space-y-1.5">
                            <!-- First row: Brand New (left) and Owner's part (right) -->
                            <div class="flex items-center justify-between gap-3">
                              <div class="flex items-center gap-2">
                                <Checkbox
                                  :id="`${job.value}_brandnew`"
                                  :checked="formData.part_condition[job.value] === 'brand_new'"
                                  :disabled="formData.owner_parts[job.value]"
                                  @update:checked="(checked) => togglePartCondition(job.value, 'brand_new', checked)"
                                />
                                <label :for="`${job.value}_brandnew`" class="text-xs text-[var(--muted-foreground)] cursor-pointer select-none leading-none" :class="{ 'opacity-50': formData.owner_parts[job.value] }">
                                  Brand New
                                </label>
                              </div>
                              <div class="flex items-center gap-2">
                                <Checkbox
                                  :id="`${job.value}_owner`"
                                  :checked="formData.owner_parts[job.value] || false"
                                  @update:checked="(checked) => toggleOwnerPart(job.value, checked)"
                                />
                                <label :for="`${job.value}_owner`" class="text-xs text-[var(--muted-foreground)] cursor-pointer select-none leading-none whitespace-nowrap">
                                  Owner's part
                                </label>
                              </div>
                            </div>
                            <!-- Second row: Surplus (left only) -->
                            <div class="flex items-center gap-2">
                              <Checkbox
                                :id="`${job.value}_surplus`"
                                :checked="formData.part_condition[job.value] === 'surplus'"
                                :disabled="formData.owner_parts[job.value]"
                                @update:checked="(checked) => togglePartCondition(job.value, 'surplus', checked)"
                              />
                              <label :for="`${job.value}_surplus`" class="text-xs text-[var(--muted-foreground)] cursor-pointer select-none leading-none" :class="{ 'opacity-50': formData.owner_parts[job.value] }">
                                Surplus
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>

              <!-- Pulldown Group (Collapsible) -->
              <div class="bg-[var(--card)] border border-[var(--border)] rounded-lg overflow-hidden">
                <button
                  type="button"
                  @click="pulldownExpanded = !pulldownExpanded"
                  class="w-full px-4 py-3 flex items-center justify-between hover:bg-[var(--accent)]/5 transition-colors"
                >
                  <div class="flex items-center gap-2">
                    <h3 class="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider">Pulldown</h3>
                    <span v-if="getSelectedCount(pulldownJobs) > 0" class="text-xs text-[var(--accent)] font-bold">
                      [{{ getSelectedCount(pulldownJobs) }}]
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      v-if="getSelectedCount(pulldownJobs) > 0"
                      type="button"
                      @click.stop="confirmClearSection(pulldownJobs, 'Pulldown')"
                      class="text-xs text-[var(--muted-foreground)] hover:text-red-500 underline transition-colors"
                    >
                      Clear
                    </button>
                    <svg 
                      class="w-4 h-4 text-[var(--muted-foreground)] transition-transform" 
                      :class="{ 'rotate-180': pulldownExpanded }"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                <transition
                  enter-active-class="transition-all duration-200 ease-out"
                  enter-from-class="max-h-0 opacity-0"
                  enter-to-class="max-h-96 opacity-100"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="max-h-96 opacity-100"
                  leave-to-class="max-h-0 opacity-0"
                >
                  <div v-if="pulldownExpanded" class="px-4 pb-4 space-y-2">
                    <div v-for="job in pulldownJobs" :key="job.value" class="flex items-center gap-3">
                      <Checkbox
                        :id="job.value"
                        :checked="formData.jobs_done.includes(job.value)"
                        @update:checked="(checked) => toggleJob(job.value, checked)"
                      />
                      <label :for="job.value" class="text-sm text-[var(--foreground)] cursor-pointer select-none leading-none">
                        {{ job.label }}
                      </label>
                    </div>
                  </div>
                </transition>
              </div>

              <!-- Other Services Group (Always Expanded - Most Common) -->
              <div class="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <h3 class="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider">Other Services</h3>
                    <span v-if="getSelectedCount(otherJobs) > 0" class="text-xs text-[var(--accent)] font-bold">
                      [{{ getSelectedCount(otherJobs) }}]
                    </span>
                  </div>
                  <button
                    v-if="getSelectedCount(otherJobs) > 0"
                    type="button"
                    @click="confirmClearSection(otherJobs, 'Other Services')"
                    class="text-xs text-[var(--muted-foreground)] hover:text-red-500 underline transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div class="space-y-2">
                  <div v-for="job in otherJobs" :key="job.value" class="flex items-center gap-3">
                    <Checkbox
                      :id="job.value"
                      :checked="formData.jobs_done.includes(job.value)"
                      @update:checked="(checked) => toggleJob(job.value, checked)"
                    />
                    <label :for="job.value" class="text-sm text-[var(--foreground)] cursor-pointer select-none leading-none">
                      {{ job.label }}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <p v-if="formData.jobs_done.length === 0" class="text-xs text-red-500 mt-2">
              Please select at least one job
            </p>
          </div>

          <!-- Service Date & Cost -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="service_date" class="block text-xs font-semibold text-[var(--foreground)] mb-2 uppercase tracking-wide">
                Date <span class="text-red-500">*</span>
              </label>
              <input
                id="service_date"
                v-model="formData.service_date"
                type="date"
                required
                class="w-full h-11 px-3.5 bg-[var(--card)] border border-[var(--border)] text-[15px] text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all rounded-md"
              />
            </div>
            <div>
              <label for="cost" class="block text-xs font-semibold text-[var(--foreground)] mb-2 uppercase tracking-wide">
                Cost (₱) <span class="text-red-500">*</span>
              </label>
              <input
                id="cost"
                v-model.number="formData.cost"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full h-11 px-3.5 bg-[var(--card)] border border-[var(--border)] text-[15px] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all tabular-nums rounded-md"
                placeholder="0.00"
              />
            </div>
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-xs font-semibold text-[var(--foreground)] mb-2 uppercase tracking-wide">
              Notes
            </label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="4"
              class="w-full px-3.5 py-3 bg-[var(--card)] border border-[var(--border)] text-[15px] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all resize-none rounded-md"
              placeholder="Additional details about the service..."
            ></textarea>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="bg-[var(--card)] border-t border-[var(--border)] p-4 lg:px-6 mb-20 md:mb-0">
        <div class="flex gap-3">
          <button
            @click="close"
            type="button"
            class="hidden md:flex flex-1 h-11 items-center justify-center bg-transparent border border-[var(--border)] text-[var(--foreground)] font-medium text-sm transition-colors hover:bg-[var(--card)]/80 rounded-md"
          >
            Cancel
          </button>
          <button
            @click="handleSubmit"
            type="button"
            :disabled="formData.jobs_done.length === 0"
            class="flex-1 h-11 bg-[var(--accent)] text-[var(--accent-foreground)] font-semibold text-sm transition-all active:scale-[0.98] hover:bg-[var(--accent)]/90 shadow-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ service ? 'Update Record' : 'Save Record' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <AlertDialog :open="showConfirmDialog" @update:open="showConfirmDialog = $event">
      <AlertDialogContent class="max-w-md bg-[var(--card)] border-[var(--border)]">
        <AlertDialogHeader>
          <AlertDialogTitle class="text-[var(--foreground)]">Clear {{ confirmDialogData.sectionName }}?</AlertDialogTitle>
          <AlertDialogDescription class="text-[var(--muted-foreground)]">
            Are you sure you want to clear all {{ confirmDialogData.count }} selected item(s) from {{ confirmDialogData.sectionName }}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="handleCancelClear" class="bg-transparent border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction @click="handleConfirmClear" class="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white">
            Clear All
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Checkbox from '@/components/ui/checkbox.vue'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const props = defineProps({
  service: {
    type: Object,
    default: null
  },
  show: {
    type: Boolean,
    default: true
  },
  showBackdrop: {
    type: Boolean,
    default: true
  },
  isSidebarCollapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

// Confirmation dialog state
const showConfirmDialog = ref(false)
const confirmDialogData = ref({
  sectionName: '',
  jobs: [],
  count: 0
})

// Collapsible state
const replaceExpanded = ref(false)
const pulldownExpanded = ref(false)

// Job options grouped by category
const replaceJobs = [
  { value: 'replace_evaporator_front', label: 'Evaporator Front' },
  { value: 'replace_evaporator_rear', label: 'Evaporator Rear' },
  { value: 'replace_condenser', label: 'Condenser' },
  { value: 'replace_compressor', label: 'Compressor' },
  { value: 'replace_blower_motor', label: 'Blower Motor' },
  { value: 'replace_expansion_valve', label: 'Expansion Valve' },
  { value: 'replace_pulley_assembly', label: 'Pulley Assembly' },
  { value: 'replace_fan_motor', label: 'Fan Motor' },
  { value: 'replace_suction_hose_assembly', label: 'Suction Hose Assembly' },
  { value: 'replace_fan_belt', label: 'Fan Belt' },
  { value: 'replace_filter_drier', label: 'Filter Drier' },
  { value: 'replace_discharge_hose_suction', label: 'Discharge Hose Suction' },
  { value: 'replace_ecv', label: 'ECV' },
  { value: 'replace_oring', label: 'O-ring' },
  { value: 'replace_radiator', label: 'Radiator' },
  { value: 'replace_cabin_filter', label: 'Cabin Filter' },
  { value: 'replace_magnetic', label: 'Magnetic' }
]

const pulldownJobs = [
  { value: 'pulldown_evaporator', label: 'Evaporator' },
  { value: 'pulldown_condenser', label: 'Condenser' },
  { value: 'pulldown_compressor', label: 'Compressor' }
]

const otherJobs = [
  { value: 'flushing_system', label: 'Flushing System' },
  { value: 'install_cabin_filter', label: 'Install Cabin Filter' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'freon', label: 'Freon' }
]

const formData = ref({
  customer_name: '',
  phone: '',
  car_model: '',
  car_year: '',
  invoice: '',
  plate_number: '',
  jobs_done: [],
  owner_parts: {},
  part_condition: {}, // New field to track brand new or surplus
  service_date: '',
  cost: 0,
  description: ''
})

// Get count of selected items in a job group
function getSelectedCount(jobs) {
  return jobs.filter(job => formData.value.jobs_done.includes(job.value)).length
}

// Confirm before clearing a section
function confirmClearSection(jobs, sectionName) {
  const count = getSelectedCount(jobs)
  confirmDialogData.value = {
    sectionName,
    jobs,
    count
  }
  showConfirmDialog.value = true
}

// Handle confirmation dialog accept
function handleConfirmClear() {
  clearSection(confirmDialogData.value.jobs)
  showConfirmDialog.value = false
}

// Handle confirmation dialog cancel
function handleCancelClear() {
  showConfirmDialog.value = false
}

// Clear all selections in a section
function clearSection(jobs) {
  jobs.forEach(job => {
    const index = formData.value.jobs_done.indexOf(job.value)
    if (index > -1) {
      formData.value.jobs_done.splice(index, 1)
      delete formData.value.owner_parts[job.value]
      delete formData.value.part_condition[job.value]
    }
  })
}

onMounted(() => {
  if (props.service) {
    formData.value = {
      customer_name: props.service.customer_name || '',
      phone: props.service.phone || '',
      car_model: props.service.car_model || '',
      invoice: props.service.invoice || '',
      car_year: props.service.car_year || '',
      plate_number: props.service.plate_number || '',
      jobs_done: props.service.jobs_done || [],
      owner_parts: props.service.owner_parts || {},
      part_condition: props.service.part_condition || {},
      service_date: props.service.service_date || '',
      cost: props.service.cost || 0,
      description: props.service.description || ''
    }
    
    // Auto-expand sections with selected items
    if (getSelectedCount(replaceJobs) > 0) replaceExpanded.value = true
    if (getSelectedCount(pulldownJobs) > 0) pulldownExpanded.value = true
  } else {
    formData.value.service_date = new Date().toISOString().split('T')[0]
  }
})

watch(() => props.show, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

function toggleJob(jobValue, checked) {
  if (checked) {
    if (!formData.value.jobs_done.includes(jobValue)) {
      formData.value.jobs_done.push(jobValue)
    }
  } else {
    const index = formData.value.jobs_done.indexOf(jobValue)
    if (index > -1) {
      formData.value.jobs_done.splice(index, 1)
      delete formData.value.owner_parts[jobValue]
      delete formData.value.part_condition[jobValue]
    }
  }
}

function toggleOwnerPart(jobValue, checked) {
  if (checked) {
    formData.value.owner_parts[jobValue] = true
    // Clear part condition when marking as owner's part
    delete formData.value.part_condition[jobValue]
  } else {
    delete formData.value.owner_parts[jobValue]
  }
}

function togglePartCondition(jobValue, condition, checked) {
  if (checked) {
    formData.value.part_condition[jobValue] = condition
  } else {
    // If unchecking, only remove if it matches the current condition
    if (formData.value.part_condition[jobValue] === condition) {
      delete formData.value.part_condition[jobValue]
    }
  }
}

function handleSubmit() {
  if (formData.value.jobs_done.length === 0) {
    return
  }

  const dataToSave = { ...formData.value }
  
  if (props.service?.id) {
    dataToSave.id = props.service.id
  }
  
  emit('save', dataToSave)
}

function close() {
  emit('close')
}
</script>

<style scoped>
/* Slide-in animation */
@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.slide-in {
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>