import { computed, toValue } from 'vue'

const DOTS = 'ellipsis'

function rangeArray(start, end) {
  const length = end - start + 1
  return Array.from({ length }, (_, idx) => idx + start)
}

export function usePagination(props) {
  const reactiveProps = computed(() => toValue(props))

  const totalPages = computed(() => {
    const { total, itemsPerPage = 10 } = reactiveProps.value
    return Math.ceil(total / itemsPerPage)
  })

  const range = computed(() => {
    const { page = 1, siblingCount = 1 } = reactiveProps.value
    const totalPageNumbers = siblingCount + 5

    if (totalPageNumbers >= totalPages.value) {
      return rangeArray(1, totalPages.value).map(value => ({ type: 'page', value }))
    }

    const leftSiblingIndex = Math.max(page - siblingCount, 1)
    const rightSiblingIndex = Math.min(page + siblingCount, totalPages.value)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPages.value - 2

    const firstPageIndex = 1
    const lastPageIndex = totalPages.value

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = rangeArray(1, leftItemCount)

      return [
        ...leftRange.map(value => ({ type: 'page', value })),
        { type: DOTS, value: DOTS },
        { type: 'page', value: totalPages.value },
      ]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
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

  return {
    range,
    totalPages,
  }
}