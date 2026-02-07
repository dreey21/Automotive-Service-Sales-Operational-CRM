<template>
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-2 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-2 scale-95"
  >
    <div
      v-if="show"
      class="fixed top-4 left-4 right-4 md:top-6 md:left-1/2 md:right-auto md:-translate-x-1/2 z-[200] md:max-w-md"
    >
      <div 
        :class="[
          'flex items-center gap-3 px-4 py-2.5 rounded-lg shadow-2xl border backdrop-blur-sm',
          variant === 'success' 
            ? 'bg-gray-900/95 border-green-500/30' 
            : variant === 'error'
            ? 'bg-gray-900/95 border-red-500/30'
            : 'bg-gray-900/95 border-blue-500/30'
        ]"
      >
        <!-- Icon with colored background -->
        <div 
          :class="[
            'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
            variant === 'success' 
              ? 'bg-green-500/15' 
              : variant === 'error'
              ? 'bg-red-500/15'
              : 'bg-blue-500/15'
          ]"
        >
          <!-- Success Icon -->
          <svg 
            v-if="variant === 'success'" 
            class="w-4 h-4 text-green-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            stroke-width="2.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          
          <!-- Error Icon -->
          <svg 
            v-else-if="variant === 'error'" 
            class="w-4 h-4 text-red-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            stroke-width="2.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>

          <!-- Info Icon -->
          <svg 
            v-else 
            class="w-4 h-4 text-blue-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            stroke-width="2.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
        </div>

        <!-- Message -->
        <div class="flex-1">
          <p class="text-sm text-white font-medium leading-snug">
            {{ message }}
          </p>
        </div>

        <!-- Close Button -->
        <button
          v-if="dismissible"
          @click="close"
          class="flex-shrink-0 p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <svg class="w-4 h-4 text-gray-400 hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  message: { type: String, required: true },
  variant: { type: String, default: 'success' }, // 'success', 'error', 'info'
  duration: { type: Number, default: 3000 },
  dismissible: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])

let timeoutId = null

function close() {
  emit('close')
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    // Auto-dismiss after duration
    timeoutId = setTimeout(() => {
      close()
    }, props.duration)
  }
})

onMounted(() => {
  if (props.show) {
    timeoutId = setTimeout(() => {
      close()
    }, props.duration)
  }
})
</script>