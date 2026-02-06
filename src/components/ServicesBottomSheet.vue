<template>
  <teleport to="body">
    <transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isOpen"
        class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        @click="close"
      />
    </transition>

    <transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition-transform duration-250 ease-in"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div 
        v-if="isOpen"
        class="fixed bottom-0 left-0 right-0 md:right-0 md:left-auto md:w-[480px] lg:w-[560px] bg-[var(--background)] rounded-t-2xl z-50 flex flex-col"
        style="max-height: 85vh;"
        @click.stop
      >
        <!-- Handle Bar -->
        <div class="flex justify-center pt-3 pb-2">
          <div class="w-12 h-1.5 bg-[var(--border)] rounded-full" />
        </div>

        <!-- Header -->
        <div class="px-5 py-3 border-b border-[var(--border)]">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-bold text-[var(--foreground)]">Select Services</h3>
            <button 
              @click="close"
              class="p-2 hover:bg-[var(--muted)] rounded-lg transition-colors"
            >
              <svg class="w-5 h-5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Search Input -->
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search services..."
              class="w-full h-11 pl-11 pr-3 bg-[var(--muted)] border border-[var(--border)] text-[15px] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent)] transition-colors rounded-lg"
            />
          </div>
        </div>

        <!-- Services List -->
        <div class="flex-1 overflow-y-auto px-5 py-4">
          <!-- Replace Section -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-bold text-[var(--foreground)] uppercase tracking-wide">Replace</h4>
              <span class="text-xs text-[var(--accent)] font-bold">{{ getSelectedCount(filteredReplaceJobs) }}</span>
            </div>
            <div class="space-y-2">
              <button
                v-for="job in filteredReplaceJobs"
                :key="job.value"
                @click="toggleJob(job.value)"
                :class="[
                  'w-full flex items-center justify-between p-3.5 rounded-lg transition-all',
                  selectedJobs.includes(job.value)
                    ? 'bg-[var(--accent)]/15 border-2 border-[var(--accent)]'
                    : 'bg-[var(--muted)] border-2 border-transparent hover:border-[var(--border)]'
                ]"
              >
                <span :class="[
                  'text-sm font-medium',
                  selectedJobs.includes(job.value) ? 'text-[var(--accent)]' : 'text-[var(--foreground)]'
                ]">
                  {{ job.label }}
                </span>
                <div :class="[
                  'w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all',
                  selectedJobs.includes(job.value)
                    ? 'bg-[var(--accent)] border-[var(--accent)]'
                    : 'border-[var(--border)]'
                ]">
                  <svg v-if="selectedJobs.includes(job.value)" class="w-4 h-4 text-[var(--accent-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          <!-- Pulldown Section -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-bold text-[var(--foreground)] uppercase tracking-wide">Pulldown</h4>
              <span class="text-xs text-[var(--accent)] font-bold">{{ getSelectedCount(filteredPulldownJobs) }}</span>
            </div>
            <div class="space-y-2">
              <button
                v-for="job in filteredPulldownJobs"
                :key="job.value"
                @click="toggleJob(job.value)"
                :class="[
                  'w-full flex items-center justify-between p-3.5 rounded-lg transition-all',
                  selectedJobs.includes(job.value)
                    ? 'bg-[var(--accent)]/15 border-2 border-[var(--accent)]'
                    : 'bg-[var(--muted)] border-2 border-transparent hover:border-[var(--border)]'
                ]"
              >
                <span :class="[
                  'text-sm font-medium',
                  selectedJobs.includes(job.value) ? 'text-[var(--accent)]' : 'text-[var(--foreground)]'
                ]">
                  {{ job.label }}
                </span>
                <div :class="[
                  'w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all',
                  selectedJobs.includes(job.value)
                    ? 'bg-[var(--accent)] border-[var(--accent)]'
                    : 'border-[var(--border)]'
                ]">
                  <svg v-if="selectedJobs.includes(job.value)" class="w-4 h-4 text-[var(--accent-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          <!-- Other Services Section -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-bold text-[var(--foreground)] uppercase tracking-wide">Other Services</h4>
              <span class="text-xs text-[var(--accent)] font-bold">{{ getSelectedCount(filteredOtherJobs) }}</span>
            </div>
            <div class="space-y-2">
              <button
                v-for="job in filteredOtherJobs"
                :key="job.value"
                @click="toggleJob(job.value)"
                :class="[
                  'w-full flex items-center justify-between p-3.5 rounded-lg transition-all',
                  selectedJobs.includes(job.value)
                    ? 'bg-[var(--accent)]/15 border-2 border-[var(--accent)]'
                    : 'bg-[var(--muted)] border-2 border-transparent hover:border-[var(--border)]'
                ]"
              >
                <span :class="[
                  'text-sm font-medium',
                  selectedJobs.includes(job.value) ? 'text-[var(--accent)]' : 'text-[var(--foreground)]'
                ]">
                  {{ job.label }}
                </span>
                <div :class="[
                  'w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all',
                  selectedJobs.includes(job.value)
                    ? 'bg-[var(--accent)] border-[var(--accent)]'
                    : 'border-[var(--border)]'
                ]">
                  <svg v-if="selectedJobs.includes(job.value)" class="w-4 h-4 text-[var(--accent-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          <div class="h-24"></div>
        </div>

        <!-- Sticky Footer -->
        <div class="border-t border-[var(--border)] p-4 bg-[var(--background)]">
          <button
            @click="apply"
            class="w-full h-12 bg-[var(--accent)] text-[var(--accent-foreground)] font-bold text-base rounded-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Apply ({{ selectedJobs.length }})
          </button>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const searchQuery = ref('')
const selectedJobs = ref([...props.modelValue])

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

const filteredReplaceJobs = computed(() => filterJobs(replaceJobs))
const filteredPulldownJobs = computed(() => filterJobs(pulldownJobs))
const filteredOtherJobs = computed(() => filterJobs(otherJobs))

function filterJobs(jobs) {
  if (!searchQuery.value) return jobs
  const query = searchQuery.value.toLowerCase()
  return jobs.filter(job => job.label.toLowerCase().includes(query))
}

function getSelectedCount(jobs) {
  return jobs.filter(job => selectedJobs.value.includes(job.value)).length
}

function toggleJob(jobValue) {
  const index = selectedJobs.value.indexOf(jobValue)
  if (index > -1) {
    selectedJobs.value.splice(index, 1)
  } else {
    selectedJobs.value.push(jobValue)
  }
}

function apply() {
  emit('update:modelValue', selectedJobs.value)
  emit('close')
}

function close() {
  selectedJobs.value = [...props.modelValue]
  emit('close')
}
</script>