<template>
  <div class="px-4 py-3.5 bg-[var(--foreground)] border-b border-white/10 flex-shrink-0" style="position: relative; z-index: 1; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.25);">
    <div class="flex items-center w-full">
      <template v-for="(step, index) in steps" :key="step.number">
        <!-- Step Circle -->
        <div class="relative flex items-center flex-shrink-0">
          <div
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300',
              step.number < currentStep
                ? 'bg-green-500/20 border-2 border-green-500'
                : step.number === currentStep
                  ? 'bg-white border-2 border-white'
                  : 'bg-white/10 border-2 border-white/20'
            ]"
          >
            <svg v-if="step.number < currentStep" class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else :class="[
              'text-xs font-bold',
              step.number === currentStep ? 'text-brand-navy' : 'text-white/40'
            ]">
              {{ step.number }}
            </span>
          </div>
          <!-- Label inline to the right of the active circle only -->
          <span
            v-if="step.number === currentStep"
            class="ml-2 text-sm font-semibold text-white whitespace-nowrap"
            style="font-family: 'Barlow Condensed', sans-serif; letter-spacing: 0.05em; text-transform: uppercase;"
          >
            {{ step.label }}
          </span>
        </div>

        <!-- Connector Line -->
        <div
          v-if="index < steps.length - 1"
          :class="[
            'h-px flex-1 mx-3 transition-colors duration-300',
            step.number < currentStep ? 'bg-green-500' : 'bg-white/20'
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