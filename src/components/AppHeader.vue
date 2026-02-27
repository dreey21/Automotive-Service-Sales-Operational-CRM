<template>
  <!-- Desktop Header -->
  <header class="hidden md:block sticky top-0 z-30 bg-[var(--background)]">
    <div class="h-[68px] px-6 lg:px-8 flex items-center justify-between">
      <!-- Menu Toggle Button -->
      <button
        @click="toggleSidebar"
        class="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        aria-label="Toggle sidebar"
      >
        <Bars3Icon class="w-6 h-6" />
      </button>

      <!-- Time and Date Display -->
      <div class="px-5 py-2.5 rounded-full bg-brand-sky/60 border border-border backdrop-blur-sm flex items-center gap-3">
        <!-- Date Section -->
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-brand-ice" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-sm font-medium text-foreground tabular-nums">
            {{ currentDate }}
          </span>
        </div>

        <!-- Separator -->
        <div class="w-px h-5 bg-border"></div>

        <!-- Time Section -->
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-brand-ice" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm font-semibold text-brand-navy tabular-nums tracking-wide">
            {{ currentTime }}
          </span>
        </div>
      </div>
    </div>
  </header>


</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Bars3Icon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['toggle-sidebar'])

const currentTime = ref('')
const currentDate = ref('')
let timeInterval = null

const updateDateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
  currentDate.value = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  updateDateTime()
  timeInterval = setInterval(updateDateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})

const toggleSidebar = () => {
  emit('toggle-sidebar')
}
</script>