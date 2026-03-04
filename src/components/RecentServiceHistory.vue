<template>
  <Teleport to="body" :disabled="!hasHistory">

    <!-- ─── DRAGGABLE FLOATING PILL ──────────────────────────────── -->
    <button
      v-if="hasHistory && visible"
      ref="fabRef"
      class="fab-pill"
      :class="{ 'fab-pill--dragging': isDragging }"
      :style="fabStyle"
      @pointerdown="onPointerDown"
      @click="onFabClick"
    >
      <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span class="fab-pill-text">History</span>
      <span class="fab-pill-badge">{{ totalCount }}</span>
      <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <!-- ─── BACKDROP ─────────────────────────────────────────────── -->
    <div
      v-show="sheetVisible"
      :class="['sheet-backdrop', animating ? 'sheet-backdrop--visible' : '']"
      @click="closeSheet"
    />

    <!-- ─── BOTTOM SHEET ─────────────────────────────────────────── -->
    <div
      v-show="sheetVisible"
      :class="['sheet-panel', animating ? 'sheet-panel--visible' : '']"
      @click.stop
    >
      <div class="sheet-handle-wrap" @click="closeSheet">
        <div class="sheet-handle" />
      </div>

      <div class="sheet-header">
        <div class="sheet-header-left">
          <svg class="sheet-header-icon" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="sheet-title">Service History</span>
        </div>
        <div class="sheet-header-right">
          <span class="sheet-plate">{{ plateNumber }}</span>
          <span class="sheet-count-badge">{{ totalCount }}</span>
        </div>
      </div>

      <div class="sheet-body hide-scrollbar">
        <template v-for="group in historyByYear" :key="group.year">
          <div class="year-divider">
            <span class="year-label">{{ group.year }}</span>
            <div class="year-line" />
            <span class="year-count">{{ group.jobs.length }}</span>
          </div>

          <button
            v-for="job in group.jobs"
            :key="job.id"
            :class="['sheet-row', job.id === currentJobId ? 'sheet-row--active' : '']"
            @click="selectFromSheet(job)"
            @contextmenu.prevent
            @touchstart.passive="onRowTouchStart"
            @touchend="onRowTouchEnd(job, $event)"
            @touchmove="onRowTouchMove"
          >
            <div class="sheet-row-left">
              <span :class="['row-dot', job.id === currentJobId ? 'row-dot--active' : 'row-dot--idle']" />
              <div>
                <p class="row-date">{{ formatDate(job.service_date) }}</p>
                <p class="row-jobs">{{ jobSummary(job) }}</p>
              </div>
            </div>
            <div class="sheet-row-right">
              <span class="row-cost">₱{{ job.cost?.toFixed(0) ?? '0' }}</span>
              <span v-if="job.id === currentJobId" class="now-badge">Now</span>
              <svg v-else class="row-arrow" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </template>
      </div>

      <div class="sheet-safe-area" />
    </div>

  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

