<template>
  <!-- Only shown when there's job history (2+ jobs for this plate) -->
  <div 
    v-if="recentJobs.length > 0" 
    class="bg-[var(--card)]/50 border-b border-[var(--border)] px-4 py-3"
  >
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
      
      <!-- View all button - opens full history modal -->
      <button
        v-if="hasMoreThanRecent"
        @click="$emit('view-all')"
        class="text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors flex items-center gap-1"
      >
        View all
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
    
    <!-- Horizontal scrollable recent jobs (max 5) -->
    <div class="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory hide-scrollbar">
      <div
        v-for="job in recentJobs"
        :key="job.id"
        :class="[
          'flex-shrink-0 w-64 p-3 border transition-all snap-start cursor-pointer',
          job.id === currentJobId 
            ? 'bg-orange-500/15 border-orange-500/50 ring-2 ring-orange-500/30' 
            : 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--accent)]/40 active:scale-95'
        ]"
        style="border-radius: 8px;"
        @click="job.id !== currentJobId && $emit('select-job', job)"
      >
        <!-- Card Header -->
        <div class="flex items-start justify-between gap-2 mb-2">
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <!-- Current indicator dot -->
            <div 
              v-if="job.id === currentJobId" 
              class="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0 animate-pulse"
            ></div>
            <p class="text-lg font-bold text-[var(--foreground)] truncate">
              {{ job.service_type }}
            </p>
          </div>
          <!-- Current badge -->
          <span 
            v-if="job.id === currentJobId" 
            class="text-[9px] px-1.5 py-0.5 bg-orange-500/25 text-orange-400 font-bold uppercase tracking-wider flex-shrink-0"
            style="border-radius: 3px;"
          >
            Now
          </span>
        </div>
        
        <!-- Date -->
        <div class="flex items-center gap-1.5 mb-1">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-base font-medium text-white">{{ formatDate(job.service_date) }}</span>
        </div>
        
        <!-- Notes preview -->
        <div v-if="job.description" class="pt-2 border-t border-[var(--border)]/50">
          <p class="text-xs text-[var(--muted-foreground)] leading-snug line-clamp-2">
            {{ job.description }}
          </p>
        </div>
        <div v-else class="pt-2 border-t border-[var(--border)]/50">
          <p class="text-xs text-[var(--muted-foreground)]/50 italic">
            No notes
          </p>
        </div>
      </div>
    </div>
    
    <!-- Scroll hint dots -->
    <div class="flex items-center justify-center gap-1 mt-2">
      <div class="w-1 h-1 rounded-full bg-[var(--muted-foreground)]/30"></div>
      <div class="w-1 h-1 rounded-full bg-[var(--muted-foreground)]/30"></div>
      <div class="w-1 h-1 rounded-full bg-[var(--muted-foreground)]/30"></div>
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
  currentJobId: {
    type: [Number, String],
    required: true
  },
  maxRecent: {
    type: Number,
    default: 5
  }
})

defineEmits(['select-job', 'view-all'])

// Only show the most recent jobs (max 5)
const recentJobs = computed(() => {
  return props.jobs.slice(0, props.maxRecent)
})

const totalCount = computed(() => props.jobs.length)

const hasMoreThanRecent = computed(() => {
  return props.jobs.length > props.maxRecent
})

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
</style>