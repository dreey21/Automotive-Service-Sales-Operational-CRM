<script setup>
import { AlertDialogAction } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps({
  class: { type: null, required: false },
})
</script>

<template>
  <AlertDialogAction
    :class="cn(
      'inline-flex h-10 items-center justify-center rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-[var(--accent)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50',
      props.class
    )"
  >
    <slot />
  </AlertDialogAction>
</template>
