<template>
        <span 
          :class="[
            'text-[10px] px-2 py-0.5 rounded font-medium whitespace-nowrap',
            condition === 'Brand New' ? 'bg-green-500/20 text-green-400' :
            condition === 'Surplus' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-purple-500/20 text-purple-400'
          ]"
        >
          {{ condition }}
        </span>
</template>
<script setup>
    defineProps ({
        condition: {
            type: String,
            default: null
        }
    })
</script>