// ─── Props ────────────────────────────────────────────────────────
const props = defineProps({
  jobs: {
    type: Array,
    required: true
  },
  currentJobId: {
    type: [Number, String],
    required: true
  },
  plateNumber: {
    type: String,
    default: ''
  },
  /** Controls FAB visibility — hide when edit form is open or modal is closing */
  visible: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['select-job'])

// ─── FAB drag state ───────────────────────────────────────────────
const fabRef    = ref(null)
const isDragging = ref(false)

// Position stored as { bottom, right } in px — FAB starts bottom-right
const fabPos = ref({ bottom: 96, right: 16 })
const fabStyle = computed(() => ({
  bottom: fabPos.value.bottom + 'px',
  right:  fabPos.value.right  + 'px',
  left:   fabPos.value.left !== undefined ? fabPos.value.left + 'px' : 'auto'
}))

let dragStartX     = 0
let dragStartY     = 0
let fabStartRight  = 0
let fabStartBottom = 0
let didMove        = false
let snapTimer      = null

const PAD = 12  // minimum gap from screen edge

function onPointerDown(e) {
  // Only primary pointer / left button
  if (e.button !== undefined && e.button !== 0) return
  e.preventDefault()
  e.stopPropagation()

  isDragging.value = true
  didMove          = false

  dragStartX    = e.clientX
  dragStartY    = e.clientY
  fabStartRight  = fabPos.value.right  ?? (window.innerWidth  - fabRef.value.offsetLeft - fabRef.value.offsetWidth)
  fabStartBottom = fabPos.value.bottom ?? (window.innerHeight - fabRef.value.offsetTop  - fabRef.value.offsetHeight)

  // Switch to left/bottom positioning for free movement
  fabPos.value = {
    left:   window.innerWidth  - fabStartRight  - fabRef.value.offsetWidth,
    bottom: fabStartBottom
  }

  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup',   onPointerUp)
}

function onPointerMove(e) {
  if (!isDragging.value) return
  const dx = e.clientX - dragStartX
  const dy = e.clientY - dragStartY

  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didMove = true

  const fabW = fabRef.value?.offsetWidth  ?? 120
  const fabH = fabRef.value?.offsetHeight ?? 36

  const newLeft   = clamp(window.innerWidth  - fabStartRight  - fabW + dx, PAD, window.innerWidth  - fabW - PAD)
  const newBottom = clamp(fabStartBottom                           - dy, PAD, window.innerHeight - fabH - PAD)

  fabPos.value = { left: newLeft, bottom: newBottom }
}

function onPointerUp() {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup',   onPointerUp)

  isDragging.value = false

  if (didMove) {
    snapToEdge()
  }
}

function snapToEdge() {
  const fabW    = fabRef.value?.offsetWidth ?? 120
  const midX    = (fabPos.value.left ?? 0) + fabW / 2
  const snapLeft = midX < window.innerWidth / 2

  const targetLeft  = snapLeft ? PAD : window.innerWidth - fabW - PAD
  const targetRight = snapLeft ? undefined : PAD

  // Animate snap
  fabRef.value.style.transition = 'left 0.28s cubic-bezier(0.32,0.72,0,1), right 0.28s cubic-bezier(0.32,0.72,0,1)'
  fabPos.value = { left: targetLeft, bottom: fabPos.value.bottom }

  snapTimer = setTimeout(() => {
    if (fabRef.value) fabRef.value.style.transition = ''
    // Normalise back to right-based if snapped to right edge
    if (!snapLeft) {
      fabPos.value = { right: PAD, bottom: fabPos.value.bottom }
    }
    snapTimer = null
  }, 300)
}

function onFabClick() {
  // Only open sheet if this was a tap, not end of a drag
  if (!didMove) openSheet()
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}

// ─── Sheet state ──────────────────────────────────────────────────
const sheetVisible = ref(false)
const animating    = ref(false)
let   closeTimer   = null

const CLOSE_DURATION = 240

function openSheet() {
  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
  sheetVisible.value = true
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { animating.value = true })
  })
}

function closeSheet() {
  animating.value = false
  closeTimer = setTimeout(() => {
    sheetVisible.value = false
    closeTimer = null
  }, CLOSE_DURATION)
}

function forceClose() {
  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
  if (snapTimer)  { clearTimeout(snapTimer);  snapTimer  = null }
  animating.value    = false
  sheetVisible.value = false
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup',   onPointerUp)
}

onBeforeRouteLeave(() => forceClose())
onBeforeUnmount(()    => forceClose())
watch(() => props.jobs.length, (len) => { if (len < 2) forceClose() })
watch(() => props.visible, (v) => { if (!v) forceClose() })

// ─── Computed ─────────────────────────────────────────────────────
const hasHistory = computed(() => props.jobs.length > 1)
const totalCount = computed(() => props.jobs.length)

const historyByYear = computed(() => {
  const map = {}
  props.jobs.forEach(job => {
    const year = job.service_date?.split('-')[0] ?? 'Unknown'
    if (!map[year]) map[year] = []
    map[year].push(job)
  })
  return Object.keys(map)
    .sort((a, b) => b - a)
    .map(year => ({ year, jobs: map[year] }))
})

// ─── Sheet interactions ───────────────────────────────────────────
// ─── Row touch handling ───────────────────────────────────────────
// On mobile, holding a touch >500ms triggers the browser long-press /
// context menu which cancels the touch sequence so click never fires.
// We manually track touch start/end and fire selectFromSheet ourselves,
// bypassing the native click pipeline entirely for touch devices.

let rowTouchStartX  = 0
let rowTouchStartY  = 0
let rowTouchMoved   = false
let rowLongPressTimer = null

function onRowTouchStart(e) {
  rowTouchStartX = e.touches[0].clientX
  rowTouchStartY = e.touches[0].clientY
  rowTouchMoved  = false

  // Cancel any browser long-press by clearing selection on a short delay
  rowLongPressTimer = setTimeout(() => {
    window.getSelection()?.removeAllRanges()
  }, 500)
}

function onRowTouchMove(e) {
  const dx = Math.abs(e.touches[0].clientX - rowTouchStartX)
  const dy = Math.abs(e.touches[0].clientY - rowTouchStartY)
  // If the user scrolled more than 8px, treat as a scroll not a tap
  if (dx > 8 || dy > 8) rowTouchMoved = true
}

