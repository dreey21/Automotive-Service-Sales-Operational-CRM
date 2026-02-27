<template>
  <!-- Only shown when there's job history (2+ jobs for this plate) -->
  <div 
    v-if="recentJobs.length > 0" 
    ref="containerRef"
    class="bg-brand-sky/30 border-b border-brand-sky relative transition-all duration-300 ease-out overflow-hidden"
    :style="{ 
      height: isCollapsed ? '32px' : 'auto',
      maxHeight: isCollapsed ? '32px' : '500px'
    }"
  >
    <!-- Collapsed State Bar - Only visible when collapsed -->
    <div 
      v-if="isCollapsed"
      class="h-8 bg-white hover:bg-brand-sky/30 transition-colors flex items-center justify-between px-4 border-b border-brand-sky cursor-pointer"
      @click="expand"
    >
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-brand-ice transition-transform" :class="isCollapsed ? 'rotate-0' : 'rotate-180'" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        <span class="text-xs font-medium text-brand-ice">
          Service History
        </span>
        <span class="text-[10px] px-1.5 py-0.5 bg-brand-navy/10 text-brand-navy font-bold tabular-nums rounded">
          {{ totalCount }}
        </span>
      </div>
      <div class="text-[10px] text-brand-ice opacity-60">
        Tap to expand
      </div>
    </div>

    <!-- Content - Hidden when collapsed -->
    <div 
      v-show="!isCollapsed"
      class="transition-opacity duration-200"
      :style="{ 
        opacity: isCollapsed ? 0 : 1,
        pointerEvents: isCollapsed ? 'none' : 'auto'
      }"
    >
      <!-- MOBILE VERSION - Horizontal scrollable cards -->
      <div class="md:hidden px-4 pt-3 pb-2.5">
        <!-- Header with job count -->
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <svg class="w-3.5 h-3.5 text-brand-ice" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-[11px] font-semibold text-brand-ice uppercase tracking-wide">
              Recent History
            </p>
            <span class="text-[10px] px-1.5 py-0.5 bg-brand-navy/10 text-brand-navy font-bold tabular-nums" style="border-radius: 3px;">
              {{ totalCount }}
            </span>
          </div>
          
          <!-- View all button -->
          <button
            v-if="hasMoreThanRecent"
            @click="$emit('view-all')"
            class="text-[11px] font-semibold text-brand-navy transition-all flex items-center gap-1 hover:gap-1.5 active:scale-95"
          >
            View all
            <svg class="w-3 h-3 text-brand-navy transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <!-- Horizontal scrollable cards -->
        <div 
          ref="scrollContainer"
          @scroll="handleScroll"
          class="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory hide-scrollbar relative"
        >
          <!-- Swipe right hint -->
          <div 
            v-if="showSwipeHint && recentJobs.length > 1"
            class="absolute right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none animate-bounce-horizontal"
          >
            <div class="flex items-center gap-1 bg-brand-navy text-white px-2 py-1 rounded-full text-[10px] font-semibold shadow-lg">
              <span>Swipe</span>
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <div
            v-for="(job, index) in recentJobs"
            :key="job.id"
            :class="[
              'flex-shrink-0 w-[85vw] max-w-[280px] h-[88px] p-2.5 transition-all duration-300 snap-start cursor-pointer animate-slide-in flex flex-col',
              job.id === currentJobId 
                ? 'bg-brand-sky border border-brand-navy/30' 
                : 'bg-white border border-brand-sky hover:border-brand-ice hover:bg-brand-sky/40 active:scale-95'
            ]"
            style="border-radius: 6px;"
            @click="handleJobClick(job)"
          >
            <!-- Card Header -->
            <div class="flex items-center justify-between mb-1.5 flex-shrink-0">
              <div class="flex items-center gap-1.5 min-w-0 flex-1">
                <div 
                  v-if="job.id === currentJobId" 
                  class="w-1.5 h-1.5 bg-brand-navy rounded-full flex-shrink-0 animate-pulse"
                ></div>
                <svg class="w-3 h-3 text-brand-ice flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-xs font-semibold text-brand-navy truncate">{{ formatDate(job.service_date) }}</span>
              </div>
              <span 
                v-if="job.id === currentJobId" 
                class="text-[8px] px-1.5 py-0.5 bg-brand-navy/10 text-brand-navy font-bold uppercase tracking-wider flex-shrink-0"
                style="border-radius: 2px;"
              >
                Now
              </span>
            </div>
            
            <!-- Jobs done list -->
            <div class="flex-1 min-h-0 overflow-hidden">
              <div v-if="job.jobs_done && job.jobs_done.length > 0" class="space-y-0.5">
                <div 
                  v-for="(jobDone, index) in job.jobs_done.slice(0, 2)" 
                  :key="index"
                  class="flex items-start gap-1"
                >
                  <svg class="w-2 h-2 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-[11px] text-brand-navy leading-tight line-clamp-1">
                    {{ getJobLabel(jobDone) }}
                  </span>
                </div>
              </div>
              <div v-else class="text-[11px] text-brand-ice italic">
                No jobs
              </div>
            </div>
            
            <!-- Footer with overflow count -->
            <div 
              v-if="job.jobs_done && job.jobs_done.length > 2"
              class="pt-1 mt-auto flex-shrink-0 border-t border-brand-sky"
            >
              <span class="text-[10px] text-brand-ice font-medium">
                +{{ job.jobs_done.length - 2 }} more
              </span>
            </div>
          </div>
        </div>
        
        <!-- Progress bar indicator -->
        <div 
          v-if="recentJobs.length > 1"
          class="mt-2 px-4 -mx-4"
        >
          <div class="h-0.5 bg-brand-sky rounded-full overflow-hidden">
            <div 
              class="h-full bg-brand-navy rounded-full transition-all duration-200"
              :style="{ width: scrollProgress + '%' }"
            ></div>
          </div>
        </div>
        
        <!-- Drag Handle Bar -->
        <div 
          ref="handleRef"
          @mousedown="startDrag"
          @touchstart="startDrag"
          class="cursor-grab active:cursor-grabbing select-none mt-1"
          :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
        >
          <div class="h-8 bg-gradient-to-t from-brand-sky/60 to-transparent flex items-center justify-center relative">
            <div class="absolute inset-0 flex items-center justify-center animate-pulse-slow">
              <svg class="w-4 h-4 text-brand-ice/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </div>
            
            <div class="flex flex-col items-center gap-0.5 relative z-10">
              <div class="w-10 h-1 rounded-full bg-brand-ice/40 transition-colors hover:bg-brand-navy/30"></div>
              <div class="text-[9px] pt-4 text-brand-ice uppercase tracking-widest font-semibold">
                Swipe up to hide
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- DESKTOP: Compact horizontal timeline -->
      <div class="hidden md:block px-6 pt-3 pb-2.5">
        <div class="flex items-center gap-3">
          <!-- Icon + Label -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <svg class="w-3.5 h-3.5 text-brand-ice" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-xs font-semibold text-brand-ice uppercase tracking-wide">
              Recent
            </p>
          </div>

          <!-- Horizontal scrollable date pills -->
          <div class="flex items-center gap-2 overflow-x-auto hide-scrollbar flex-1">
            <button
              v-for="job in recentJobs"
              :key="job.id"
              :class="[
                'flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium transition-all duration-200 flex-shrink-0 animate-slide-in',
                job.id === currentJobId 
                  ? 'bg-brand-navy text-white border border-brand-navy' 
                  : 'bg-white text-brand-navy border border-brand-sky hover:border-brand-ice hover:bg-brand-sky active:scale-95'
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
              
              <span class="font-semibold tabular-nums whitespace-nowrap">
                {{ formatDateCompact(job.service_date) }}
              </span>
            </button>
          </div>

          <!-- View all button -->
          <button
            v-if="hasMoreThanRecent"
            @click="$emit('view-all')"
            class="group flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-brand-navy hover:bg-brand-sky transition-colors duration-200 flex-shrink-0 active:scale-95 border border-brand-sky"
            style="border-radius: 5px;"
          >
            <span class="opacity-60 text-brand-ice transition-opacity group-hover:opacity-80">[{{ totalCount }}]</span>
            <span class="text-brand-navy pl-1">All</span>
            <svg class="w-3 h-3 text-brand-navy transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'

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

