export function hasJobHistory(plateNumber, database) {
  if (!plateNumber) return false
  return database.filter(s => s.plate_number === plateNumber).length > 1
}

export function getJobCount(plateNumber, database) {
  if (!plateNumber) return 0
  return database.filter(s => s.plate_number === plateNumber).length
}