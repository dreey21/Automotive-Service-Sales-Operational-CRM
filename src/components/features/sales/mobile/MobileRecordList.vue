<template>
  <div
    class="md:hidden h-[calc(100vh-380px)] overflow-y-auto"
    ref="mobileScrollContainerRef"
  >
    <div class="space-y-2">
      <div v-for="service in paginatedServices" :key="`card-${service.id}`">
        <MobileRecordCard
          :service="service"
          :database="database"
          @view="emitView"
          @edit="emitEdit"
          @delete="emitDelete"
        />
      </div>
      <!-- Mobile Pagination -->
      <div
        v-if="totalPages > 1"
        class="mt-4 pb-20 flex flex-col items-center gap-4"
      >
        <div class="text-sm font-medium text-muted-foreground tabular-nums">
          Showing {{ startIndex + 1 }}–{{
            Math.min(endIndex, filteredServicesCount)
          }}
          of
          <span class="text-foreground font-semibold">{{
            filteredServicesCount
          }}</span>
          results
        </div>
        <Pagination
          v-slot="{ page }"
          :total="filteredServicesCount"
          :items-per-page="ITEMS_PER_PAGE"
          :sibling-count="1"
          :show-edges="true"
          :page="currentPage"
          @update:page="updateCurrentPage" 
        >
          <PaginationList v-slot="{ items }" class="flex items-center gap-1">
            <PaginationFirst
              class="border border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors"
              style="border-radius: 6px"
            />
            <PaginationPrev
              class="border border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors"
              style="border-radius: 6px"
            />
            <template v-for="(item, index) in items">
              <PaginationListItem
                v-if="item.type === 'page'"
                :key="index"
                :value="item.value"
                as-child
              >
                <Button
                  class="w-9 h-9 p-0 border"
                  style="border-radius: 6px"
                  :variant="item.value === page ? 'default' : 'outline'"
                >
                  {{ item.value }}
                </Button>
              </PaginationListItem>
              <PaginationEllipsis v-else :key="item.type" :index="index" />
            </template>
            <PaginationNext
              class="border border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors"
              style="border-radius: 6px"
            />
            <PaginationLast
              class="border border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors"
              style="border-radius: 6px"
            />
          </PaginationList>
        </Pagination>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, nextTick } from "vue";
import {
  Pagination,
  PaginationFirst,
  PaginationPrev,
  PaginationList,
  PaginationLast,
  PaginationNext,
  PaginationEllipsis,
  PaginationListItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import MobileRecordCard from "@/components/features/sales/mobile/MobileRecordCard.vue";

const props = defineProps({
  paginatedServices: Array,
  database: Array,
  currentPage: Number,
  filteredServicesCount: Number,
  totalPages: Number,
  ITEMS_PER_PAGE: Number,
})

const emit = defineEmits(['view', 'edit', 'delete', 'update:currentPage'])

    const emitView = (service) => {
        emit ('view' , service)
    }

    const emitEdit = (service) => {
        emit('edit', service)
    }

    const emitDelete = (id) => {
        emit('delete', id)
    }
    const updateCurrentPage = (newPage) => {
        emit('update:currentPage', newPage)
    }

const mobileScrollContainerRef = ref(null);



watch(() => props.currentPage, async () => {
  await nextTick();
  if (mobileScrollContainerRef.value)
    mobileScrollContainerRef.value.scrollTop = 0;
});

const startIndex = computed(() => (props.currentPage - 1) * props.ITEMS_PER_PAGE)
const endIndex = computed(() => startIndex.value + props.ITEMS_PER_PAGE)
</script>