// Refs
const containerRef = ref(null)
const handleRef = ref(null)
const scrollContainer = ref(null)
const currentScrollIndex = ref(0)
const showSwipeHint = ref(true)
const scrollProgress = ref(0)

// Drag state
const isDragging = ref(false)
const startY = ref(0)
const startHeight = ref(0)
const isCollapsed = ref(true)

const jobLabels = {
  replace_evaporator_front: 'Evaporator Front',
  replace_evaporator_rear: 'Evaporator Rear',
  replace_condenser: 'Condenser',
  replace_compressor: 'Compressor',
  replace_blower_motor: 'Blower Motor',
  replace_expansion_valve: 'Expansion Valve',
  replace_pulley_assembly: 'Pulley Assembly',
  replace_fan_motor: 'Fan Motor',
  replace_suction_hose_assembly: 'Suction Hose Assembly',
  replace_fan_belt: 'Fan Belt',
  replace_filter_drier: 'Filter Drier',
  replace_discharge_hose_suction: 'Discharge Hose Suction',
  replace_ecv: 'ECV',
  replace_oring: 'O-ring',
  replace_radiator: 'Radiator',
  replace_cabin_filter: 'Cabin Filter',
  replace_magnetic: 'Magnetic',
  pulldown_evaporator: 'Pulldown Evaporator',
  pulldown_condenser: 'Pulldown Condenser',
  pulldown_compressor: 'Pulldown Compressor',
  flushing_system: 'Flushing System',
  install_cabin_filter: 'Install Cabin Filter',
  cleaning: 'Cleaning',
  freon: 'Freon'
}

