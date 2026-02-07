<script setup>
import { Primitive } from 'reka-ui'

const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  as: {
    type: [String, Object],
    default: 'div'
  },
  asChild: {
    type: Boolean,
    default: false
  },
  class: String
})
</script>

<template>
  <Primitive :as="as" :as-child="asChild" :class="props.class">
    <slot :value="value" />
  </Primitive>
</template>