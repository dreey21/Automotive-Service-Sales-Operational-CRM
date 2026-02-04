<template>
  <!-- Only shown when there's job history (2+ jobs for this plate) -->
  <div 
    v-if="recentJobs.length > 0" 
    class="bg-[var(--card)]/30 border-b border-[var(--border)]/50"
  >
    <!-- MOBILE VERSION - Horizontal scrollable cards with animated dots -->
    <div class="md:hidden px-4 py-3">
      <!-- Header with job count -->
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
            Recent Service History
          </p>
          <span class="text-xs px-2 py-0.5 bg-[var(--accent)]/20 text-[var(--accent)] font-bold tabular-nums" style="border-radius: 4px;">
            {{ totalCount }}
          </span>
        </div>
        
        <!-- View all button -->
        <button
          v-if="hasMoreThanRecent"
          @click="$emit('view-all')"
          class="text-xs font-semibold text-white transition-all flex items-center gap-1 hover:gap-1.5 active:scale-95"
        >
          View all
          <svg class="w-3.5 h-3.5 text-white transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <!-- Horizontal scrollable cards -->
      <div 
        ref="scrollContainer"
        @scroll="handleScroll"
        class="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory hide-scrollbar"
      >
        <div
          v-for="job in recentJobs"
          :key="job.id"
          :class="[
            'flex-shrink-0 w-64 p-3 border transition-all duration-300 snap-start cursor-pointer animate-slide-in',
            job.id === currentJobId 
              ? 'bg-[var(--accent)]/15 border-[var(--accent)] ring-1 ring-[var(--accent)]/30' 
              : 'bg-gray-800/40 border-gray-700/50 hover:border-[var(--accent)]/40 hover:bg-gray-800/60 active:scale-95'
          ]"
          style="border-radius: 8px;"
          @click="job.id !== currentJobId && $emit('select-job', job)"
        >
          <!-- Card Header -->
          <div class="flex items-start justify-between gap-1 mb-1">
            <div class="flex items-center gap-2 min-w-0 flex-1">
              <div 
                v-if="job.id === currentJobId" 
                class="w-2 h-2 bg-[var(--accent)] rounded-full flex-shrink-0 animate-pulse"
              ></div>
            </div>
            <span 
              v-if="job.id === currentJobId" 
              class="text-[9px] px-1.5 py-0.5 bg-[var(--accent)]/25 text-[var(--accent)] font-bold uppercase tracking-wider flex-shrink-0"
              style="border-radius: 3px;"
            >
              Now
            </span>
          </div>
          
          <!-- Date -->
          <div class="flex items-center gap-1.5 mb-1">
            <svg class="w-4 h-4 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="text-base font-medium text-white">{{ formatDate(job.service_date) }}</span>
          </div>
          
          <!-- Jobs done count -->
          <div class="pt-2 border-t border-[var(--border)]/50">
            <div class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-xs font-semibold text-[var(--foreground)]">
                {{ job.jobs_done?.length || 0 }} job{{ (job.jobs_done?.length || 0) !== 1 ? 's' : '' }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Animated scroll indicator dots -->
      <div v-if="recentJobs.length > 1" class="flex items-center justify-center gap-1.5 mt-2">
        <div 
          v-for="(job, index) in recentJobs" 
          :key="`dot-${job.id}`"
          :class="[
            'rounded-full transition-all duration-300',
            index === currentScrollIndex 
              ? 'w-6 h-1.5 bg-[var(--accent)]' 
              : 'w-1.5 h-1.5 bg-[var(--muted-foreground)]/30 hover:bg-[var(--muted-foreground)]/50'
          ]"
        ></div>
      </div>
    </div>

    <!-- DESKTOP: Compact horizontal timeline -->
    <div class="hidden md:block px-6 py-2.5">
      <div class="flex items-center gap-3">
        <!-- Icon + Label -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <svg class="w-3.5 h-3.5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-xs font-semibold text-[var(--muted-foreground)]/70 uppercase tracking-wide">
            Recent
          </p>
        </div>

        <!-- Horizontal scrollable date/job pills -->
        <div class="flex items-center gap-2 overflow-x-auto hide-scrollbar flex-1">
          <button
            v-for="job in recentJobs"
            :key="job.id"
            :class="[
              'flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium transition-all duration-200 flex-shrink-0 animate-slide-in',
              job.id === currentJobId 
                ? 'bg-[var(--accent)] text-[var(--accent-foreground)] border border-[var(--accent)]' 
                : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:border-[var(--accent)]/40 hover:bg-gray-800/80 hover:text-white active:scale-95'
            ]"
            style="border-radius: 5px;"
            @click="handleJobClick(job)"
            :disabled="job.id === currentJobId"
          >
            <!-- Active indicator -->
            <svg 
              v-if="job.id === currentJobId"
              class="w-2 h-2 text-white animate-pulse flex-shrink-0" 
              fill="currentColor" 
              viewBox="0 0 8 8"
            >
              <circle cx="4" cy="4" r="3" />
            </svg>
            
            <!-- Date -->
            <span class="font-semibold tabular-nums whitespace-nowrap">
              {{ formatDateCompact(job.service_date) }}
            </span>
          </button>
        </div>

        <!-- View all button -->
        <button
          v-if="hasMoreThanRecent"
          @click="$emit('view-all')"
          class="group flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors duration-200 flex-shrink-0 active:scale-95"
          style="border-radius: 5px;"
        >
          <span class="opacity-60 text-white transition-opacity group-hover:opacity-80">[{{ totalCount }}]</span>
          <span class="text-white pl-1">All</span>
          <svg class="w-3 h-3 text-white transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
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
  currentJobId: {
    type: [Number, String],
    required: true
  },
  maxRecent: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['select-job', 'view-all'])

const scrollContainer = ref(null)
const currentScrollIndex = ref(0)

// Only show the most recent jobs (max 5)
const recentJobs = computed(() => {
  return props.jobs.slice(0, props.maxRecent)
})

const totalCount = computed(() => props.jobs.length)

const hasMoreThanRecent = computed(() => {
  return props.jobs.length > props.maxRecent
})

function handleScroll() {
  if (!scrollContainer.value) return
  
  const container = scrollContainer.value
  const cardWidth = 264 + 10 // 264px (w-64) + 10px gap
  const scrollLeft = container.scrollLeft
  
  // Calculate which card is most visible
  const index = Math.round(scrollLeft / cardWidth)
  currentScrollIndex.value = Math.min(index, recentJobs.value.length - 1)
}

function handleJobClick(job) {
  if (job.id !== props.currentJobId) {
    emit('select-job', job)
  }
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
    
    // Compact format: "Jan 15" or "Jan 15 '23" for older dates
    const now = new Date()
    const showYear = date.getFullYear() !== now.getFullYear()
    
    if (showYear) {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date)
    }
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
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

/* Custom animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slide-in 0.4s ease-out;
}

/* Stagger animation for multiple items */
.animate-slide-in:nth-child(1) { animation-delay: 0ms; }
.animate-slide-in:nth-child(2) { animation-delay: 50ms; }
.animate-slide-in:nth-child(3) { animation-delay: 100ms; }
.animate-slide-in:nth-child(4) { animation-delay: 150ms; }
.animate-slide-in:nth-child(5) { animation-delay: 200ms; }

</style>