const recentJobs = computed(() => props.jobs.slice(0, props.maxRecent))
const totalCount = computed(() => props.jobs.length)
const hasMoreThanRecent = computed(() => props.jobs.length > props.maxRecent)

function startDrag(e) {
  if (isCollapsed.value) return
  
  isDragging.value = true
  startY.value = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY
  
  if (containerRef.value) {
    startHeight.value = containerRef.value.offsetHeight
  }
  
  if (e.type === 'touchstart') {
    document.addEventListener('touchmove', handleDrag, { passive: false })
    document.addEventListener('touchend', endDrag)
  } else {
    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', endDrag)
  }
  
  e.preventDefault()
}

function handleDrag(e) {
  if (!isDragging.value) return
  const currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY
  const deltaY = currentY - startY.value
  if (deltaY < -30) collapse()
  e.preventDefault()
}

function endDrag() {
  isDragging.value = false
  document.removeEventListener('touchmove', handleDrag)
  document.removeEventListener('touchend', endDrag)
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', endDrag)
}

function collapse() {
  isCollapsed.value = true
  endDrag()
}

function expand() {
  isCollapsed.value = false
}

function handleScroll() {
  if (!scrollContainer.value) return
  if (showSwipeHint.value) showSwipeHint.value = false
  
  const container = scrollContainer.value
  const cards = container.children
  if (cards.length === 0) return
  
  const cardWidth = cards[0].offsetWidth + 12
  const scrollLeft = container.scrollLeft
  const index = Math.round(scrollLeft / cardWidth)
  currentScrollIndex.value = Math.min(index, recentJobs.value.length - 1)
  
  const maxScroll = container.scrollWidth - container.clientWidth
  scrollProgress.value = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0
}

function handleJobClick(job) {
  if (job.id !== props.currentJobId) {
    emit('select-job', job)
    
    if (scrollContainer.value) {
      const cards = Array.from(scrollContainer.value.children).filter(
        el => !el.classList.contains('absolute')
      )
      const index = recentJobs.value.findIndex(j => j.id === job.id)
      if (index !== -1 && cards[index]) {
        cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
      }
    }
  }
}

function getJobLabel(jobKey) {
  return jobLabels[jobKey] || jobKey
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date)
  } catch { return 'Invalid Date' }
}

function formatDateCompact(dateString) {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    const now = new Date()
    const showYear = date.getFullYear() !== now.getFullYear()
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      ...(showYear && { year: 'numeric' })
    }).format(date)
  } catch { return 'Invalid Date' }
}

onBeforeUnmount(() => {
  document.removeEventListener('touchmove', handleDrag)
  document.removeEventListener('touchend', endDrag)
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', endDrag)
})
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.select-none {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

@keyframes slide-in {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}
.animate-slide-in { animation: slide-in 0.4s ease-out; }

@keyframes bounce-horizontal {
  0%, 100% { transform: translateX(0) translateY(-50%); }
  50% { transform: translateX(-8px) translateY(-50%); }
}
.animate-bounce-horizontal { animation: bounce-horizontal 1.5s ease-in-out infinite; }

@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }

.animate-slide-in:nth-child(1) { animation-delay: 0ms; }
.animate-slide-in:nth-child(2) { animation-delay: 50ms; }
.animate-slide-in:nth-child(3) { animation-delay: 100ms; }
.animate-slide-in:nth-child(4) { animation-delay: 150ms; }
.animate-slide-in:nth-child(5) { animation-delay: 200ms; }
</style>