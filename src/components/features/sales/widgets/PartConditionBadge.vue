<template>
  <span
    :class="[
      'text-[10px] px-2 py-0.5 rounded font-semibold whitespace-nowrap',
      condition === 'Brand New' ? 'bg-emerald-100 text-emerald-700' :
      condition === 'Surplus'   ? 'bg-amber-100 text-amber-700' :
                                  'bg-brand-sky text-brand-navy'
    ]"
  >
    {{ condition }}
  </span>
</template>

<script setup>
defineProps({
  condition: {
    type: String,
    default: null
  }
})
</script>