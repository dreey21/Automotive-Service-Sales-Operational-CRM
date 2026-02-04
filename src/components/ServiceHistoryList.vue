<template>
  <!-- Slide-over panel from right (mobile) / beside sidebar (desktop) -->
  <div 
    class="fixed inset-0 bg-black/50 z-[60] transition-[left] duration-300 ease-in-out"
    :class="isSidebarCollapsed ? 'md:left-16' : 'md:left-64'"
    @click="$emit('close')"
  >
    <!-- Panel container -->
    <div
      class="absolute top-0 right-0 bottom-0 w-full max-w-md bg-[var(--background)] shadow-2xl flex flex-col md:max-w-lg slide-in"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-[var(--card)] border-b border-[var(--border)] px-4 py-4 flex items-center gap-3 flex-shrink-0">
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
            Complete Service History
          </h1>
          <p class="text-xs text-[var(--muted-foreground)] mt-0.5">
            {{ plateNumber }} · {{ jobs.length }} record{{ jobs.length !== 1 ? 's' : '' }}
          </p>
        </div>
      </div>

      <!-- Vertical scrollable list -->
      <div class="flex-1 overflow-y-auto hide-scrollbar">
        <div class="p-4 space-y-3 pb-20 md:pb-4">
          <!-- Group by year for better scanability -->
          <div v-for="yearGroup in jobsByYear" :key="yearGroup.year" class="space-y-3">
            <!-- Year header (sticky) -->
            <div class="sticky top-0 bg-[var(--background)]/95 backdrop-blur-sm py-2 z-10 -mx-4 px-4">
              <h2 class="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                {{ yearGroup.year }}
              </h2>
            </div>

            <!-- Jobs for this year -->
            <div
              v-for="job in yearGroup.jobs"
              :key="job.id"
              :class="[
                'p-3.5 border transition-all cursor-pointer',
                job.id === currentJobId 
                  ? 'bg-orange-500/15 border-orange-500/50 ring-2 ring-orange-500/30' 
                  : 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--accent)]/40 active:scale-[0.98]'
              ]"
              style="border-radius: 8px;"
              @click="handleJobClick(job)"
            >
              <!-- Header: Service type + current badge -->
              <div class="flex items-start justify-between gap-3 mb-2.5">
                <div class="flex items-center gap-2 min-w-0 flex-1">
                  <div 
                    v-if="job.id === currentJobId" 
                    class="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0 animate-pulse"
                  ></div>
                  <h3 class="text-base font-bold text-[var(--foreground)] truncate">
                    {{ job.service_type }}
                  </h3>
                </div>
                <span 
                  v-if="job.id === currentJobId" 
                  class="text-[9px] px-2 py-1 bg-orange-500/25 text-orange-400 font-bold uppercase tracking-wider flex-shrink-0"
                  style="border-radius: 3px;"
                >
                  Current
                </span>
              </div>

              <!-- Metadata grid -->
              <div class="grid grid-cols-2 gap-2.5 mb-2.5">
                <!-- Date -->
                <div class="flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-sm text-[var(--accent)]">{{ formatDate(job.service_date) }}</span>
                </div>

                <!-- Cost -->
                <div class="flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-[var(--muted-foreground)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-sm font-semibold text-green-500 tabular-nums">₱{{ job.cost?.toFixed(2) || '0.00' }}</span>
                </div>
              </div>

              <!-- Notes preview (if exists) -->
              <div v-if="job.description" class="pt-2.5 border-t border-[var(--border)]/50">
                <p class="text-xs text-[var(--muted-foreground)] leading-relaxed line-clamp-2">
                  {{ job.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

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

// Group jobs by year for better scanability with large datasets
const jobsByYear = computed(() => {
  const groups = {}
  
  props.jobs.forEach(job => {
    const year = job.service_date ? job.service_date.split('-')[0] : 'Unknown'
    if (!groups[year]) {
      groups[year] = []
    }
    groups[year].push(job)
  })

  // Convert to array and sort by year descending
  return Object.keys(groups)
    .sort((a, b) => b.localeCompare(a))
    .map(year => ({
      year,
      jobs: groups[year]
    }))
})

function handleJobClick(job) {
  // Emit the job selection - ViewDetailsModal will handle switching the view
  emit('select-job', job)
  // Don't close the panel - keep it open for quick navigation
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
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

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