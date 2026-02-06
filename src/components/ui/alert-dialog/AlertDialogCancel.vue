<script setup>
import { AlertDialogCancel } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps({
  class: { type: null, required: false },
})
</script>

<template>
  <AlertDialogCancel
    :class="cn(
      'mt-2 inline-flex h-10 items-center justify-center rounded-lg border-2 border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-sm font-bold text-[var(--foreground)] transition-all hover:border-[var(--border-hover)] hover:bg-[var(--muted)]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50 sm:mt-0',
      props.class
    )"
  >
    <slot />
  </AlertDialogCancel>
</template>
