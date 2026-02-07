<script setup>
import { computed, inject } from 'vue'

// Accept class as a prop
defineProps({
  class: String
})

// Inject pagination context from parent Pagination component
const page = inject('page', 1)
const total = inject('total', 0)
const itemsPerPage = inject('itemsPerPage', 10)
const siblingCount = inject('siblingCount', 1)

// Generate page range
const DOTS = 'ellipsis'

function rangeArray(start, end) {
  const length = end - start + 1
  return Array.from({ length }, (_, idx) => idx + start)
}

const totalPages = computed(() => Math.ceil(total.value / itemsPerPage.value))

const range = computed(() => {
  const currentPage = page.value
  const currentSiblingCount = siblingCount.value
  const totalPageNumbers = currentSiblingCount + 5

  if (totalPageNumbers >= totalPages.value) {
    return Array.from({ length: totalPages.value }, (_, i) => ({
      type: 'page',
      value: i + 1
    }))
  }

  const leftSiblingIndex = Math.max(currentPage - currentSiblingCount, 1)
  const rightSiblingIndex = Math.min(currentPage + currentSiblingCount, totalPages.value)

  const shouldShowLeftDots = leftSiblingIndex > 2
  const shouldShowRightDots = rightSiblingIndex < totalPages.value - 2

  const firstPageIndex = 1
  const lastPageIndex = totalPages.value

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * currentSiblingCount
    const leftRange = rangeArray(1, leftItemCount)

    return [
      ...leftRange.map(value => ({ type: 'page', value })),
      { type: DOTS, value: DOTS },
      { type: 'page', value: totalPages.value },
    ]
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * currentSiblingCount
    const rightRange = rangeArray(totalPages.value - rightItemCount + 1, totalPages.value)

    return [
      { type: 'page', value: firstPageIndex },
      { type: DOTS, value: DOTS },
      ...rightRange.map(value => ({ type: 'page', value })),
    ]
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = rangeArray(leftSiblingIndex, rightSiblingIndex)

    return [
      { type: 'page', value: firstPageIndex },
      { type: DOTS, value: DOTS },
      ...middleRange.map(value => ({ type: 'page', value })),
      { type: DOTS, value: DOTS },
      { type: 'page', value: lastPageIndex },
    ]
  }

  return []
})
</script>

<template>
  <div :class="$props.class">
    <slot :items="range" />
  </div>
</template>