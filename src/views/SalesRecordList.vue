<template>
  <div>
    <!-- Header Bar -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-xl md:text-2xl font-bold text-foreground tracking-tight">
          Recent Transactions
        </h2>
        <p class="text-xs text-muted-foreground mt-0.5">
          <span v-if="hasActiveFilters">
            {{ filteredServices.length }} result{{ filteredServices.length !== 1 ? 's' : '' }} found
          </span>
          <span v-else>
            {{ filteredServices.length }} total record{{ filteredServices.length !== 1 ? 's' : '' }}
          </span>
        </p>
      </div>
      
      <!-- Primary Action -->
      <button
        @click="openAddModal"
        class="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-semibold text-sm shadow-sm active:scale-[0.97] transition-transform"
        style="border-radius: 6px;"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span class="hidden sm:inline">Add Record</span>
        <span class="sm:hidden">Add</span>
      </button>
    </div>

    <!-- Search + Filter Toolbar -->
    <div class="mb-4">
      <!-- Mobile: Search full width on its own row -->
      <div class="mb-2 md:hidden">
        <SearchBar
          v-model="searchQuery"
          placeholder="Search plate number, customer, invoice..."
        />
      </div>

      <!-- Filter row: desktop includes search inline, mobile just filters -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Search: desktop only, inline -->
        <div class="hidden md:block w-72">
          <SearchBar
            v-model="searchQuery"
            placeholder="Search plate number, customer, invoice..."
          />
        </div>

        <!-- Month Filter Dropdown -->
        <div class="relative" ref="monthDropdownRef">
          <button
            @click="toggleMonthDropdown"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border transition-colors',
              selectedMonth
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-foreground border-border hover:border-primary'
            ]"
            style="border-radius: 6px;"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ selectedMonth ? getMonthName(selectedMonth) : 'Month' }}</span>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Month Dropdown -->
          <div
            v-if="showMonthDropdown"
            class="absolute top-full left-0 mt-1 bg-white border border-border shadow-md z-20 min-w-[140px] max-h-[280px] overflow-y-auto"
            style="border-radius: 6px;"
            @click.stop
          >
            <button
              v-for="month in months"
              :key="month.value"
              @click="selectMonth(month.value)"
              :class="[
                'w-full px-3 py-2 text-left text-sm transition-colors',
                selectedMonth === month.value
                  ? 'bg-brand-sky text-brand-navy font-medium'
                  : 'text-foreground hover:bg-muted'
              ]"
            >
              {{ month.label }}
            </button>
          </div>
        </div>

        <!-- Year Filter Dropdown -->
        <div class="relative" ref="yearDropdownRef">
          <button
            @click="toggleYearDropdown"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border transition-colors',
              selectedYear
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-foreground border-border hover:border-primary'
            ]"
            style="border-radius: 6px;"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ selectedYear || 'Year' }}</span>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Year Dropdown -->
          <div
            v-if="showYearDropdown"
            class="absolute top-full left-0 mt-1 bg-white border border-border shadow-md z-20 min-w-[100px]"
            style="border-radius: 6px;"
            @click.stop
          >
            <button
              v-for="year in availableYears"
              :key="year"
              @click="selectYear(year)"
              :class="[
                'w-full px-3 py-2 text-left text-sm transition-colors',
                selectedYear === year
                  ? 'bg-brand-sky text-brand-navy font-medium'
                  : 'text-foreground hover:bg-muted'
              ]"
            >
              {{ year }}
            </button>
          </div>
        </div>

        <!-- Clear Filters Button -->
        <button
          v-if="hasActiveFilters"
          @click="clearFilters"
          class="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          style="border-radius: 6px;"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear filters
        </button>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm" style="border-radius: 6px;">
      {{ error }}
    </div>

    <!-- ─── LOADING SKELETONS ─── -->
    <template v-if="initialLoading">
      <!-- Mobile skeleton -->
      <div class="md:hidden h-[calc(100vh-380px)] pb-20 overflow-y-auto">
        <div class="space-y-2">
          <template v-for="i in 8" :key="`skel-card-${i}`">
            <!-- Cards with badge (indices 2, 4, 7 — mimics ~every 2-3 cards having a badge) -->
            <div
              v-if="[2, 4, 7].includes(i)"
              class="bg-card border border-border p-2.5 animate-pulse"
              style="border-radius: 6px;"
            >
              <!-- Row 1: Plate + Date -->
              <div class="flex items-baseline justify-between mb-1">
                <div class="h-[18px] bg-muted w-28" style="border-radius: 3px;"></div>
                <div class="h-3 bg-muted w-20" style="border-radius: 3px;"></div>
              </div>
              <!-- Row 2: Jobs done -->
              <div class="flex items-center gap-1.5 mb-1">
                <div class="h-3.5 bg-muted w-3.5 flex-shrink-0" style="border-radius: 3px;"></div>
                <div class="h-3 bg-muted w-2/3" style="border-radius: 3px;"></div>
              </div>
              <!-- Row 3: Badge row -->
              <div class="flex gap-1 mb-1">
                <div class="h-5 bg-muted w-16" style="border-radius: 4px;"></div>
                <div v-if="i === 4" class="h-5 bg-muted w-20" style="border-radius: 4px;"></div>
              </div>
              <!-- Row 4: Vehicle + Cost -->
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-1.5 flex-1 min-w-0">
                  <div class="h-3.5 bg-muted w-3.5 flex-shrink-0" style="border-radius: 3px;"></div>
                  <div class="h-3 bg-muted w-36" style="border-radius: 3px;"></div>
                </div>
                <div class="h-5 bg-muted w-20 flex-shrink-0" style="border-radius: 3px;"></div>
              </div>
            </div>

            <!-- Cards without badge (regular 3-row height) -->
            <div
              v-else
              class="bg-card border border-border p-2.5 animate-pulse"
              style="border-radius: 6px;"
            >
              <!-- Row 1: Plate + Date -->
              <div class="flex items-baseline justify-between mb-1">
                <div class="h-[18px] bg-muted w-24" style="border-radius: 3px;"></div>
                <div class="h-3 bg-muted w-20" style="border-radius: 3px;"></div>
              </div>
              <!-- Row 2: Jobs done -->
              <div class="flex items-center gap-1.5 mb-1">
                <div class="h-3.5 bg-muted w-3.5 flex-shrink-0" style="border-radius: 3px;"></div>
                <div class="h-3 bg-muted" :style="{ width: [1,3,6].includes(i) ? '45%' : '60%', borderRadius: '3px' }"></div>
              </div>
              <!-- Row 3: Vehicle + Cost -->
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-1.5 flex-1 min-w-0">
                  <div class="h-3.5 bg-muted w-3.5 flex-shrink-0" style="border-radius: 3px;"></div>
                  <div class="h-3 bg-muted" :style="{ width: [1,5].includes(i) ? '7rem' : '9rem', borderRadius: '3px' }"></div>
                </div>
                <div class="h-5 bg-muted w-16 flex-shrink-0" style="border-radius: 3px;"></div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Desktop skeleton -->
      <div class="hidden md:block h-[calc(100vh-410px)] bg-card border border-border" style="border-radius: 6px;">
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
        
        <div class="overflow-y-auto" style="height: calc(100% - 40px);">
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
              <tr v-for="i in 10" :key="`skel-row-${i}`" class="border-b border-border animate-pulse">
                <td class="px-4 py-2">
                  <div class="flex items-center gap-2">
                    <div class="w-4 h-4 flex-shrink-0"></div>
                    <div class="h-3.5 bg-muted w-[70px]" style="border-radius: 3px;"></div>
                  </div>
                </td>
                <td class="px-4 py-2"><div class="h-3.5 bg-muted w-[80px]" style="border-radius: 3px;"></div></td>
                <td class="px-4 py-2"><div class="h-3.5 bg-muted w-[120px]" style="border-radius: 3px;"></div></td>
                <td class="px-4 py-2"><div class="h-3.5 bg-muted w-[100px]" style="border-radius: 3px;"></div></td>
                <td class="px-4 py-2">
                  <div class="flex flex-wrap gap-1">
                    <div class="h-5 bg-muted w-[70px]" style="border-radius: 3px;"></div>
                    <div class="h-5 bg-muted w-[60px]" style="border-radius: 3px;"></div>
                  </div>
                </td>
                <td class="px-4 py-2"><div class="h-4 bg-muted w-[80px]" style="border-radius: 3px;"></div></td>
                <td class="px-4 py-2"><div class="h-3.5 bg-muted w-[90px]" style="border-radius: 3px;"></div></td>
                <td class="px-2 py-2">
                  <div class="p-1.5">
                    <div class="h-[18px] bg-muted w-[18px] mx-auto" style="border-radius: 3px;"></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- EMPTY STATE -->
    <EmptyState v-else-if="paginatedServices.length === 0" :hasFilters="hasActiveFilters" />

    <!-- RECORDS: MOBILE CARDS + DESKTOP TABLE -->
    <template v-else>
      <!-- Mobile: Card List -->
      <div class="md:hidden h-[calc(100vh-380px)] overflow-y-auto" ref="mobileScrollContainerRef">
        <div class="space-y-2">
          <div
            v-for="service in paginatedServices"
            :key="`card-${service.id}`"
            class="relative overflow-hidden"
            style="border-radius: 6px;"
          >
            <!-- Action Buttons Background -->
            <div class="absolute inset-0 flex items-center gap-2 justify-end pr-2 pl-2 bg-brand-sky">
              <button
                :ref="el => setButtonRef(el, service.id, 'edit')"
                @click.stop="openEditModal(service); closeSwipe(service.id)"
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
                @click.stop="deleteService(service.id); closeSwipe(service.id)"
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
                        v-if="hasJobHistory(service.plate_number)" 
                        :job-count="getJobCount(service.plate_number)"
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
                        <span v-if="service.car_model" class="font-semibold">{{ service.car_model }}</span>
                        <span v-else class="italic opacity-60">No vehicle</span>
                        <span v-if="service.car_model && service.customer_name" class="opacity-100 mx-1">·</span>
                        <span v-if="service.phone">{{ service.phone }}</span>
                      </span>
                    </div>
                    <span class="text-base font-extrabold text-green-600 tabular-nums flex-shrink-0">₱{{ service.cost.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Pagination -->
        <div v-if="totalPages > 1" class="mt-4 pb-20 flex flex-col items-center gap-4">
          <div class="text-sm font-medium text-muted-foreground tabular-nums">
            Showing {{ startIndex + 1 }}–{{ Math.min(endIndex, filteredServices.length) }} of <span class="text-foreground font-semibold">{{ filteredServices.length }}</span> results
          </div>
          <Pagination
            v-slot="{ page }"
            :total="filteredServices.length"
            :items-per-page="ITEMS_PER_PAGE"
            :sibling-count="1"
            :show-edges="true"
            v-model:page="currentPage"
          >
            <PaginationList v-slot="{ items }" class="flex items-center gap-1">
              <PaginationFirst class="border border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors" style="border-radius:6px;" />
              <PaginationPrev class="border border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors" style="border-radius:6px;" />
              <template v-for="(item, index) in items">
                <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                  <Button class="w-9 h-9 p-0 border" style="border-radius:6px;" :variant="item.value === page ? 'default' : 'outline'">
                    {{ item.value }}
                  </Button>
                </PaginationListItem>
                <PaginationEllipsis v-else :key="item.type" :index="index" />
              </template>
              <PaginationNext class="border border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors" style="border-radius:6px;" />
              <PaginationLast class="border border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors" style="border-radius:6px;" />
            </PaginationList>
          </Pagination>
        </div>
      </div>

      <!-- Desktop: Table -->
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
              <tr
                v-for="service in paginatedServices"
                :key="`row-${service.id}`"
                class="relative border-b border-border last:border-b-0 hover:bg-brand-sky/40 hover:border-brand-ice/50 transition-all duration-200 cursor-pointer group"
                @click="openViewModal(service)"
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
                      <JobHistoryBadge v-if="hasJobHistory(service.plate_number)" :job-count="getJobCount(service.plate_number)"/>
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
                      @click="openEditModal(service)"
                      class="p-1.5 text-muted-foreground hover:text-brand-navy hover:bg-brand-sky transition-colors"
                      style="border-radius: 4px;"
                      title="Edit"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click="deleteService(service.id)"
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
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Pagination Controls - Desktop -->
    <div v-if="totalPages > 1" class="hidden md:flex mt-4 flex-col sm:flex-row items-center justify-between gap-4">
      <div class="text-sm font-medium text-muted-foreground tabular-nums">
        Showing {{ startIndex + 1 }}–{{ Math.min(endIndex, filteredServices.length) }} of <span class="text-foreground font-semibold">{{ filteredServices.length }}</span> results
      </div>
      <Pagination
        v-slot="{ page }"
        :total="filteredServices.length"
        :items-per-page="ITEMS_PER_PAGE"
        :sibling-count="1"
        :show-edges="true"
        v-model:page="currentPage"
      >
        <PaginationList v-slot="{ items }" class="flex items-center gap-1">
          <PaginationFirst class="border border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors" style="border-radius:6px;" />
          <PaginationPrev class="border border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors" style="border-radius:6px;" />
          <template v-for="(item, index) in items">
            <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
              <Button class="w-9 h-9 p-0 border" style="border-radius:6px;" :variant="item.value === page ? 'default' : 'outline'">
                {{ item.value }}
              </Button>
            </PaginationListItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>
          <PaginationNext class="border border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors" style="border-radius:6px;" />
          <PaginationLast class="border border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors" style="border-radius:6px;" />
        </PaginationList>
      </Pagination>
    </div>

    <!-- ─── MODALS ─── -->
    <ServiceForm
      :service="selectedService"
      :show="showModal"
      :show-backdrop="true"
      :existing-records="mockDatabase"
      :is-sidebar-collapsed="props.isSidebarCollapsed"
      @close="closeModal"
      @save="handleSave"
    />

    <!-- ViewDetailsModal — animation handled internally -->
    <ViewDetailsModal
      v-if="showViewModal"
      :service="viewService"
      :all-services="mockDatabase"
      :show="showViewModal"
      :is-sidebar-collapsed="props.isSidebarCollapsed"
      @close="closeViewModal"
      @edit="handleEditFromView"
      @view-job="viewJobFromHistory"
    />

    <ToastNotification
      :show="showToast"
      :message="toastMessage"
      :variant="toastVariant"
      :duration="3000"
      @close="showToast = false"
    />

    <AlertDialog v-model:open="showDeleteDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this record?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the sales record from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="confirmDelete">
            Delete Record
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { getMonthName, months, getJobsSummary, formatDate } from '@/utils/formatters.js'
import { getPartDetailsDisplay, hasPartConditions } from '@/utils/partConditions'
import { useSwipeGesture } from '@/composables/useSwipeGesture'
import { useServiceFilter } from '@/composables/useServiceFilter'
import ServiceForm from '../components/ServiceForm.vue'
import ViewDetailsModal from '../components/ViewDetailsModal.vue'
import ToastNotification from '../components/ToastNotification.vue'
import SearchBar from "@/components/common/inputs/SearchBar.vue";
import EmptyState from '@/components/common/feedback/EmptyState.vue'
import PartConditionBadge from '@/components/features/sales/widgets/PartConditionBadge.vue'
import JobHistoryBadge from '@/components/features/sales/widgets/JobHistoryBadge.vue'
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { mockDatabase } from '../data/mockData.js'

const props = defineProps({
  isSidebarCollapsed: {
    type: Boolean,
    default: false
  }
})

// Destructured from useSwipeGesture
const {
  setCardRef,
  setButtonRef,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleCardClick,
  closeSwipe,
  closeOpenSwipe,
} = useSwipeGesture((service) => {
  openViewModal(service) 
})

// Filtered state & actions from useServiceFilter
const {
  selectedMonth,
  selectedYear,
  showMonthDropdown,
  showYearDropdown,
  searchQuery,
  toggleMonthDropdown,
  toggleYearDropdown,
  currentPage,
  filteredServices,
  selectMonth,
  selectYear,
  availableYears,
  hasActiveFilters,
  clearFilters,
  clearCache
} = useServiceFilter(mockDatabase)

const ITEMS_PER_PAGE = 50
const mobileScrollContainerRef = ref(null)
const desktopScrollContainerRef = ref(null)
const initialLoading = ref(true)
const showModal = ref(false)
const showViewModal = ref(false)
const selectedService = ref(null)
const viewService = ref(null)                    
const error = ref(null)
const monthDropdownRef = ref(null)
const yearDropdownRef = ref(null)
const showToast = ref(false)
const toastMessage = ref('')
const toastVariant = ref('success')
const showDeleteDialog = ref(false)
const selectedDeleteId = ref(null)



function showToastNotification(message, variant = 'success') {
  toastMessage.value = message
  toastVariant.value = variant
  showToast.value = true
}

const totalPages = computed(() => Math.ceil(filteredServices.value.length / ITEMS_PER_PAGE))
const startIndex = computed(() => (currentPage.value - 1) * ITEMS_PER_PAGE)
const endIndex = computed(() => startIndex.value + ITEMS_PER_PAGE)
const paginatedServices = computed(() => filteredServices.value.slice(startIndex.value, endIndex.value))

function hasJobHistory(plateNumber) {
  if (!plateNumber) return false
  return mockDatabase.filter(s => s.plate_number === plateNumber).length > 1
}

function getJobCount(plateNumber) {
  if (!plateNumber) return 0
  return mockDatabase.filter(s => s.plate_number === plateNumber).length
}

function viewJobFromHistory(job) {
  viewService.value = job 
}

watch(currentPage, async () => {
  await nextTick()
  if (mobileScrollContainerRef.value) mobileScrollContainerRef.value.scrollTop = 0
  if (desktopScrollContainerRef.value) desktopScrollContainerRef.value.scrollTop = 0
})

onMounted(() => {
  initialLoading.value = true
  setTimeout(() => {
    initialLoading.value = false
  }, 300)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})



function openAddModal() {
  selectedService.value = null
  showModal.value = true
  
}

function openViewModal(service) {
  viewService.value = { ...service }
  showViewModal.value = true
  
}

function closeViewModal() {
  showViewModal.value = false
  viewService.value = null
}

function openEditModal(service) {
  selectedService.value = { ...service }
  showModal.value = true
  showViewModal.value = false
}

function handleEditFromView(service) {
  const dbIndex = mockDatabase.findIndex(s => s.id === service.id)
  if (dbIndex !== -1) mockDatabase[dbIndex] = { ...service }
  viewService.value = { ...service }
  showToastNotification('Record has been updated successfully', 'success')
}

function closeModal() {
  showModal.value = false
  setTimeout(() => { selectedService.value = null }, 250)
}

async function handleSave(serviceData) {
  const isEditMode = !!serviceData.id

  if (isEditMode) {
    const dbIndex = mockDatabase.findIndex(s => s.id === serviceData.id)
    if (dbIndex !== -1) mockDatabase[dbIndex] = { ...serviceData }
    clearCache()
    showToastNotification('Record has been updated successfully', 'success')
  } else {
    const newService = {
      ...serviceData,
      id: `temp-${Date.now()}`,
      loading: true,
      created_at: new Date().toISOString().split('T')[0]
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      const newId = Math.max(...mockDatabase.map(s => s.id), 0) + 1
      const savedService = { ...newService, id: newId, loading: false }
      mockDatabase.unshift(savedService)
      clearCache()
      showToastNotification('New record created successfully', 'success')
    } catch (err) {
      error.value = 'Failed to save record. Please try again.'
      showToastNotification('Failed to save record. Please try again.', 'error')
      console.error('Error saving service:', err)
    }
  }

  closeModal()
}

function deleteService(id) {
  selectedDeleteId.value = id
  showDeleteDialog.value = true
}

function confirmDelete() {
  if (selectedDeleteId.value) {
    const dbIndex = mockDatabase.findIndex(s => s.id === selectedDeleteId.value)
    if (dbIndex !== -1) mockDatabase.splice(dbIndex, 1)
    clearCache()
    showToastNotification('Record deleted successfully', 'success')
    selectedDeleteId.value = null
    showDeleteDialog.value = false
  }
}

function handleClickOutside(event) {
  closeOpenSwipe()  

  if (monthDropdownRef.value && !monthDropdownRef.value.contains(event.target)) {
    showMonthDropdown.value = false
  }
  if (yearDropdownRef.value && !yearDropdownRef.value.contains(event.target)) {
    showYearDropdown.value = false
  }
}

</script>