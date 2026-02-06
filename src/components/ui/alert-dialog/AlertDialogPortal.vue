<script setup>
import { AlertDialogPortal, useForwardProps } from 'reka-ui'

const props = defineProps({
  to: { type: [String, Object], required: false },
})

const forwarded = useForwardProps(props)
</script>

<template>
  <AlertDialogPortal v-bind="forwarded">
    <slot />
  </AlertDialogPortal>
</template>