function onRowTouchEnd(job, e) {
  if (rowLongPressTimer) { clearTimeout(rowLongPressTimer); rowLongPressTimer = null }
  if (rowTouchMoved) return // was a scroll, ignore
  // Prevent the synthetic click that would double-fire
  e.preventDefault()
  selectFromSheet(job)
}

function selectFromSheet(job) {
  if (job.id !== props.currentJobId) {
    emit('select-job', job)
    closeSheet()
  }
}

// ─── Helpers ──────────────────────────────────────────────────────
const jobLabels = {
  replace_evaporator_front:       'Evaporator Front',
  replace_evaporator_rear:        'Evaporator Rear',
  replace_condenser:              'Condenser',
  replace_compressor:             'Compressor',
  replace_blower_motor:           'Blower Motor',
  replace_expansion_valve:        'Expansion Valve',
  replace_pulley_assembly:        'Pulley Assembly',
  replace_fan_motor:              'Fan Motor',
  replace_suction_hose_assembly:  'Suction Hose',
  replace_fan_belt:               'Fan Belt',
  replace_filter_drier:           'Filter Drier',
  replace_discharge_hose_suction: 'Discharge Hose',
  replace_ecv:                    'ECV',
  replace_oring:                  'O-ring',
  replace_radiator:               'Radiator',
  replace_cabin_filter:           'Cabin Filter',
  replace_magnetic:               'Magnetic',
  pulldown_evaporator:            'Pulldown Evaporator',
  pulldown_condenser:             'Pulldown Condenser',
  pulldown_compressor:            'Pulldown Compressor',
  flushing_system:                'Flushing System',
  install_cabin_filter:           'Install Cabin Filter',
  cleaning:                       'Cleaning',
  freon:                          'Freon'
}

function getJobLabel(key) { return jobLabels[key] ?? key }

function jobSummary(job) {
  if (!job.jobs_done?.length) return 'No jobs recorded'
  const first = getJobLabel(job.jobs_done[0])
  const rest  = job.jobs_done.length - 1
  return rest > 0 ? `${first} +${rest} more` : first
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  try {
    const d = new Date(dateString)
    if (isNaN(d)) return 'Invalid Date'
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    }).format(d)
  } catch { return 'Invalid Date' }
}
</script>

<style scoped>
/* ─── Floating pill ──────────────────────────────────────────── */
.fab-pill {
  position: fixed;
  z-index: 60;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px 0 12px;
  height: 36px;
  width: max-content;
  background: #0f243f;
  border: none;
  border-radius: 18px;
  cursor: grab;
  /* Entry animation */
  animation: fab-enter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  box-shadow:
    0 4px 16px rgba(15, 36, 63, 0.35),
    0 1px 4px  rgba(15, 36, 63, 0.2);
  touch-action: none; /* prevents scroll interference during drag */
  -webkit-tap-highlight-color: transparent;
  transition: box-shadow 0.15s, transform 0.15s;
}
@keyframes fab-enter {
  from { opacity: 0; transform: scale(0.7) translateY(12px); }
  to   { opacity: 1; transform: scale(1)   translateY(0);    }
}

@media (hover: hover) {
  .fab-pill:hover {
    box-shadow:
      0 6px 20px rgba(15, 36, 63, 0.4),
      0 2px 6px  rgba(15, 36, 63, 0.25);
  }
}

.fab-pill--dragging {
  cursor: grabbing;
  box-shadow:
    0 10px 32px rgba(15, 36, 63, 0.45),
    0 3px 10px  rgba(15, 36, 63, 0.3);
  transform: scale(1.06);
  transition: none; /* no transition while actively dragging */
}

.fab-pill svg:first-child {
  color: rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
}

.fab-pill-text {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #ffffff;
  line-height: 1;
}

.fab-pill-badge {
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.85);
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 8px;
  line-height: 1;
}

.fab-pill svg:last-child {
  color: rgba(255, 255, 255, 0.45);
  flex-shrink: 0;
}

/* Desktop: hide the FAB — desktop has the inline history panel */
@media (min-width: 768px) {
  .fab-pill { display: none; }
}

/* ─── Backdrop ──────────────────────────────────────────────── */
.sheet-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 36, 63, 0.55);
  backdrop-filter: blur(2px);
  z-index: 70;
  opacity: 0;
  transition: opacity 0.28s ease;
  pointer-events: none;
}
.sheet-backdrop--visible {
  opacity: 1;
  pointer-events: auto;
}

