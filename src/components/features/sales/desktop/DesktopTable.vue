<template>
    <div class="hidden md:block h-[calc(100vh-410px)] bg-card border border-border" style="border-radius: 6px;">
        <!-- Sticky Table Header -->
        <div class="border-b border-border bg-[var(--foreground)]">
          <table class="w-full border-collapse table-fixed">
            <colgroup>
              <col style="width: 200px;">
              <col style="width: 140px;">
              <col style="width: auto;">
              <col style="width: 140px;">
              <col style="width: 180px;">
              <col style="width: 140px;">
              <col style="width: 180px;">
              <col style="width: 48px;">
            </colgroup>
            <thead>
              <tr>
                <th class="h-10 pl-10 pr-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Plate No.</th>
                <th class="h-10 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Date</th>
                <th class="h-10 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Jobs Done</th>
                <th class="h-10 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Phone</th>
                <th class="h-10 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Part Details</th>
                <th class="h-10 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Cost</th>
                <th class="h-10 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Vehicle</th>
                <th class="h-10 w-[48px]"></th>
              </tr>
            </thead>
          </table>
        </div>
        
        <!-- Scrollable Table Body -->
        <div 
          ref="desktopScrollContainerRef"
          class="overflow-y-auto" 
          style="height: calc(100% - 40px);"
        >
          <table class="w-full border-collapse table-fixed">
            <colgroup>
              <col style="width: 200px;">
              <col style="width: 140px;">
              <col style="width: auto;">
              <col style="width: 140px;">
              <col style="width: 180px;">
              <col style="width: 140px;">
              <col style="width: 180px;">
              <col style="width: 48px;">
            </colgroup>
            <tbody>
              <DesktopTableRow
                v-for="service in paginatedServices"
                :key="`row-${service.id}`"
                :service="service"
                :database="database"
                @view="forwardView"
                @edit="forwardEdit"
                @delete="forwardDelete"
              />
            </tbody>
          </table>
        </div>
      </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import DesktopTableRow from './DesktopTableRow.vue'

const desktopScrollContainerRef = ref(null)

const props = defineProps({
    currentPage: Number,
    paginatedServices: Array,
    database: Array
})

const emit = defineEmits(['view', 'edit', 'delete'])

const forwardView = (service) => {
    emit ('view' , service)
}

const forwardEdit = (service) => {
    emit('edit', service)
}

const forwardDelete = (id) => {
    emit('delete', id)
}

watch(() => props.currentPage, async () => {
  await nextTick()
  if (desktopScrollContainerRef.value) desktopScrollContainerRef.value.scrollTop = 0
})

</script>