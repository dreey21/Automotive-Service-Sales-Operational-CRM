<template>
<tr
    class="relative border-b border-border last:border-b-0 hover:bg-brand-sky/40 hover:border-brand-ice/50 transition-all duration-200 cursor-pointer group"
    @click="handleView"
>
    <!-- Loading Overlay -->
    <td v-if="service.loading" class="absolute inset-0 bg-card/90 flex items-center justify-center z-10" colspan="8">
    <div class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </td>

    <!-- Plate Number -->
    <td class="px-4 py-2 transition-transform duration-200">
    <div class="flex items-center gap-2">
        <svg class="w-4 h-4 flex-shrink-0 text-brand-ice opacity-0 group-hover:opacity-100 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <div class="flex items-center gap-1.5 flex-1 min-w-0">
        <span class="text-sm font-extrabold text-foreground tracking-wider whitespace-nowrap group-hover:text-brand-navy transition-colors duration-200">
            {{ service.plate_number || '—' }}
        </span>
        <JobHistoryBadge v-if="hasJobHistory(service.plate_number, database)" :job-count="getJobCount(service.plate_number, database)"/>
        </div>
    </div>
    </td>

    <!-- Date -->
    <td class="px-4 py-2">
    <span class="text-sm font-bold text-muted-foreground">{{ formatDate(service.service_date) }}</span>
    </td>

    <!-- Jobs Done -->
    <td class="px-4 py-2">
    <span class="text-sm font-medium text-foreground">{{ getJobsSummary(service.jobs_done) }}</span>
    </td>
    
    <!-- Phone -->
    <td class="px-4 py-2">
    <span v-if="service.phone" class="text-sm font-medium text-muted-foreground">{{ service.phone }}</span>
    <span v-else class="text-sm text-muted-foreground opacity-50">—</span>
    </td>
    
    <!-- Part Details -->
    <td class="px-4 py-2">
    <div v-if="hasPartConditions(service)" class="flex flex-wrap gap-1">
        <template v-if="getPartDetailsDisplay(service, 3).visible.length > 0">
        <PartConditionBadge
            v-for="([job, condition], index) in getPartDetailsDisplay(service, 3).visible" 
            :key="job" 
            :condition="condition"
            />
        <span 
            v-if="getPartDetailsDisplay(service, 3).remaining > 0" 
            class="text-[10px] px-2 py-0.5 rounded font-medium whitespace-nowrap bg-muted text-muted-foreground"
        >
            +{{ getPartDetailsDisplay(service, 3).remaining }} more
        </span>
        </template>
    </div>
    <span v-else class="text-sm text-muted-foreground opacity-50">—</span>
    </td>

    <!-- Cost -->
    <td class="px-4 py-2">
    <span class="text-base font-extrabold text-green-600 tabular-nums">₱{{ service.cost.toFixed(2) }}</span>
    </td>

    <!-- Car Model -->
    <td class="px-4 py-2">
    <span v-if="service.car_model" class="text-sm font-semibold text-foreground">{{ service.car_model }}</span>
    <span v-else class="text-sm text-muted-foreground opacity-50">—</span>
    </td>

    <!-- Row Actions -->
    <td class="px-2 py-2" @click.stop>
    <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
        @click="handleEdit"
        class="p-1.5 text-muted-foreground hover:text-brand-navy hover:bg-brand-sky transition-colors"
        style="border-radius: 4px;"
        title="Edit"
        >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        </button>
        <button
        @click="handleDelete"
        class="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
        style="border-radius: 4px;"
        title="Delete"
        >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        </button>
    </div>
    </td>
</tr> 
</template>

<script setup>
//Component Imports
import JobHistoryBadge from '../widgets/JobHistoryBadge.vue'
import PartConditionBadge from '../widgets/PartConditionBadge.vue'
//Utils Imports
import { getJobsSummary, formatDate } from '@/utils/formatters'
import { hasPartConditions, getPartDetailsDisplay } from '@/utils/partConditions'
import { hasJobHistory, getJobCount } from '@/utils/jobHistory'

    const props = defineProps({
        service: Object,
        database: Array
    })

    const emit = defineEmits(['view', 'edit', 'delete'])

    const handleView = () => {
        emit ('view' , props.service)
    }

    const handleEdit = () => {
        emit('edit', props.service)
    }

    const handleDelete = () => {
        emit('delete', props.service.id)
    }
</script>