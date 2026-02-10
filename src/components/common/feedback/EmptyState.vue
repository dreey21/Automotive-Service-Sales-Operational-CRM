<template>  
    <div class="text-center py-20 bg-[var(--card)] border border-[var(--border)]" style="border-radius: 6px;">
      <svg class="w-14 h-14 mx-auto mb-4 text-[var(--muted-foreground)] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-[var(--foreground)] font-medium mb-1">
        {{ hasFilters ? 'No matching records' : 'No sales records' }}
      </p>
      <p class="text-[var(--muted-foreground)] text-sm">
        {{ hasFilters ? 'Try adjusting your filters' : 'Tap "Add Record" to create your first entry' }}
      </p>
    </div>
</template>

<script setup>
    defineProps({
        hasFilters: {
            type: Boolean,
            required: true
        }
    })
</script>
