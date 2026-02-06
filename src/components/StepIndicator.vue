<template>
  <div class="px-6 py-4 bg-[var(--background-alt)] border-b border-[var(--border)]">
    <div class="flex items-center w-full">
      <template v-for="(step, index) in steps" :key="step.number">
        <!-- Step Circle -->
        <div class="flex flex-col items-center flex-shrink-0">
          <div 
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
              step.number < currentStep ? 'bg-green-500/20 border-2 border-green-500' :
              step.number === currentStep ? 'bg-[var(--accent)] border-2 border-[var(--accent)]' :
              'bg-[var(--muted)] border-2 border-[var(--border)]'
            ]"
          >
            <svg v-if="step.number < currentStep" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else :class="[
              'text-sm font-bold',
              step.number === currentStep ? 'text-[var(--accent-foreground)]' : 'text-[var(--muted-foreground)]'
            ]">
              {{ step.number }}
            </span>
          </div>
          <span :class="[
            'text-xs font-medium mt-1.5 whitespace-nowrap',
            step.number === currentStep ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'
          ]">
            {{ step.label }}
          </span>
        </div>
        
        <!-- Connector Line -->
        <div 
          v-if="index < steps.length - 1"
          :class="[
            'h-0.5 flex-1 mx-3 transition-colors duration-300',
            step.number < currentStep ? 'bg-green-500' : 'bg-[var(--border)]'
          ]"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentStep: {
    type: Number,
    required: true
  },
  steps: {
    type: Array,
    default: () => [
      { number: 1, label: 'Client' },
      { number: 2, label: 'Services' },
      { number: 3, label: 'Billing' }
    ]
  }
})
</script>