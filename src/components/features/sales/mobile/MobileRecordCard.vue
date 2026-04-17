<template>
  <div
    class="relative overflow-hidden"
    style="border-radius: 6px;"
  >
    <!-- Action Buttons Background -->
    <div class="absolute inset-0 flex items-center gap-2 justify-end pr-2 pl-2 bg-brand-sky">
      <button
        :ref="el => setButtonRef(el, service.id, 'edit')"
        @click.stop="handleEdit(); closeSwipe(service.id)"
        class="w-14 h-11 flex flex-col items-center justify-center gap-0.5 rounded-md active:opacity-80 transition-opacity duration-150"
        :style="{
          opacity: 0,
          transform: 'scale(0.8)',
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out'
        }"
      >
        <svg class="w-4 h-4 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <span class="text-[8px] font-semibold text-brand-navy uppercase tracking-wide">Edit</span>
      </button>
      <button
        :ref="el => setButtonRef(el, service.id, 'delete')"
        @click.stop="handleDelete(); closeSwipe(service.id)"
        class="w-14 h-11 flex flex-col items-center justify-center gap-0.5 rounded-md active:opacity-80 transition-opacity duration-150"
        :style="{
          opacity: 0,
          transform: 'scale(0.8)',
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out'
        }"
      >
        <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span class="text-[8px] font-semibold text-red-500 uppercase tracking-wide">Delete</span>
      </button>
    </div>

    <!-- Swipeable Card Content -->
    <div
      :ref="el => setCardRef(el, service.id)"
      class="relative border border-border touch-pan-y swipe-card bg-card-solid"
      style="border-radius: 6px; transition: transform 0.25s cubic-bezier(0.4, 0.0, 0.2, 1); will-change: transform;"
      :data-service-id="service.id"
      @touchstart="handleTouchStart($event, service.id)"
      @touchmove="handleTouchMove($event, service.id)"
      @touchend="handleTouchEnd($event, service.id)"
      @click="handleCardClick(service)"
    >
      <div class="p-2.5">
        <!-- Loading Overlay -->
        <div v-if="service.loading" class="absolute inset-0 flex items-center justify-center z-10 bg-card-solid/90" style="border-radius: 6px;">
          <div class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Card Content -->
        <div>
          <!-- Row 1: Plate Number + Date -->
          <div class="flex items-baseline justify-between mb-1">
            <div class="flex items-center gap-1.5 flex-1 min-w-0">
              <h3 class="text-[15px] font-extrabold text-foreground truncate leading-tight font-mono tracking-wider">
                {{ service.plate_number || 'Walk-in' }}
              </h3>
              <JobHistoryBadge 
                v-if="hasJobHistory(service.plate_number, database)" 
                :job-count="getJobCount(service.plate_number, database)"
              />
            </div>
            <span class="text-xs font-bold text-muted-foreground flex-shrink-0">
              {{ formatDate(service.service_date) }}
            </span>
          </div>

          <!-- Row 2: Jobs Done -->
          <div class="flex items-center gap-1.5 mb-1 text-xs">
            <svg class="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span class="truncate font-medium text-foreground">{{ getJobsSummary(service.jobs_done) }}</span>
          </div>

          <!-- Row 3: Part Details badges -->
          <div v-if="hasPartConditions(service)" class="mb-1 flex flex-wrap gap-1">
            <template v-if="getPartDetailsDisplay(service, 2).visible.length > 0">
              <PartConditionBadge 
                v-for="([job, condition], index) in getPartDetailsDisplay(service, 2).visible" 
                :key="job" 
                :condition="condition"/>
              <span 
                v-if="getPartDetailsDisplay(service, 2).remaining > 0" 
                class="text-[10px] px-1.5 py-0.5 rounded font-medium bg-muted text-muted-foreground"
              >
                +{{ getPartDetailsDisplay(service, 2).remaining }} more
              </span>
            </template>
          </div>

          <!-- Row 4: Vehicle Model + Cost -->
          <div class="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <div class="flex items-center gap-1.5 flex-1 min-w-0">
              <svg class="w-3.5 h-3.5 flex-shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0h.01M15 17a2 2 0 104 0m-4 0h.01M17 16h.01" />
              </svg>
              <span class="truncate">
                <span v-if="service.car_model" class="font-semibold">{{service.car_model }}</span>
                <span v-else class="italic opacity-60">No vehicle</span>
                <span v-if="service.car_model && service.customer_name" class="opacity-100 mx-1">·</span>
                <span v-if="service.phone">{{service.phone }}</span>
              </span>
            </div>
            <span class="text-base font-extrabold text-green-600 tabular-nums flex-shrink-0">₱{{ service.cost.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  //Component Imports
import JobHistoryBadge from '../widgets/JobHistoryBadge.vue'
import PartConditionBadge from '../widgets/PartConditionBadge.vue'
//Utils Imports
import { getJobsSummary, formatDate } from '@/utils/formatters'
import { hasPartConditions, getPartDetailsDisplay } from '@/utils/partConditions'
import { hasJobHistory, getJobCount } from '@/utils/jobHistory'
import { useSwipeGesture } from '@/composables/useSwipeGesture'

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

    const {
      setCardRef,
      setButtonRef,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      handleCardClick,
      closeSwipe,
    } = useSwipeGesture(() =>{
      handleView()
    })
</script>