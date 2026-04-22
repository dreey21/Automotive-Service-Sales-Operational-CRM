<template>
  <div class="md:hidden h-[calc(100vh-380px)] pb-20 overflow-y-auto">
    <div class="space-y-2">
      <template v-for="i in 8" :key="`skel-card-${i}`">
        <!-- Cards with badge (indices 2, 4, 7 — mimics ~every 2-3 cards having a badge) -->
        <div
          v-if="[2, 4, 7].includes(i)"
          class="bg-card border border-border p-2.5 animate-pulse"
          style="border-radius: 6px"
        >
          <!-- Row 1: Plate + Date -->
          <div class="flex items-baseline justify-between mb-1">
            <div
              class="h-[18px] bg-muted w-28"
              style="border-radius: 3px"
            ></div>
            <div class="h-3 bg-muted w-20" style="border-radius: 3px"></div>
          </div>
          <!-- Row 2: Jobs done -->
          <div class="flex items-center gap-1.5 mb-1">
            <div
              class="h-3.5 bg-muted w-3.5 flex-shrink-0"
              style="border-radius: 3px"
            ></div>
            <div class="h-3 bg-muted w-2/3" style="border-radius: 3px"></div>
          </div>
          <!-- Row 3: Badge row -->
          <div class="flex gap-1 mb-1">
            <div class="h-5 bg-muted w-16" style="border-radius: 4px"></div>
            <div
              v-if="i === 4"
              class="h-5 bg-muted w-20"
              style="border-radius: 4px"
            ></div>
          </div>
          <!-- Row 4: Vehicle + Cost -->
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-1.5 flex-1 min-w-0">
              <div
                class="h-3.5 bg-muted w-3.5 flex-shrink-0"
                style="border-radius: 3px"
              ></div>
              <div class="h-3 bg-muted w-36" style="border-radius: 3px"></div>
            </div>
            <div
              class="h-5 bg-muted w-20 flex-shrink-0"
              style="border-radius: 3px"
            ></div>
          </div>
        </div>

        <!-- Cards without badge (regular 3-row height) -->
        <div
          v-else
          class="bg-card border border-border p-2.5 animate-pulse"
          style="border-radius: 6px"
        >
          <!-- Row 1: Plate + Date -->
          <div class="flex items-baseline justify-between mb-1">
            <div
              class="h-[18px] bg-muted w-24"
              style="border-radius: 3px"
            ></div>
            <div class="h-3 bg-muted w-20" style="border-radius: 3px"></div>
          </div>
          <!-- Row 2: Jobs done -->
          <div class="flex items-center gap-1.5 mb-1">
            <div
              class="h-3.5 bg-muted w-3.5 flex-shrink-0"
              style="border-radius: 3px"
            ></div>
            <div
              class="h-3 bg-muted"
              :style="{
                width: [1, 3, 6].includes(i) ? '45%' : '60%',
                borderRadius: '3px',
              }"
            ></div>
          </div>
          <!-- Row 3: Vehicle + Cost -->
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-1.5 flex-1 min-w-0">
              <div
                class="h-3.5 bg-muted w-3.5 flex-shrink-0"
                style="border-radius: 3px"
              ></div>
              <div
                class="h-3 bg-muted"
                :style="{
                  width: [1, 5].includes(i) ? '7rem' : '9rem',
                  borderRadius: '3px',
                }"
              ></div>
            </div>
            <div
              class="h-5 bg-muted w-16 flex-shrink-0"
              style="border-radius: 3px"
            ></div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
