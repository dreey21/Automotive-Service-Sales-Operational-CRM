<template>
  <div>
    <!-- Header Bar - Clean & Functional -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-xl md:text-2xl font-bold text-[var(--foreground)] tracking-tight">
          Recent Transactions
        </h2>
        <p class="text-xs text-[var(--muted-foreground)] mt-0.5">
          <span v-if="debouncedSearchQuery || selectedMonth || selectedYear">
            {{ totalResults }} result{{ totalResults !== 1 ? 's' : '' }} found
          </span>
          <span v-else>
            {{ totalResults }} total record{{ totalResults !== 1 ? 's' : '' }}
          </span>
        </p>
      </div>
      
      <!-- Primary Action -->
      <button
        @click="openAddModal"
        class="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-[var(--accent-foreground)] font-semibold text-sm shadow-sm active:scale-[0.97] transition-transform"
        style="border-radius: 6px;"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span class="hidden sm:inline">Add Record</span>
        <span class="sm:hidden">Add</span>
      </button>
    </div>

    <!-- Search Bar -->
    <div class="mb-3">
      <div class="relative">
        <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <SearchBar
          v-model="searchQuery"
          placeholder="Search plate number, customer, invoice..."
          class="mb-3"
        />
      </div>
    </div>

    <!-- Filter Chips -->
    <div class="mb-4 flex flex-wrap items-center gap-2">
      <!-- Month Filter Dropdown -->
      <div class="relative" ref="monthDropdownRef">
        <button
          @click="toggleMonthDropdown"
          :class="[
            'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border transition-colors',
            selectedMonth
              ? 'bg-[var(--accent)] text-[var(--accent-foreground)] border-[var(--accent)]'
              : 'bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--accent)]'
          ]"
          style="border-radius: 4px;"
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
          class="absolute top-full left-0 mt-1 bg-black border border-[var(--border)] shadow-lg z-20 min-w-[140px] max-h-[280px] overflow-y-auto"
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
                ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-medium'
                : 'text-[var(--foreground)] hover:bg-[var(--muted)]/70'
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
              ? 'bg-[var(--accent)] text-[var(--accent-foreground)] border-[var(--accent)]'
              : 'bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--accent)]'
          ]"
          style="border-radius: 4px;"
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
          class="absolute top-full left-0 mt-1 bg-black border border-[var(--border)] shadow-lg z-20 min-w-[100px]"
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
                ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-medium'
                : 'text-[var(--foreground)] hover:bg-[var(--muted)]/70'
            ]"
          >
            {{ year }}
          </button>
        </div>
      </div>

      <!-- Clear Filters Button -->
      <button
        v-if="selectedMonth || selectedYear"
        @click="clearFilters"
        class="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50 transition-colors"
        style="border-radius: 4px;"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Clear filters
      </button>
    </div>

    <!-- Error State -->
    <div v-if="error" class="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm" style="border-radius: 6px;">
      {{ error }}
    </div>

    <!-- ─── LOADING SKELETONS ─── -->
    <template v-if="initialLoading">
      <!-- Mobile skeleton (cards) - Account for bottom nav (64px) + safe padding (16px) = 80px total -->
      <div class="md:hidden h-[calc(100vh-450px)] pb-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <div class="space-y-2">
          <div
            v-for="i in 8"
            :key="`skel-card-${i}`"
            class="bg-[var(--card)] border border-[var(--border)] p-2.5 animate-pulse"
            style="border-radius: 6px;"
          >
            <!-- Ultra compact skeleton matching new rendered design -->
            <div class="flex items-baseline justify-between mb-1">
              <div class="h-4 bg-[var(--muted)] w-1/3" style="border-radius: 3px;"></div>
              <div class="h-3 bg-[var(--muted)] w-16" style="border-radius: 3px;"></div>
            </div>
            <div class="h-3 bg-[var(--muted)] w-2/3 mb-1" style="border-radius: 3px;"></div>
            <div class="flex items-center justify-between">
              <div class="h-3 bg-[var(--muted)] w-1/2" style="border-radius: 3px;"></div>
              <div class="h-4 bg-[var(--muted)] w-20" style="border-radius: 3px;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop skeleton (table) -->
      <div class="hidden md:block h-[calc(100vh-410px)] bg-[var(--card)] border border-[var(--border)]" style="border-radius: 6px;">
        <!-- Table Header -->
        <div class="border-b border-[var(--border)] bg-[var(--card-solid)]">
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
                <th class="h-10 pl-10 pr-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Plate No.</th>
                <th class="h-10 px-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Date</th>
                <th class="h-10 px-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Jobs Done</th>
                <th class="h-10 px-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Phone</th>
                <th class="h-10 px-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Part Details</th>
                <th class="h-10 px-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Cost</th>
                <th class="h-10 px-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Vehicle</th>
                <th class="h-10 w-[48px]"></th>
              </tr>
            </thead>
          </table>
        </div>
        
        <!-- Scrollable Table Body -->
        <div class="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent" style="height: calc(100% - 40px);">
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
              <tr v-for="i in 10" :key="`skel-row-${i}`" class="border-b border-[var(--border)] animate-pulse">
                <!-- Plate Number with icon space -->
                <td class="px-4 py-2">
                  <div class="flex items-center gap-2">
                    <div class="w-4 h-4 flex-shrink-0"></div>
                    <div class="h-3.5 bg-[var(--muted)] w-[70px]" style="border-radius: 3px;"></div>
                  </div>
                </td>
                <!-- Date -->
                <td class="px-4 py-2"><div class="h-3.5 bg-[var(--muted)] w-[80px]" style="border-radius: 3px;"></div></td>
                <!-- Jobs Done -->
                <td class="px-4 py-2"><div class="h-3.5 bg-[var(--muted)] w-[120px]" style="border-radius: 3px;"></div></td>
                <!-- Phone -->
                <td class="px-4 py-2"><div class="h-3.5 bg-[var(--muted)] w-[100px]" style="border-radius: 3px;"></div></td>
                <!-- Part Details - badge skeletons -->
                <td class="px-4 py-2">
                  <div class="flex flex-wrap gap-1">
                    <div class="h-5 bg-[var(--muted)] w-[70px]" style="border-radius: 3px;"></div>
                    <div class="h-5 bg-[var(--muted)] w-[60px]" style="border-radius: 3px;"></div>
                  </div>
                </td>
                <!-- Cost -->
                <td class="px-4 py-2"><div class="h-4 bg-[var(--muted)] w-[80px]" style="border-radius: 3px;"></div></td>
                <!-- Vehicle -->
                <td class="px-4 py-2"><div class="h-3.5 bg-[var(--muted)] w-[90px]" style="border-radius: 3px;"></div></td>
                <!-- Actions -->
                <td class="px-2 py-2">
                  <div class="p-1.5">
                    <div class="h-[18px] bg-[var(--muted)] w-[18px] mx-auto" style="border-radius: 3px;"></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- EMPTY STATE -->
    <EmptyState v-else-if="paginatedServices.length === 0" :hasFilters="debouncedSearchQuery || selectedMonth || selectedYear" />

    <!-- RECORDS: MOBILE CARDS + DESKTOP TABLE -->
    <template v-else>
      <!-- Mobile: Card List -->
      <div class="md:hidden h-[calc(100vh-450px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent" ref="mobileScrollContainerRef">
        <div class="space-y-2">
          <div
            v-for="service in paginatedServices"
            :key="`card-${service.id}`"
            class="relative overflow-hidden"
            style="border-radius: 6px;"
          >
            <!-- Action Buttons Background (Always rendered behind) -->
            <div class="absolute inset-0 flex items-center gap-2 justify-end pr-2 pl-2 bg-gray-950">
              <button
                :ref="el => setButtonRef(el, service.id, 'edit')"
                @click.stop="openEditModal(service); closeSwipe(service.id)"
                class="w-14 h-11 flex flex-col items-center justify-center gap-0.5 text-white rounded-md bg-grey-950 active:opacity-80 transition-opacity duration-150"
                :style="{
                  opacity: 0,
                  transform: 'scale(0.8)',
                  transition: 'opacity 0.2s ease-out, transform 0.2s ease-out'
                }"
              >
                <svg class="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span class="text-[8px] font-semibold text-[var(--accent)] uppercase tracking-wide">Edit</span>
              </button>
              <button
                :ref="el => setButtonRef(el, service.id, 'delete')"
                @click.stop="deleteService(service.id); closeSwipe(service.id)"
                class="w-14 h-11 flex flex-col items-center justify-center gap-0.5 text-white rounded-md active:opacity-80 transition-opacity duration-150"
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

            <!-- Swipeable Card Content (Sits on top) -->
            <div
              :ref="el => setCardRef(el, service.id)"
              class="relative border border-[var(--border)] touch-pan-y swipe-card"
              style="border-radius: 6px; background-color: #1A1A24; transition: transform 0.25s cubic-bezier(0.4, 0.0, 0.2, 1); will-change: transform;"
              :data-service-id="service.id"
              @touchstart="handleTouchStart($event, service.id)"
              @touchmove="handleTouchMove($event, service.id)"
              @touchend="handleTouchEnd($event, service.id)"
              @click="handleCardClick(service)"
            >
              <div class="p-2.5">
                <!-- Loading Overlay -->
                <div v-if="service.loading" class="absolute inset-0 flex items-center justify-center z-10" style="border-radius: 6px; background-color: rgba(26, 26, 36, 0.9);">
                  <div class="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
                </div>

                <!-- Card Content - ULTRA COMPACT DESIGN -->
                <div>
                  <!-- Row 1: Plate Number + Date only -->
                  <div class="flex items-baseline justify-between mb-1">
                    <div class="flex items-center gap-1.5 flex-1 min-w-0">
                      <h3 class="text-[15px] font-extrabold text-[var(--foreground)] truncate leading-tight font-mono tracking-wider">
                        {{ service.plate_number || 'Walk-in' }}
                      </h3>
                      <JobHistoryBadge 
                        v-if="hasJobHistory(service.plate_number)" 
                        :job-count="getJobCount(service.plate_number)"
                      />
                    </div>
                    <span class="text-xs font-bold text-[var(--muted-foreground)] flex-shrink-0">
                      {{ formatDate(service.service_date) }}
                    </span>
                  </div>

                  <!-- Row 2: Jobs Done -->
                  <div class="flex items-center gap-1.5 mb-1 text-xs">
                    <svg class="w-3.5 h-3.5 flex-shrink-0 text-[var(--muted-foreground)] opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span class="truncate font-medium text-[var(--foreground)]">{{ getJobsSummary(service.jobs_done) }}</span>
                  </div>

                  <!-- Row 3: Part Details badges (if any) -->
                  <div v-if="hasPartConditions(service)" class="mb-1 flex flex-wrap gap-1">
                    <template v-if="getPartDetailsDisplay(service, 2).visible.length > 0">
                      <PartConditionBadge 
                        v-for="([job, condition], index) in getPartDetailsDisplay(service, 2).visible" 
                        :key="job" 
                        :condition="condition"/>
                      <span 
                        v-if="getPartDetailsDisplay(service, 2).remaining > 0" 
                        class="text-[10px] px-1.5 py-0.5 rounded font-medium bg-[var(--muted)] text-[var(--muted-foreground)]"
                      >
                        +{{ getPartDetailsDisplay(service, 2).remaining }} more
                      </span>
                    </template>
                  </div>

                  <!-- Row 4: Vehicle Model + Customer + Price on right -->
                  <div class="flex items-center justify-between gap-2 text-xs text-[var(--muted-foreground)]">
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

        <!-- Mobile Pagination - Inside scrollable container, at the bottom of the list -->
        <div v-if="totalPages > 1" class="mt-4 pb-20 flex flex-col items-center gap-4">
          <!-- Results info -->
          <div class="text-sm text-[var(--muted-foreground)]">
            Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, totalResults) }} of {{ totalResults }} results
          </div>

          <!-- Pagination -->
          <Pagination
            v-slot="{ page }"
            :total="totalResults"
            :items-per-page="ITEMS_PER_PAGE"
            :sibling-count="1"
            :show-edges="true"
            v-model:page="currentPage"
          >
            <PaginationList v-slot="{ items }" class="flex items-center gap-1">
              <PaginationFirst />
              <PaginationPrev />

              <template v-for="(item, index) in items">
                <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                  <Button
                    class="w-9 h-9 p-0"
                    :variant="item.value === page ? 'default' : 'outline'"
                  >
                    {{ item.value }}
                  </Button>
                </PaginationListItem>
                <PaginationEllipsis v-else :key="item.type" :index="index" />
              </template>

              <PaginationNext />
              <PaginationLast />
            </PaginationList>
          </Pagination>
        </div>
      </div>

      <!-- Desktop: Table with Separated Sticky Header -->
      <div class="hidden md:block h-[calc(100vh-410px)] bg-[var(--card)] border border-[var(--border)]" style="border-radius: 6px;">
        <!-- Sticky Table Header -->
        <div class="border-b border-[var(--border)] bg-[var(--card-solid)]">
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
                <th class="h-10 pl-10 pr-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Plate No.</th>
                <th class="h-10 px-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Date</th>
                <th class="h-10 px-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Jobs Done</th>
                <th class="h-10 px-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Phone</th>
                <th class="h-10 px-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Part Details</th>
                <th class="h-10 px-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Cost</th>
                <th class="h-10 px-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Vehicle</th>
                <th class="h-10 w-[48px]"></th>
              </tr>
            </thead>
          </table>
        </div>
        
        <!-- Scrollable Table Body -->
        <div 
          ref="desktopScrollContainerRef"
          class="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent" 
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
                class="relative border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--accent)]/5 hover:border-[var(--accent)]/30 transition-all duration-200 cursor-pointer group"
                @click="openViewModal(service)"
              >
                <!-- Loading Overlay -->
                <td v-if="service.loading" class="absolute inset-0 bg-[var(--card)]/90 flex items-center justify-center z-10" colspan="8">
                  <div class="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
                </td>

                <!-- Plate Number -->
                <td class="px-4 py-2 transition-transform duration-200">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 flex-shrink-0 text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <div class="flex items-center gap-1.5 flex-1 min-w-0">
                      <span class="text-sm font-extrabold text-[var(--foreground)] tracking-wider whitespace-nowrap group-hover:text-[var(--accent)] transition-colors duration-200">
                        {{ service.plate_number || '—' }}
                      </span>
                      <JobHistoryBadge v-if="hasJobHistory(service.plate_number)" :job-count="getJobCount(service.plate_number)"/>
                    </div>
                  </div>
                </td>

                <!-- Date -->
                <td class="px-4 py-2">
                  <span class="text-sm font-bold text-[var(--muted-foreground)]">{{ formatDate(service.service_date) }}</span>
                </td>

                <!-- Jobs Done -->
                <td class="px-4 py-2">
                  <span class="text-sm font-medium text-[var(--foreground)]">{{ getJobsSummary(service.jobs_done) }}</span>
                </td>
                
                <!-- Phone -->
                <td class="px-4 py-2">
                  <span v-if="service.phone" class="text-sm font-medium text-[var(--muted-foreground)]">{{ service.phone }}</span>
                  <span v-else class="text-sm text-[var(--muted-foreground)] opacity-50">—</span>
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
                        class="text-[10px] px-2 py-0.5 rounded font-medium whitespace-nowrap bg-[var(--muted)] text-[var(--muted-foreground)]"
                      >
                        +{{ getPartDetailsDisplay(service, 3).remaining }} more
                      </span>
                    </template>
                  </div>
                  <span v-else class="text-sm text-[var(--muted-foreground)] opacity-50">—</span>
                </td>

                <!-- Cost -->
                <td class="px-4 py-2">
                  <span class="text-base font-extrabold text-green-600 tabular-nums">₱{{ service.cost.toFixed(2) }}</span>
                </td>

                <!-- Car Model -->
                <td class="px-4 py-2">
                  <span v-if="service.car_model" class="text-sm font-semibold text-[var(--foreground)]">{{ service.car_model }}</span>
                  <span v-else class="text-sm text-[var(--muted-foreground)] opacity-50">—</span>
                </td>

                <!-- Row Actions -->
                <td class="px-2 py-2" @click.stop>
                  <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <!-- Edit Button -->
                    <button
                      @click="openEditModal(service)"
                      class="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:bg-blue-500/10 transition-colors"
                      style="border-radius: 4px;"
                      title="Edit"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    <!-- Delete Button -->
                    <button
                      @click="deleteService(service.id)"
                      class="p-1.5 text-[var(--muted-foreground)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
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

    <!-- Pagination Controls - Desktop Only (Mobile has it inside scroll container) -->
    <div v-if="totalPages > 1" class="hidden md:flex mt-4 flex-col sm:flex-row items-center justify-between gap-4">
      <!-- Results info -->
      <div class="text-sm text-[var(--muted-foreground)]">
        Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, totalResults) }} of {{ totalResults }} results
      </div>

      <!-- Pagination -->
      <Pagination
        v-slot="{ page }"
        :total="totalResults"
        :items-per-page="ITEMS_PER_PAGE"
        :sibling-count="1"
        :show-edges="true"
        v-model:page="currentPage"
      >
        <PaginationList v-slot="{ items }" class="flex items-center gap-1">
          <PaginationFirst />
          <PaginationPrev />

          <template v-for="(item, index) in items">
            <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
              <Button
                class="w-9 h-9 p-0"
                :variant="item.value === page ? 'default' : 'outline'"
              >
                {{ item.value }}
              </Button>
            </PaginationListItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>

          <PaginationNext />
          <PaginationLast />
        </PaginationList>
      </Pagination>
    </div>

    <!-- ─── MODALS ─── -->
    <ServiceForm
      v-if="showModal"
      :service="selectedService"
      :show="showModal"
      :show-backdrop="true"
      :existing-records="mockDatabase"
      :is-sidebar-collapsed="props.isSidebarCollapsed"
      @close="closeModal"
      @save="handleSave"
    />

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

    <!-- Toast Notification -->
    <ToastNotification
      :show="showToast"
      :message="toastMessage"
      :variant="toastVariant"
      :duration="3000"
      @close="showToast = false"
    />

    <!-- Delete Confirmation Dialog -->
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
import { useDebounce } from '@/composables/useDebounce'
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

