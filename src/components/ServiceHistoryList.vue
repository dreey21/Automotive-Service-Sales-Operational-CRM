<template>
  <!-- Slide-over panel from right (mobile) / beside sidebar (desktop) -->
  <div 
    class="fixed inset-0 bg-black/50 z-[60] transition-[left] duration-300 ease-in-out"
    :class="isSidebarCollapsed ? 'md:left-16' : 'md:left-64'"
    @click="$emit('close')"
  >
    <!-- Panel container -->
    <div
      class="absolute top-0 right-0 w-full bg-[var(--background)] shadow-2xl flex flex-col slide-in bottom-16 md:bottom-0"
      :class="[
        'max-w-md md:max-w-xs'
      ]"
      @click.stop
    >
      <!-- MOBILE HEADER -->
      <div class="md:hidden bg-[var(--card)] border-b border-[var(--border)] px-4 py-4 flex items-center gap-3 flex-shrink-0">
        <button
          @click="$emit('close')"
          class="p-2 -ml-2 text-[var(--foreground)] hover:bg-[var(--muted)]/50 transition-colors"
          style="border-radius: 6px;"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div class="flex-1 min-w-0">
          <h1 class="text-lg font-bold text-[var(--foreground)] tracking-tight">
            Service History
          </h1>
          <p class="text-xs text-[var(--muted-foreground)] mt-0.5">
            <span class="font-semibold">{{ plateNumber }}</span> · {{ jobs.length }} record{{ jobs.length !== 1 ? 's' : '' }}
          </p>
        </div>
        
        <!-- Sort Controls -->
        <button
          @click="toggleSortOrder"
          class="px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)]/50 transition-colors flex items-center gap-2"
          style="border-radius: 6px;"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
          </svg>
        </button>
      </div>

      <!-- DESKTOP HEADER -->
      <div class="hidden md:flex bg-[var(--card)] border-b border-[var(--border)] px-3 py-3 items-center gap-2 flex-shrink-0">
        <button
          @click="$emit('close')"
          class="p-1.5 -ml-1 text-[var(--foreground)] hover:bg-[var(--muted)]/50 transition-colors"
          style="border-radius: 4px;"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div class="flex-1 min-w-0">
          <h1 class="text-sm font-bold text-[var(--foreground)] tracking-tight">
            History
          </h1>
          <p class="text-[10px] text-[var(--muted-foreground)]">
            <span class="font-semibold">{{ plateNumber }}</span> · {{ jobs.length }}
          </p>
        </div>
        
        <!-- Sort Controls -->
        <button
          @click="toggleSortOrder"
          class="px-2 py-1.5 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--muted)]/50 transition-colors flex items-center gap-1.5"
          style="border-radius: 4px;"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
          </svg>
          <span>{{ sortOrder === 'desc' ? 'New' : 'Old' }}</span>
        </button>
      </div>

      <!-- MOBILE Scrollable List -->
      <div class="md:hidden flex-1 overflow-y-auto hide-scrollbar">
        <div class="p-4 space-y-4">
          <div v-for="yearGroup in sortedJobsByYear" :key="yearGroup.year" class="space-y-3">
            <!-- Year header (sticky) -->
            <div class="sticky top-0 bg-[var(--background)]/95 backdrop-blur-sm py-2 -mx-4 px-4 z-10">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h2 class="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                  {{ yearGroup.year }}
                </h2>
                <div class="flex-1 border-t border-[var(--border)]/50"></div>
                <span class="text-xs text-[var(--muted-foreground)]/60">
                  {{ yearGroup.jobs.length }}
                </span>
              </div>
            </div>

            <!-- Jobs for this year - Mobile cards -->
            <div class="space-y-2">
              <button
                v-for="job in yearGroup.jobs"
                :key="job.id"
                :class="[
                  'w-full flex items-center justify-between gap-3 p-3 border transition-all duration-300 text-left',
                  job.id === currentJobId 
                    ? 'bg-[var(--accent)]/15 border-[var(--accent)] ring-1 ring-[var(--accent)]/30' 
                    : 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--accent)]/40 active:scale-[0.98]'
                ]"
                style="border-radius: 6px;"
                @click="handleJobClick(job)"
              >
                <!-- Left: Date + Active indicator -->
                <div class="flex items-center gap-2.5 min-w-0">
                  <div 
                    v-if="job.id === currentJobId" 
                    class="w-2 h-2 bg-[var(--accent)] rounded-full flex-shrink-0 animate-pulse"
                  ></div>
                  <div class="min-w-0">
                    <p class="text-base font-bold text-[var(--foreground)]">
                      {{ formatDate(job.service_date) }}
                    </p>
                    <p class="text-xs text-[var(--muted-foreground)]">
                      Invoice #{{ job.invoice || 'N/A' }}
                    </p>
                  </div>
                </div>

                <!-- Right: Jobs count + Arrow -->
                <div class="flex items-center gap-3 flex-shrink-0">
                  <!-- Jobs count badge -->
                  <div class="flex items-center gap-1.5 px-2.5 py-1.5 bg-[var(--muted)]/50 rounded">
                    <svg class="w-3.5 h-3.5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm font-bold text-[var(--foreground)] tabular-nums">
                      {{ job.jobs_done?.length || 0 }}
                    </span>
                  </div>

                  <!-- Arrow or Current badge -->
                  <div class="w-6 flex justify-end">
                    <span 
                      v-if="job.id === currentJobId" 
                      class="text-[9px] px-1.5 py-0.5 bg-[var(--accent)]/25 text-[var(--accent)] font-bold uppercase"
                      style="border-radius: 3px;"
                    >
                      Now
                    </span>
                    <svg 
                      v-else
                      class="w-5 h-5 text-[var(--muted-foreground)]" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      stroke-width="2"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="!sortedJobsByYear.length" class="text-center py-12">
            <svg class="w-16 h-16 mx-auto text-[var(--muted-foreground)]/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-sm text-[var(--muted-foreground)]">No service records found</p>
          </div>
        </div>
      </div>

      <!-- DESKTOP Scrollable List - Ultra compact -->
      <div class="hidden md:block flex-1 overflow-y-auto hide-scrollbar">
        <div class="p-2 space-y-3">
          <div v-for="yearGroup in sortedJobsByYear" :key="yearGroup.year" class="space-y-1.5">
            <!-- Year header (sticky) -->
            <div class="sticky top-0 bg-[var(--background)]/95 backdrop-blur-sm py-1.5 -mx-2 px-2 z-10">
              <div class="flex items-center gap-1.5">
                <svg class="w-3 h-3 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h2 class="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                  {{ yearGroup.year }}
                </h2>
                <div class="flex-1 border-t border-[var(--border)]/50"></div>
                <span class="text-[10px] text-[var(--muted-foreground)]/60">
                  {{ yearGroup.jobs.length }}
                </span>
              </div>
            </div>

            <!-- Jobs for this year - Ultra compact list -->
            <div class="space-y-1">
              <button
                v-for="job in yearGroup.jobs"
                :key="job.id"
                :class="[
                  'w-full flex items-center justify-between gap-2 px-2 py-2 border transition-all duration-200 text-left',
                  job.id === currentJobId 
                    ? 'bg-[var(--accent)]/15 border-[var(--accent)] ring-1 ring-[var(--accent)]/30' 
                    : 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--accent)]/40 active:scale-[0.98]'
                ]"
                style="border-radius: 4px;"
                @click="handleJobClick(job)"
              >
                <!-- Left: Date + Active indicator -->
                <div class="flex items-center gap-2 min-w-0 flex-1">
                  <div 
                    v-if="job.id === currentJobId" 
                    class="w-1.5 h-1.5 bg-[var(--accent)] rounded-full flex-shrink-0 animate-pulse"
                  ></div>
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-bold text-[var(--foreground)] truncate">
                      {{ formatDateCompact(job.service_date) }}
                    </p>
                  </div>
                </div>

                <!-- Right: Jobs count + Cost -->
                <div class="flex items-center gap-2 flex-shrink-0">
                  <!-- Jobs count badge -->
                  <div class="flex items-center gap-1 px-1.5 py-0.5 bg-[var(--muted)]/50 rounded">
                    <svg class="w-3 h-3 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-[11px] font-bold text-[var(--foreground)] tabular-nums">
                      {{ job.jobs_done?.length || 0 }}
                    </span>
                  </div>

                  <!-- Cost -->
                  <p class="text-[11px] font-bold text-green-500 tabular-nums w-16 text-right">
                    ₱{{ job.cost?.toFixed(0) || '0' }}
                  </p>

                  <!-- Arrow or Current badge -->
                  <div class="w-4 flex justify-end">
                    <span 
                      v-if="job.id === currentJobId" 
                      class="w-1.5 h-1.5 bg-[var(--accent)] rounded-full"
                    ></span>
                    <svg 
                      v-else
                      class="w-4 h-4 text-[var(--muted-foreground)]" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      stroke-width="2"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="!sortedJobsByYear.length" class="text-center py-8">
            <svg class="w-12 h-12 mx-auto text-[var(--muted-foreground)]/30 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-xs text-[var(--muted-foreground)]">No records</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  jobs: {
    type: Array,
    required: true
  },
  plateNumber: {
    type: String,
    required: true
  },
  currentJobId: {
    type: [Number, String],
    required: true
  },
  isSidebarCollapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'select-job'])

const sortOrder = ref('desc') // 'desc' = newest first, 'asc' = oldest first

// Group jobs by year
const jobsByYear = computed(() => {
  const groups = {}
  
  props.jobs.forEach(job => {
    const year = job.service_date ? job.service_date.split('-')[0] : 'Unknown'
    if (!groups[year]) {
      groups[year] = []
    }
    groups[year].push(job)
  })

  return groups
})

// Sorted jobs by year based on sort order
const sortedJobsByYear = computed(() => {
  const yearKeys = Object.keys(jobsByYear.value).sort((a, b) => {
    if (sortOrder.value === 'desc') {
      return b.localeCompare(a)
    }
    return a.localeCompare(b)
  })

  return yearKeys.map(year => ({
    year,
    jobs: jobsByYear.value[year]
  }))
})

function handleJobClick(job) {
  emit('select-job', job)
}

function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  } catch {
    return 'Invalid Date'
  }
}

function formatDateCompact(dateString) {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    
    // Ultra compact format for desktop: "Jan 15, 2023"
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  } catch {
    return 'Invalid Date'
  }
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