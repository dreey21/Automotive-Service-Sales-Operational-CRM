<template>
  <!-- Desktop Header - Alternative Design -->
  <header class="hidden md:block sticky top-0 z-30 bg-gray-950">
    <div class="h-[68px] px-6 lg:px-8 flex items-center justify-between">
      <!-- Menu Toggle Button -->
      <button
        @click="toggleSidebar"
        class="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
        aria-label="Toggle sidebar"
      >
        <Bars3Icon class="w-6 h-6" />
      </button>

      <!-- Time and Date Display - Alternative: Single Combined Pill -->
      <div class="px-5 py-2.5 rounded-full bg-gray-800/60 border border-gray-700/50 backdrop-blur-sm flex items-center gap-3">
        <!-- Date Section -->
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-sm font-medium text-gray-300 tabular-nums">
            {{ currentDate }}
          </span>
        </div>

        <!-- Separator -->
        <div class="w-px h-5 bg-gray-700"></div>

        <!-- Time Section -->
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm font-semibold text-white tabular-nums tracking-wide">
            {{ currentTime }}
          </span>
        </div>
      </div>
    </div>
  </header>

  <!-- Mobile Header -->
  <header class="relative border-b border-gray-800 backdrop-blur-xl bg-gray-900 md:hidden">
    <div class="px-4 py-3.5 flex items-center gap-3">
      <img src="/assets/logo.png" alt="4DM Logo" class="w-10 h-10 object-contain flex-shrink-0" />
      <div class="flex-1 min-w-0">
        <h1 class="text-base font-bold text-white tracking-tight leading-tight">
          <span class="text-red-500">4DM</span>
          <span class="ml-1">Auto Care Center</span>
        </h1>
        <p class="text-xs text-gray-400 mt-0.5">
          {{ pageTitleMobile }}
        </p>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Bars3Icon } from '@heroicons/vue/24/outline'

const route = useRoute()
const emit = defineEmits(['toggle-sidebar'])

// Time and date state
const currentTime = ref('')
const currentDate = ref('')
let timeInterval = null

// Format time and date
const updateDateTime = () => {
  const now = new Date()
  
  // Format time (e.g., "10:04 PM")
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
  
  // Format date (e.g., "Sun, Feb 1")
  currentDate.value = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

// Initialize and update time
onMounted(() => {
  updateDateTime()
  // Update every second
  timeInterval = setInterval(updateDateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

// Sidebar toggle
const toggleSidebar = () => {
  emit('toggle-sidebar')
}

// Define page metadata for each route
const pageMetadata = {
  '/': {
    mobileSuffix: 'Dashboard'
  },
  '/sales': {
    mobileSuffix: 'Sales Records'
  },
  '/reports': {
    mobileSuffix: 'Reports'
  },
  '/account': {
    mobileSuffix: 'Account'
  }
}

const pageTitleMobile = computed(() => {
  return pageMetadata[route.path]?.mobileSuffix || 'Dashboard'
})
</script>