const ITEMS_PER_PAGE = 50
const mobileScrollContainerRef = ref(null)
const desktopScrollContainerRef = ref(null)
const initialLoading = ref(true)
const showModal = ref(false)
const showViewModal = ref(false)
const selectedService = ref(null)
const viewService = ref(null)
const searchQuery = ref('')
const openMenuId = ref(null)
const currentPage = ref(1)
const totalResults = ref(0)
const selectedMonth = ref('')
const selectedYear = ref('')
const error = ref(null)
const showMonthDropdown = ref(false)
const showYearDropdown = ref(false)
const monthDropdownRef = ref(null)
const yearDropdownRef = ref(null)
const cardRefs = ref({})
const buttonRefs = ref({})
const swipedCardId = ref(null)
const gestureState = {
  isDragging: {},
  startX: {},
  startY: {},
  currentX: {},
  cardElements: {},
  buttonElements: {}
}

// Toast notification state
const showToast = ref(false)
const toastMessage = ref('')
const toastVariant = ref('success')

// Delete confirmation dialog state
const showDeleteDialog = ref(false)
const selectedDeleteId = ref(null)

const months = [
  { value: '01', label: 'Jan' },
  { value: '02', label: 'Feb' },
  { value: '03', label: 'Mar' },
  { value: '04', label: 'Apr' },
  { value: '05', label: 'May' },
  { value: '06', label: 'Jun' },
  { value: '07', label: 'Jul' },
  { value: '08', label: 'Aug' },
  { value: '09', label: 'Sep' },
  { value: '10', label: 'Oct' },
  { value: '11', label: 'Nov' },
  { value: '12', label: 'Dec' }
]

