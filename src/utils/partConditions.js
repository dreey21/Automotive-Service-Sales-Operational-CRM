export function hasPartConditions(service) {
  if (!service.part_condition && !service.owner_parts) return false
  const hasConditions = service.part_condition && Object.keys(service.part_condition).length > 0
  const hasOwnerParts = service.owner_parts && Object.keys(service.owner_parts).some(key => service.owner_parts[key])
  return hasConditions || hasOwnerParts
}

export function getPartDetailsSummary(service) {
  const summary = {}
  if (service.part_condition) {
    Object.entries(service.part_condition).forEach(([job, condition]) => {
      if (condition === 'brand_new') summary[job] = 'Brand New'
      else if (condition === 'surplus') summary[job] = 'Surplus'
    })
  }
  if (service.owner_parts) {
    Object.entries(service.owner_parts).forEach(([job, isOwner]) => {
      if (isOwner) summary[job] = "Owner's Part"
    })
  }
  return summary
}

export function getPartDetailsDisplay(service, maxVisible = 3) {
  const summary = getPartDetailsSummary(service)
  const entries = Object.entries(summary)
  if (entries.length === 0) return { visible: [], remaining: 0 }
  return {
    visible: entries.slice(0, maxVisible),
    remaining: Math.max(0, entries.length - maxVisible)
  }
}