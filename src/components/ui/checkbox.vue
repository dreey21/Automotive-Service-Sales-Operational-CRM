<script setup>
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'

const props = defineProps({
  checked: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['update:checked'])

function handleClick() {
  if (!props.disabled) {
    emit('update:checked', !props.checked)
  }
}
</script>

<template>
  <button
    type="button"
    role="checkbox"
    :aria-checked="checked"
    :disabled="disabled"
    :id="id"
    @click="handleClick"
    :class="[
      'peer h-4 w-4 shrink-0 rounded border shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150',
      checked 
        ? 'bg-[var(--foreground)] border-[var(--foreground)] text-[var(--background)]' 
        : 'bg-[var(--background)] border-[var(--border)] hover:border-[var(--muted-foreground)]'
    ]"
    :style="{
      '--ring-color': 'var(--muted-foreground)'
    }"
  >
    <span class="flex items-center justify-center text-current">
      <Check v-if="checked" :size="12" :stroke-width="3" />
    </span>
  </button>
</template>

<style scoped>
button:focus-visible {
  ring: 2px solid var(--ring-color);
  ring-offset: 1px;
  outline: none;
}
</style>