// Job label mapping
const jobLabels = {
  replace_evaporator_front: 'Evaporator Front',
  replace_evaporator_rear: 'Evaporator Rear',
  replace_condenser: 'Condenser',
  replace_compressor: 'Compressor',
  replace_blower_motor: 'Blower Motor',
  replace_expansion_valve: 'Expansion Valve',
  replace_pulley_assembly: 'Pulley Assembly',
  replace_fan_motor: 'Fan Motor',
  replace_suction_hose_assembly: 'Suction Hose Assembly',
  replace_fan_belt: 'Fan Belt',
  replace_filter_drier: 'Filter Drier',
  replace_discharge_hose_suction: 'Discharge Hose Suction',
  replace_ecv: 'ECV',
  replace_oring: 'O-ring',
  replace_radiator: 'Radiator',
  replace_cabin_filter: 'Cabin Filter',
  replace_magnetic: 'Magnetic',
  pulldown_evaporator: 'Pulldown Evaporator',
  pulldown_condenser: 'Pulldown Condenser',
  pulldown_compressor: 'Pulldown Compressor',
  flushing_system: 'Flushing System',
  install_cabin_filter: 'Install Cabin Filter',
  cleaning: 'Cleaning',
  freon: 'Freon'
}

// ─── SEARCH TOKEN OPTIMIZATION ───
// Memoize indexed records - only rebuild when mockDatabase changes
const indexedRecords = computed(() => {
  return mockDatabase.map(record => ({
    ...record,
    searchableText: [
      record.customer_name,
      record.phone,
      record.car_model,
      record.plate_number,
      record.invoice,
      ...(record.jobs_done || []).map(job => jobLabels[job])
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
  }))
})

// Cache for filtered results to avoid recomputing
const filteredCache = ref(new Map())
const cacheKey = computed(() => 
  `${searchQuery.value}|${selectedMonth.value}|${selectedYear.value}`
)

// ─── OPTIMIZED FILTERING LOGIC ───
function getFilteredRecords(query = '', month = '', year = '') {
  const key = `${query}|${month}|${year}`
  
  // Return cached result if available
  if (filteredCache.value.has(key)) {
    return filteredCache.value.get(key)
  }
  
  let filtered = indexedRecords.value

  // Apply filters in order of selectivity (most restrictive first)
  if (year) {
    filtered = filtered.filter(s => s.service_date?.startsWith(year))
  }

  if (month) {
    filtered = filtered.filter(s => s.service_date?.split('-')[1] === month)
  }

  if (query) {
    const q = query.toLowerCase()
    filtered = filtered.filter(s => s.searchableText.includes(q))
  }

  // Sort once at the end
  const result = filtered
    .slice() // Create a copy to avoid mutating
    .sort((a, b) => new Date(b.service_date) - new Date(a.service_date))
  
  // Cache the result (limit cache size to prevent memory issues)
  if (filteredCache.value.size > 50) {
    const firstKey = filteredCache.value.keys().next().value
    filteredCache.value.delete(firstKey)
  }
  filteredCache.value.set(key, result)
  
  return result
}

// ─── FILTERED SERVICES (ALL RESULTS) ───
const filteredServices = computed(() => {
  return getFilteredRecords(debouncedSearchQuery.value, selectedMonth.value, selectedYear.value)
})

// Toast helper function
function showToastNotification(message, variant = 'success') {
  toastMessage.value = message
  toastVariant.value = variant
  showToast.value = true
}

function getJobsSummary(jobs) {
  if (!jobs || jobs.length === 0) return 'No jobs'
  
  if (jobs.length === 1) {
    return jobLabels[jobs[0]] || jobs[0]
  }
  
  if (jobs.length === 2) {
    return `${jobLabels[jobs[0]] || jobs[0]}, ${jobLabels[jobs[1]] || jobs[1]}`
  }
  
  if (jobs.length === 3) {
    return `${jobLabels[jobs[0]] || jobs[0]}, ${jobLabels[jobs[1]] || jobs[1]}, ${jobLabels[jobs[2]] || jobs[2]}`
  }
  
  return `${jobLabels[jobs[0]] || jobs[0]}, ${jobLabels[jobs[1]] || jobs[1]} +${jobs.length - 2} more`
}

function hasPartConditions(service) {
  if (!service.part_condition && !service.owner_parts) return false
  
  const hasConditions = service.part_condition && Object.keys(service.part_condition).length > 0
  const hasOwnerParts = service.owner_parts && Object.keys(service.owner_parts).some(key => service.owner_parts[key])
  
  return hasConditions || hasOwnerParts
}

function getPartDetailsSummary(service) {
  const summary = {}
  
  if (service.part_condition) {
    Object.entries(service.part_condition).forEach(([job, condition]) => {
      if (condition === 'brand_new') {
        summary[job] = 'Brand New'
      } else if (condition === 'surplus') {
        summary[job] = 'Surplus'
      }
    })
  }
  
  if (service.owner_parts) {
    Object.entries(service.owner_parts).forEach(([job, isOwner]) => {
      if (isOwner) {
        summary[job] = "Owner's Part"
      }
    })
  }
  
  return summary
}

function getPartDetailsDisplay(service, maxVisible = 3) {
  const summary = getPartDetailsSummary(service)
  const entries = Object.entries(summary)
  
  if (entries.length === 0) return { visible: [], remaining: 0 }
  
  return {
    visible: entries.slice(0, maxVisible),
    remaining: Math.max(0, entries.length - maxVisible)
  }
}

const availableYears = computed(() => {
  const years = new Set()
  mockDatabase.forEach(service => {
    if (service.service_date) {
      const year = service.service_date.split('-')[0]
      years.add(year)
    }
  })
  return Array.from(years).sort((a, b) => b - a)
})

// Debounce utility
function debounce(fn, delay) {
  let timeoutId = null
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// ─── PAGINATION COMPUTED ───
const totalPages = computed(() => {
  return Math.ceil(filteredServices.value.length / ITEMS_PER_PAGE)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * ITEMS_PER_PAGE
})

const endIndex = computed(() => {
  return startIndex.value + ITEMS_PER_PAGE
})

const paginatedServices = computed(() => {
  return filteredServices.value.slice(startIndex.value, endIndex.value)
})

// Job History functions
function hasJobHistory(plateNumber) {
  if (!plateNumber) return false
  const jobs = mockDatabase.filter(s => s.plate_number === plateNumber)
  return jobs.length > 1
}

function getJobCount(plateNumber) {
  if (!plateNumber) return 0
  return mockDatabase.filter(s => s.plate_number === plateNumber).length
}

function viewJobFromHistory(job) {
  viewService.value = job 
}

function getMonthName(monthValue) {
  const month = months.find(m => m.value === monthValue)
  return month ? month.label : monthValue
}

function clearFilters() {
  selectedMonth.value = ''
  selectedYear.value = ''
  searchQuery.value = ''
  debouncedSearchQuery.value = ''
}

function handleClickOutside(event) {
  openMenuId.value = null
  
  // Close any open swiped card
  if (swipedCardId.value !== null) {
    closeSwipe(swipedCardId.value)
  }

  if (monthDropdownRef.value && !monthDropdownRef.value.contains(event.target)) {
    showMonthDropdown.value = false
  }

  if (yearDropdownRef.value && !yearDropdownRef.value.contains(event.target)) {
    showYearDropdown.value = false
  }
}

// Debounced search - waits for user to stop typing before searching
const { debouncedValue: debouncedSearchQuery, setValue: setSearchQuery } =
  useDebounce(300);

watch(searchQuery, (newQuery) => {
  setSearchQuery(newQuery);
  currentPage.value = 1;
});

// Watch filters - reset to page 1 immediately
watch([selectedMonth, selectedYear], () => {
  currentPage.value = 1
})

// Watch current page to scroll both containers to top
watch(currentPage, async () => {
  await nextTick()
  // Scroll mobile container
  if (mobileScrollContainerRef.value) {
    mobileScrollContainerRef.value.scrollTop = 0
  }
  // Scroll desktop container
  if (desktopScrollContainerRef.value) {
    desktopScrollContainerRef.value.scrollTop = 0
  }
})

// Watch filtered services to update total
watch(filteredServices, (newVal) => {
  totalResults.value = newVal.length
}, { immediate: true })

onMounted(() => {
  initialLoading.value = true
  
  // Simulate initial load
  setTimeout(() => {
    totalResults.value = filteredServices.value.length
    initialLoading.value = false
  }, 300)
  
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function toggleMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id
}

function openAddModal() {
  selectedService.value = null
  showModal.value = true
  openMenuId.value = null
}

function openViewModal(service) {
  viewService.value = { ...service }
  showViewModal.value = true
  openMenuId.value = null
}

function closeViewModal() {
  showViewModal.value = false
  viewService.value = null
}

function openEditModal(service) {
  selectedService.value = { ...service }
  showModal.value = true
  showViewModal.value = false
  openMenuId.value = null
}

function handleEditFromView(service) {
  const dbIndex = mockDatabase.findIndex(s => s.id === service.id)
  if (dbIndex !== -1) {
    mockDatabase[dbIndex] = { ...service }
  }
  
  viewService.value = { ...service }
  showToastNotification('Record has been updated successfully', 'success')
}

function closeModal() {
  showModal.value = false
  selectedService.value = null
}

async function handleSave(serviceData) {
  const tempId = `temp-${Date.now()}`
  const isEditMode = !!serviceData.id

  if (isEditMode) {
    const dbIndex = mockDatabase.findIndex(s => s.id === serviceData.id)
    if (dbIndex !== -1) {
      mockDatabase[dbIndex] = { ...serviceData }
    }
    
    // Invalidate cache when data changes
    filteredCache.value.clear()
    
    showToastNotification('Record has been updated successfully', 'success')
  } else {
    const newService = {
      ...serviceData,
      id: tempId,
      loading: true,
      created_at: new Date().toISOString().split('T')[0]
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 800))

      const newId = Math.max(...mockDatabase.map(s => s.id), 0) + 1
      const savedService = { ...newService, id: newId, loading: false }

      mockDatabase.unshift(savedService)
      
      // Invalidate cache when data changes
      filteredCache.value.clear()
      
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
  openMenuId.value = null
}

function confirmDelete() {
  if (selectedDeleteId.value) {
    const dbIndex = mockDatabase.findIndex(s => s.id === selectedDeleteId.value)
    if (dbIndex !== -1) {
      mockDatabase.splice(dbIndex, 1)
    }
    
    // Invalidate cache when data changes
    filteredCache.value.clear()
    
    showToastNotification('Record deleted successfully', 'success')
    
    selectedDeleteId.value = null
    showDeleteDialog.value = false
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  } catch {
    return 'Invalid Date'
  }
}

function toggleMonthDropdown() {
  showMonthDropdown.value = !showMonthDropdown.value
  showYearDropdown.value = false
}

function toggleYearDropdown() {
  showYearDropdown.value = !showYearDropdown.value
  showMonthDropdown.value = false
}

function selectMonth(month) {
  selectedMonth.value = selectedMonth.value === month ? '' : month
  showMonthDropdown.value = false
}

function selectYear(year) {
  selectedYear.value = selectedYear.value === year ? '' : year
  showYearDropdown.value = false
}

function setCardRef(el, serviceId) {
  if (el) {
    cardRefs.value[serviceId] = el
  }
}

function setButtonRef(el, serviceId, buttonType) {
  if (el) {
    if (!buttonRefs.value[serviceId]) {
      buttonRefs.value[serviceId] = {}
    }
    buttonRefs.value[serviceId][buttonType] = el
  }
}

function updateButtonVisibility(serviceId, revealPercent) {
  const buttons = gestureState.buttonElements[serviceId] || buttonRefs.value[serviceId]
  if (!buttons) return
  
  const opacity = revealPercent
  const scale = 0.8 + (revealPercent * 0.2)
  
  // Use will-change for optimization hint
  if (buttons.edit) {
    buttons.edit.style.willChange = revealPercent > 0 ? 'opacity, transform' : 'auto'
    buttons.edit.style.opacity = opacity
    buttons.edit.style.transform = `scale(${scale})`
  }
  
  if (buttons.delete) {
    buttons.delete.style.willChange = revealPercent > 0 ? 'opacity, transform' : 'auto'
    buttons.delete.style.opacity = opacity
    buttons.delete.style.transform = `scale(${scale})`
  }
}

function handleTouchStart(e, serviceId) {
  const card = cardRefs.value[serviceId]
  if (!card) return
  
  // Cache element references
  gestureState.cardElements[serviceId] = card
  gestureState.buttonElements[serviceId] = buttonRefs.value[serviceId]
  
  gestureState.startX[serviceId] = e.touches[0].clientX
  gestureState.startY[serviceId] = e.touches[0].clientY
  gestureState.isDragging[serviceId] = false
  
  // Store current position directly from transform
  const currentTransform = card.style.transform || 'translateX(0px)'
  const match = currentTransform.match(/translateX\(([-\d.]+)px\)/)
  gestureState.currentX[serviceId] = match ? parseFloat(match[1]) : 0
}

function handleTouchMove(e, serviceId) {
  const state = gestureState
  if (!state.startX[serviceId]) return
  
  const currentX = e.touches[0].clientX
  const currentY = e.touches[0].clientY
  const deltaX = currentX - state.startX[serviceId]
  const deltaY = currentY - state.startY[serviceId]
  
  // Determine if horizontal swipe
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
    if (!state.isDragging[serviceId]) {
      state.isDragging[serviceId] = true
      // Disable transition once
      const card = state.cardElements[serviceId]
      if (card) card.style.transition = 'none'
    }
    
    e.preventDefault()
    
    const card = state.cardElements[serviceId]
    if (!card) return
    
    // Calculate new position
    const startX = state.currentX[serviceId] || 0
    let newX = startX + deltaX
    
    const maxSwipe = -136
    newX = Math.max(maxSwipe, Math.min(0, newX))
    
    // Use transform3d for hardware acceleration
    card.style.transform = `translate3d(${newX}px, 0, 0)`
    
    // Update buttons with RAF for smoother animation
    const revealPercent = Math.abs(newX) / Math.abs(maxSwipe)
    requestAnimationFrame(() => {
      updateButtonVisibility(serviceId, revealPercent)
    })
  }
}

function handleTouchEnd(e, serviceId) {
  const state = gestureState
  
  if (!state.isDragging[serviceId]) {
    // Clean up
    delete state.isDragging[serviceId]
    return
  }
  
  const card = state.cardElements[serviceId]
  if (!card) return
  
  const currentTransform = card.style.transform
  const match = currentTransform.match(/translate3d\(([-\d.]+)px/)
  const currentX = match ? parseFloat(match[1]) : 0
  
  // Re-enable transition
  card.style.transition = 'transform 0.25s cubic-bezier(0.4, 0.0, 0.2, 1)'
  
  // Snap to position
  if (currentX < -68) {
    card.style.transform = 'translate3d(-136px, 0, 0)'
    swipedCardId.value = serviceId
    requestAnimationFrame(() => updateButtonVisibility(serviceId, 1))
  } else {
    card.style.transform = 'translate3d(0px, 0, 0)'
    swipedCardId.value = null
    requestAnimationFrame(() => updateButtonVisibility(serviceId, 0))
  }
  
  // Cleanup
  delete state.isDragging[serviceId]
  delete state.startX[serviceId]
  delete state.startY[serviceId]
  delete state.currentX[serviceId]
  delete state.cardElements[serviceId]
  delete state.buttonElements[serviceId]
}

function handleCardClick(service) {
  // Use plain object instead of reactive ref
  if (!gestureState.isDragging[service.id]) {
    if (swipedCardId.value === service.id) {
      closeSwipe(service.id)
    } else {
      openViewModal(service)
    }
  }
}
function closeSwipe(serviceId) {
  const card = cardRefs.value[serviceId]
  const buttons = buttonRefs.value[serviceId]
  
  if (card) {
    card.style.transition = 'transform 0.25s cubic-bezier(0.4, 0.0, 0.2, 1)'
    card.style.transform = 'translateX(0px)'
  }
  
  if (buttons) {
    if (buttons.edit) {
      buttons.edit.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out'
    }
    if (buttons.delete) {
      buttons.delete.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out'
    }
    updateButtonVisibility(serviceId, 0)
  }
  
  swipedCardId.value = null
}
</script>