/* ─── Sheet panel ────────────────────────────────────────────── */
.sheet-panel {
  position: fixed;
  left: 0; right: 0; bottom: 0;
  z-index: 71;
  background: #ffffff;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -8px 40px rgba(15, 36, 63, 0.18);
  display: flex;
  flex-direction: column;
  max-height: 78vh;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  transform: translateY(100%);
  transition: transform 0.32s cubic-bezier(0.32, 0.72, 0, 1);
}
.sheet-panel--visible {
  transform: translateY(0%);
  transition: transform 0.24s cubic-bezier(0.32, 0.72, 0, 1);
}

/* ─── Sheet handle ───────────────────────────────────────────── */
.sheet-handle-wrap {
  display: flex;
  justify-content: center;
  padding: 10px 0 6px;
  cursor: pointer;
  flex-shrink: 0;
}
.sheet-handle {
  width: 36px; height: 4px;
  background: #c8dae6; border-radius: 2px;
}

/* ─── Sheet header ───────────────────────────────────────────── */
.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid #c8dae6;
  flex-shrink: 0;
}
.sheet-header-left  { display: flex; align-items: center; gap: 6px; }
.sheet-header-icon  { color: #6b8fa8; }
.sheet-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: #6b8fa8;
}
.sheet-header-right { display: flex; align-items: center; gap: 8px; }
.sheet-plate {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 13px; font-weight: 700;
  color: #0f243f; letter-spacing: 0.06em;
}
.sheet-count-badge {
  background: #d6e8f4; color: #0f243f;
  font-size: 10px; font-weight: 800;
  padding: 2px 7px; border-radius: 10px;
}

/* ─── Sheet body ─────────────────────────────────────────────── */
.sheet-body {
  flex: 1; overflow-y: auto;
  padding: 6px 8px 4px;
}

.year-divider {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 8px 6px;
}
.year-label {
  font-size: 10px; font-weight: 800;
  color: #6b8fa8; text-transform: uppercase; letter-spacing: 0.1em;
  flex-shrink: 0;
}
.year-line  { flex: 1; height: 1px; background: #d6e8f4; }
.year-count { font-size: 10px; color: #6b8fa8; opacity: 0.6; flex-shrink: 0; }

.sheet-row {
  width: 100%;
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; padding: 10px 12px;
  background: transparent; border: 1px solid transparent;
  cursor: pointer; text-align: left;
  border-radius: 8px;
  transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
  margin-bottom: 2px;
  /* Prevent long-press text selection on mobile */
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
}
@media (hover: hover) {
  .sheet-row:not(.sheet-row--active):hover {
    background: rgba(214, 232, 244, 0.5);
    border-color: rgba(15, 36, 63, 0.08);
  }
}
/* :active only on real pointer devices — on touch it fires but never clears,
   leaving a stuck highlight. Use a short transition to fade it out naturally. */
@media (hover: hover) {
  .sheet-row:active { background: #d6e8f4; }
}
/* On touch: brief flash via transition on background, clears itself */
@media (hover: none) {
  .sheet-row { transition: background 0.1s ease, border-color 0.1s ease, box-shadow 0.15s, transform 0.15s; }
  .sheet-row:active { background: #d6e8f4; transition: background 0s; }
}
.sheet-row--active {
  background: #ffffff;
  border-color: rgba(15, 36, 63, 0.22);
  border-left: 3px solid #0f243f;
  box-shadow:
    0 4px 16px rgba(15, 36, 63, 0.14),
    0 1px 4px  rgba(15, 36, 63, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transform: scale(1.025) translateY(-1px);
  cursor: default;
  position: relative;
  z-index: 1; /* lifts above sibling rows so shadow is not clipped */
}

.sheet-row-left {
  display: flex; align-items: center;
  gap: 10px; min-width: 0; flex: 1;
}
.row-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.row-dot--active { background: #0f243f; }
.row-dot--idle   { background: #c8dae6; }

.row-date  { font-size: 12px; font-weight: 700; color: #0f243f; line-height: 1.2; }
.row-jobs  {
  font-size: 11px; color: #6b8fa8; margin-top: 1px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  max-width: 200px;
}

.sheet-row-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.row-cost {
  font-size: 11px; font-weight: 800; color: #16a34a;
  font-variant-numeric: tabular-nums;
  min-width: 44px; text-align: right;
}
.now-badge {
  font-size: 8px; font-weight: 800;
  text-transform: uppercase; letter-spacing: 0.06em;
  background: rgba(15, 36, 63, 0.08); color: #0f243f;
  padding: 3px 6px; border-radius: 3px;
}
.row-arrow { color: #c8dae6; }

.sheet-safe-area { height: 12px; flex-shrink: 0; }

.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
</style>