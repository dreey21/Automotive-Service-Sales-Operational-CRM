<template>
    <div class="relative">
    <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
      <path stroke-linecap="round"stroke-linejoin="round"d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      :placeholder="placeholder"
      class="w-full h-11 pl-11 pr-3 bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent)] transition-colors"
      style="border-radius: 6px;"
    />
  </div>
</template>

<script setup>
defineProps({
    modelValue: {
        type : String,
        default: "",
    },
    placeholder: {
        type: String,
        default: "Search...",
    },
})

defineEmits(["update:modelValue"]);
</script>