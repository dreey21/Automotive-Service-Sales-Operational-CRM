<script setup>
import { AlertDialogTitle } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps({
  class: { type: null, required: false },
})
</script>

<template>
  <AlertDialogTitle :class="cn('text-lg font-bold text-[var(--foreground)]', props.class)">
    <slot />
  </AlertDialogTitle>
</template>
