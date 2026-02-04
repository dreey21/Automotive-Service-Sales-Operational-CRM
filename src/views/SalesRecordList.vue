<template>
  <div>
    <!-- Header Bar - Clean & Functional -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-xl md:text-2xl font-bold text-[var(--foreground)] tracking-tight">
          Recent Transactions
        </h2>
        <p class="text-xs text-[var(--muted-foreground)] mt-0.5">
          {{ filteredServices.length }} record{{ filteredServices.length !== 1 ? 's' : '' }}
        </p>
      </div>
      
      <!-- Primary Action - Bold & Clear -->
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

    <!-- Search Bar - Standard Pattern -->
    <div class="mb-3">
      <div class="relative">
        <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search plate number, customer, invoice..."
          class="w-full h-11 pl-11 pr-3 bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          style="border-radius: 6px;"
        />
      </div>
    </div>

    <!-- Filter Chips - Always Visible -->
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

    <!-- Scrollable Area -->
    <div class="h-[calc(100vh-380px)] md:h-[calc(100vh-340px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
      <!-- Error State -->
      <div v-if="error" class="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm" style="border-radius: 6px;">
        {{ error }}
      </div>

      <!-- ─── LOADING SKELETONS ─── -->
      <template v-if="initialLoading">
        <!-- Mobile skeleton (cards) -->
        <div class="md:hidden space-y-2">
          <div
            v-for="i in 8"
            :key="`skel-card-${i}`"
            class="bg-[var(--card)] border border-[var(--border)] p-3 animate-pulse"
            style="border-radius: 6px;"
          >
            <div class="flex items-start justify-between mb-2">
              <div class="h-4 bg-[var(--muted)] w-1/3" style="border-radius: 3px;"></div>
              <div class="h-5 bg-[var(--muted)] w-1/4" style="border-radius: 3px;"></div>
            </div>
            <div class="h-3 bg-[var(--muted)] w-2/3 mb-1.5" style="border-radius: 3px;"></div>
            <div class="h-3 bg-[var(--muted)] w-1/2" style="border-radius: 3px;"></div>
          </div>
        </div>

        <!-- Desktop skeleton (table rows) -->
        <div class="hidden md:block bg-[var(--card)] border border-[var(--border)] overflow-hidden" style="border-radius: 6px;">
          <table class="w-full">
            <thead>
              <tr class="border-b border-[var(--border)] bg-[var(--muted)]/40">
                <th class="h-10 px-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Plate No.</th>
                <th class="h-10 px-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Date</th>
                <th class="h-10 px-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Jobs Done</th>
                <th class="h-10 px-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Part Details</th>
                <th class="h-10 px-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Cost</th>
                <th class="h-10 px-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Vehicle</th>
                <th class="h-10 w-[48px]"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in 10" :key="`skel-row-${i}`" class="border-b border-[var(--border)] animate-pulse">
                <td class="px-4 py-4"><div class="h-3.5 bg-[var(--muted)] w-[70px]" style="border-radius: 3px;"></div></td>
                <td class="px-4 py-4"><div class="h-3.5 bg-[var(--muted)] w-[80px]" style="border-radius: 3px;"></div></td>
                <td class="px-4 py-4"><div class="h-3.5 bg-[var(--muted)] w-[70px]" style="border-radius: 3px;"></div></td>
                <td class="px-4 py-4"><div class="h-3.5 bg-[var(--muted)] w-[90px]" style="border-radius: 3px;"></div></td>
                <td class="px-4 py-4"><div class="h-3.5 bg-[var(--muted)] w-[120px]" style="border-radius: 3px;"></div></td>
                <td class="px-4 py-4"><div class="h-3.5 bg-[var(--muted)] w-[90px]" style="border-radius: 3px;"></div></td>
                <td class="px-2 py-4"><div class="h-3.5 bg-[var(--muted)] w-[18px] mx-auto" style="border-radius: 3px;"></div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- EMPTY STATE (shared) -->
      <div v-else-if="filteredServices.length === 0" class="text-center py-20 bg-[var(--card)] border border-[var(--border)]" style="border-radius: 6px;">
        <svg class="w-14 h-14 mx-auto mb-4 text-[var(--muted-foreground)] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-[var(--foreground)] font-medium mb-1">
          {{ searchQuery || selectedMonth || selectedYear ? 'No matching records' : 'No sales records' }}
        </p>
        <p class="text-[var(--muted-foreground)] text-sm">
          {{ searchQuery || selectedMonth || selectedYear ? 'Try adjusting your filters' : 'Tap "Add Record" to create your first entry' }}
        </p>
      </div>

      <!-- RECORDS: MOBILE CARDS + DESKTOP TABLE -->
      <template v-else>
      <!-- Mobile: Card List -->
      <div class="md:hidden space-y-2">
        <div
          v-for="service in filteredServices"
          :key="`card-${service.id}`"
          class="relative bg-[var(--card)] border border-[var(--border)] p-3 hover:border-[var(--accent)]/60 hover:shadow-md transition-all cursor-pointer active:scale-[0.98] group"
          style="border-radius: 6px;"
          @click="openViewModal(service)"
        >
          <!-- Loading Overlay -->
          <div v-if="service.loading" class="absolute inset-0 bg-[var(--card)]/90 flex items-center justify-center z-10" style="border-radius: 6px;">
            <div class="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
          </div>

          <!-- Click Hint Icon -->
          <div class="absolute top-2.5 left-2.5 opacity-0 group-hover:opacity-40 transition-opacity">
            <svg class="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>

          <!-- Menu Button -->
          <button
            @click.stop="toggleMenu(service.id)"
            class="absolute top-2.5 right-2.5 p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50 transition-colors z-10"
            style="border-radius: 4px;"
          >
            <svg class="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="openMenuId === service.id"
            class="absolute top-10 right-2.5 bg-[var(--card)] border border-[var(--border)] shadow-lg overflow-hidden z-20 min-w-[150px]"
            style="border-radius: 6px;"
            @click.stop
          >
            <button
              @click="openEditModal(service)"
              class="w-full px-3 py-2.5 text-left text-sm text-[var(--foreground)] hover:bg-[var(--muted)]/70 transition-colors flex items-center gap-2.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <div class="border-t border-[var(--border)]"></div>
            <button
              @click="deleteService(service.id)"
              class="w-full px-3 py-2.5 text-left text-sm text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>

          <!-- Card Content -->
          <div class="pr-8">
            <!-- Primary: Plate Number + Date -->
            <div class="flex items-baseline justify-between mb-2">
              <h3 class="text-base font-extrabold text-[var(--foreground)] truncate flex-1 leading-tight font-mono tracking-wider">
                {{ service.plate_number || 'Walk-in' }}
                <span v-if="hasJobHistory(service.plate_number)" class="ml-1.5 text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded font-sans font-medium tracking-normal">
                  {{ getJobCount(service.plate_number) }} Records
                </span>
              </h3>
              <span class="text-sm font-bold text-[var(--accent)] flex-shrink-0">{{ formatDate(service.service_date) }}</span>
            </div>

            <!-- Secondary: Jobs Done -->
            <div class="flex items-center gap-1.5 mb-2 text-[13px]">
              <svg class="w-3.5 h-3.5 flex-shrink-0 text-[var(--muted-foreground)] opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span class="truncate font-medium text-[var(--foreground)]">{{ getJobsSummary(service.jobs_done) }}</span>
            </div>

            <!-- Part Details badges -->
            <div v-if="hasPartConditions(service)" class="mb-2 flex flex-wrap gap-1">
              <span v-for="(condition, job) in getPartDetailsSummary(service)" :key="job" :class="[
                'text-[10px] px-1.5 py-0.5 rounded font-medium',
                condition === 'Brand New' ? 'bg-green-500/20 text-green-400' :
                condition === 'Surplus' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-purple-500/20 text-purple-400'
              ]">
                {{ condition }}
              </span>
            </div>

            <!-- Tertiary: Cost -->
            <div class="mb-2">
              <span class="text-lg font-extrabold text-blue-300 tabular-nums">₱{{ service.cost.toFixed(2) }}</span>
            </div>

            <!-- Quaternary: Vehicle Model + Customer -->
            <div class="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
              <svg class="w-3.5 h-3.5 flex-shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0h.01M15 17a2 2 0 104 0m-4 0h.01M17 16h.01" />
              </svg>
              <span class="truncate">
                <span v-if="service.car_model" class="font-semibold">{{ service.car_model }}</span>
                <span v-else class="italic opacity-60">No vehicle</span>
                <span v-if="service.car_model && service.customer_name" class="opacity-100 mx-1">·</span>
                <span v-if="service.customer_name" class="opacity-75">{{ service.customer_name }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop: Table -->
      <div class="hidden md:block bg-[var(--card)] border border-[var(--border)] overflow-hidden" style="border-radius: 6px;">
        <table class="w-full border-collapse">
          <thead>
            <tr class="border-b border-[var(--border)] bg-[var(--muted)]/40">
              <th class="h-10 px-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Plate No.</th>
              <th class="h-10 px-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Date</th>
              <th class="h-10 px-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Jobs Done</th>
              <th class="h-10 px-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Part Details</th>
              <th class="h-10 px-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Cost</th>
              <th class="h-10 px-4 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Vehicle</th>
              <th class="h-10 w-[48px]"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="service in filteredServices"
              :key="`row-${service.id}`"
              class="relative border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--muted)]/40 hover:shadow-sm transition-all cursor-pointer group"
              @click="openViewModal(service)"
            >
              <!-- Loading Overlay -->
              <td v-if="service.loading" class="absolute inset-0 bg-[var(--card)]/90 flex items-center justify-center z-10" colspan="7">
                <div class="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
              </td>

              <!-- Plate Number -->
              <td class="px-4 py-3 group-hover:scale-[1.01] transition-transform">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-[var(--accent)] opacity-0 group-hover:opacity-60 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <div>
                    <span class="text-sm font-extrabold text-[var(--foreground)] tracking-wider">
                      {{ service.plate_number || '—' }}
                    </span>
                    <span v-if="hasJobHistory(service.plate_number)" class="ml-1.5 text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded font-sans font-medium">
                      {{ getJobCount(service.plate_number) }} Records
                    </span>
                  </div>
                </div>
              </td>

              <!-- Date -->
              <td class="px-4 py-3">
                <span class="text-sm font-bold text-[var(--accent)]">{{ formatDate(service.service_date) }}</span>
              </td>

              <!-- Jobs Done -->
              <td class="px-4 py-3">
                <span class="text-sm font-medium text-[var(--foreground)]">{{ getJobsSummary(service.jobs_done) }}</span>
              </td>
              
              <!-- Part Details -->
              <td class="px-4 py-3">
                <div v-if="hasPartConditions(service)" class="flex flex-wrap gap-1">
                  <span v-for="(condition, job) in getPartDetailsSummary(service)" :key="job" :class="[
                    'text-[10px] px-2 py-0.5 rounded font-medium whitespace-nowrap',
                    condition === 'Brand New' ? 'bg-green-500/20 text-green-400' :
                    condition === 'Surplus' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-purple-500/20 text-purple-400'
                  ]">
                    {{ condition }}
                  </span>
                </div>
                <span v-else class="text-sm text-[var(--muted-foreground)] opacity-50">—</span>
              </td>

              <!-- Cost -->
              <td class="px-4 py-3">
                <span class="text-base font-extrabold text-blue-300 tabular-nums">₱{{ service.cost.toFixed(2) }}</span>
              </td>

              <!-- Car Model -->
              <td class="px-4 py-3">
                <span v-if="service.car_model" class="text-sm font-semibold text-[var(--foreground)]">{{ service.car_model }}</span>
                <span v-else class="text-sm text-[var(--muted-foreground)] opacity-50">—</span>
              </td>

              <!-- Row Actions -->
              <td class="px-2 py-3" @click.stop>
                <div class="relative">
                  <button
                    @click="toggleMenu(service.id)"
                    class="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50 transition-colors"
                    style="border-radius: 4px;"
                  >
                    <svg class="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </button>

                  <!-- Row Dropdown Menu -->
                  <div
                    v-if="openMenuId === service.id"
                    class="absolute top-full right-0 mt-1 bg-[var(--card)] border border-[var(--border)] shadow-lg overflow-hidden z-20 min-w-[150px]"
                    style="border-radius: 6px;"
                    @click.stop
                  >
                    <button
                      @click="openEditModal(service)"
                      class="w-full px-3 py-2.5 text-left text-sm text-[var(--foreground)] hover:bg-[var(--muted)]/70 transition-colors flex items-center gap-2.5"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <div class="border-t border-[var(--border)]"></div>
                    <button
                      @click="deleteService(service.id)"
                      class="w-full px-3 py-2.5 text-left text-sm text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2.5"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      </template>

      <!-- Loading More -->
      <div v-if="loadingMore" class="mt-4 text-center py-4">
        <div class="inline-block w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Intersection Observer target -->
      <div ref="observerTarget" class="h-10"></div>

      <!-- Limit Message -->
      <div v-if="limitReached && !searchQuery && !selectedMonth && !selectedYear && filteredServices.length > 0" class="mt-4 text-center py-3 bg-[var(--card)] border border-[var(--border)] text-xs text-[var(--muted-foreground)]" style="border-radius: 6px;">
        Showing {{ filteredServices.length }} recent records · Use search to find older entries
      </div>

      <!-- Footer -->
      <footer v-if="limitReached && !searchQuery && !selectedMonth && !selectedYear && filteredServices.length > 0" class="hidden md:block mt-8 pt-6 border-t border-[var(--border)] text-center">
        <p class="text-xs text-[var(--muted-foreground)]">
          © 2020 4DM Auto Care Center. All rights reserved.
        </p>
      </footer>

      <div class="h-4"></div>
    </div>

    <!-- ─── MODALS ─── -->
    <ServiceForm
      v-if="showModal"
      :service="selectedService"
      :show="showModal"
      :show-backdrop="true"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import ServiceForm from '../components/ServiceForm.vue'
import ViewDetailsModal from '../components/ViewDetailsModal.vue'
import { mockDatabase } from '../data/mockData.js'

const props = defineProps({
  isSidebarCollapsed: {
    type: Boolean,
    default: false
  }
})

const MAX_ITEMS_IN_VIEW = 50
const ITEMS_PER_LOAD = 10

const displayedServices = ref([])
const initialLoading = ref(true)
const loadingMore = ref(false)
const showModal = ref(false)
const showViewModal = ref(false)
const selectedService = ref(null)
const viewService = ref(null)
const searchQuery = ref('')
const openMenuId = ref(null)
const currentPage = ref(0)
const hasMore = ref(true)
const limitReached = ref(false)
const selectedMonth = ref('')
const selectedYear = ref('')
const error = ref(null)
const observerTarget = ref(null)
const showMonthDropdown = ref(false)
const showYearDropdown = ref(false)
const monthDropdownRef = ref(null)
const yearDropdownRef = ref(null)
const isLoadingInProgress = ref(false)

let observer = null

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
  // Replace jobs
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
  // Pulldown jobs
  pulldown_evaporator: 'Pulldown Evaporator',
  pulldown_condenser: 'Pulldown Condenser',
  pulldown_compressor: 'Pulldown Compressor',
  // Other jobs
  flushing_system: 'Flushing System',
  install_cabin_filter: 'Install Cabin Filter',
  cleaning: 'Cleaning',
  freon: 'Freon'
}

function getJobsSummary(jobs) {
  if (!jobs || jobs.length === 0) return 'No jobs'
  
  if (jobs.length === 1) {
    return jobLabels[jobs[0]] || jobs[0]
  }
  
  if (jobs.length === 2) {
    return `${jobLabels[jobs[0]] || jobs[0]}, ${jobLabels[jobs[1]] || jobs[1]}`
  }
  
  return `${jobLabels[jobs[0]] || jobs[0]} +${jobs.length - 1} more`
}

function hasPartConditions(service) {
  if (!service.part_condition && !service.owner_parts) return false
  
  const hasConditions = service.part_condition && Object.keys(service.part_condition).length > 0
  const hasOwnerParts = service.owner_parts && Object.keys(service.owner_parts).some(key => service.owner_parts[key])
  
  return hasConditions || hasOwnerParts
}

function getPartDetailsSummary(service) {
  const summary = {}
  
  // Add part conditions (Brand New, Surplus)
  if (service.part_condition) {
    Object.entries(service.part_condition).forEach(([job, condition]) => {
      if (condition === 'brand_new') {
        summary[job] = 'Brand New'
      } else if (condition === 'surplus') {
        summary[job] = 'Surplus'
      }
    })
  }
  
  // Add owner's parts
  if (service.owner_parts) {
    Object.entries(service.owner_parts).forEach(([job, isOwner]) => {
      if (isOwner) {
        summary[job] = "Owner's Part"
      }
    })
  }
  
  return summary
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

const filteredServices = computed(() => {
  // Deduplicate by ID
  const uniqueMap = new Map()
  displayedServices.value.forEach(service => {
    if (!uniqueMap.has(service.id)) {
      uniqueMap.set(service.id, service)
    }
  })
  return Array.from(uniqueMap.values())
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
  viewService.value = { ...job }
}

function getMonthName(monthValue) {
  const month = months.find(m => m.value === monthValue)
  return month ? month.label : monthValue
}

function clearFilters() {
  selectedMonth.value = ''
  selectedYear.value = ''
  searchQuery.value = ''
}

function fetchServices(page, query = '', month = '', year = '') {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        let filtered = [...mockDatabase]

        if (month) {
          filtered = filtered.filter(s => s.service_date?.split('-')[1] === month)
        }

        if (year) {
          filtered = filtered.filter(s => s.service_date?.split('-')[0] === year)
        }

        if (query) {
          const q = query.toLowerCase()
          filtered = filtered.filter(s =>
            s.customer_name?.toLowerCase().includes(q) ||
            s.phone?.toLowerCase().includes(q) ||
            s.car_model?.toLowerCase().includes(q) ||
            s.plate_number?.toLowerCase().includes(q) ||
            s.invoice?.toLowerCase().includes(q) ||
            s.jobs_done?.some(job => jobLabels[job]?.toLowerCase().includes(q))
          )
        }

        // Remove duplicates based on ID
        const uniqueMap = new Map()
        filtered.forEach(service => {
          if (!uniqueMap.has(service.id)) {
            uniqueMap.set(service.id, service)
          }
        })
        filtered = Array.from(uniqueMap.values())

        filtered.sort((a, b) => new Date(b.service_date) - new Date(a.service_date))

        const start = page * ITEMS_PER_LOAD
        const end = start + ITEMS_PER_LOAD
        const items = filtered.slice(start, end)

        resolve({
          items,
          hasMore: end < filtered.length,
          total: filtered.length
        })
      } catch (err) {
        reject(new Error('Failed to fetch services'))
      }
    }, 300)
  })
}

async function loadMore() {
  if (isLoadingInProgress.value || loadingMore.value || !hasMore.value || limitReached.value) return

  if (displayedServices.value.length >= MAX_ITEMS_IN_VIEW) {
    limitReached.value = true
    hasMore.value = false
    return
  }

  isLoadingInProgress.value = true
  loadingMore.value = true
  error.value = null

  try {
    const response = await fetchServices(
      currentPage.value,
      searchQuery.value,
      selectedMonth.value,
      selectedYear.value
    )

    // Check for duplicates before adding
    const existingIds = new Set(displayedServices.value.map(s => s.id))
    const newItems = response.items.filter(item => !existingIds.has(item.id))

    displayedServices.value.push(...newItems)
    currentPage.value++
    hasMore.value = response.hasMore && displayedServices.value.length < MAX_ITEMS_IN_VIEW

    if (displayedServices.value.length >= MAX_ITEMS_IN_VIEW) {
      limitReached.value = true
      hasMore.value = false
    }
  } catch (err) {
    error.value = 'Failed to load more records. Please try again.'
    console.error('Error loading services:', err)
  } finally {
    loadingMore.value = false
    isLoadingInProgress.value = false
  }
}

async function initialLoad() {
  if (isLoadingInProgress.value) return
  
  isLoadingInProgress.value = true
  initialLoading.value = true
  error.value = null

  try {
    const response = await fetchServices(
      0,
      searchQuery.value,
      selectedMonth.value,
      selectedYear.value
    )
    displayedServices.value = response.items
    currentPage.value = 1
    hasMore.value = response.hasMore
    limitReached.value = false
  } catch (err) {
    error.value = 'Failed to load sales records. Please refresh the page.'
    console.error('Error loading initial services:', err)
  } finally {
    initialLoading.value = false
    isLoadingInProgress.value = false
  }
}

function setupIntersectionObserver() {
  if (observer) observer.disconnect()

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !isLoadingInProgress.value && !loadingMore.value && hasMore.value && !limitReached.value) {
        loadMore()
      }
    },
    { threshold: 0.1 }
  )

  if (observerTarget.value) observer.observe(observerTarget.value)
}

function handleClickOutside(event) {
  openMenuId.value = null

  if (monthDropdownRef.value && !monthDropdownRef.value.contains(event.target)) {
    showMonthDropdown.value = false
  }

  if (yearDropdownRef.value && !yearDropdownRef.value.contains(event.target)) {
    showYearDropdown.value = false
  }
}

// Create debounced search handler
const debouncedSearch = debounce(async () => {
  if (observer) observer.disconnect()
  
  displayedServices.value = []
  currentPage.value = 0
  hasMore.value = true
  limitReached.value = false
  
  await initialLoad()
  
  await nextTick()
  setupIntersectionObserver()
}, 300) // 300ms delay

// Watch with debounce for search, immediate for filters
watch(searchQuery, () => {
  debouncedSearch()
})

watch([selectedMonth, selectedYear], async () => {
  if (observer) observer.disconnect()
  
  displayedServices.value = []
  currentPage.value = 0
  hasMore.value = true
  limitReached.value = false
  
  await initialLoad()
  
  await nextTick()
  setupIntersectionObserver()
})

onMounted(() => {
  initialLoad()
  setupIntersectionObserver()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
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
  const index = displayedServices.value.findIndex(s => s.id === service.id)
  if (index !== -1) {
    displayedServices.value[index] = { ...service }
  }

  const dbIndex = mockDatabase.findIndex(s => s.id === service.id)
  if (dbIndex !== -1) {
    mockDatabase[dbIndex] = { ...service }
  }

  viewService.value = { ...service }
}

function closeModal() {
  showModal.value = false
  selectedService.value = null
}

async function handleSave(serviceData) {
  const tempId = `temp-${Date.now()}`

  if (serviceData.id) {
    const index = displayedServices.value.findIndex(s => s.id === serviceData.id)
    if (index !== -1) {
      displayedServices.value[index] = { ...serviceData }
    }

    const dbIndex = mockDatabase.findIndex(s => s.id === serviceData.id)
    if (dbIndex !== -1) {
      mockDatabase[dbIndex] = { ...serviceData }
    }
  } else {
    const newService = {
      ...serviceData,
      id: tempId,
      loading: true,
      created_at: new Date().toISOString().split('T')[0]
    }

    displayedServices.value.unshift(newService)

    try {
      await new Promise(resolve => setTimeout(resolve, 800))

      const newId = Math.max(...mockDatabase.map(s => s.id), 0) + 1
      const savedService = { ...newService, id: newId, loading: false }

      const index = displayedServices.value.findIndex(s => s.id === tempId)
      if (index !== -1) {
        displayedServices.value[index] = savedService
      }

      mockDatabase.unshift(savedService)

      if (displayedServices.value.length > MAX_ITEMS_IN_VIEW) {
        displayedServices.value.pop()
      }
    } catch (err) {
      displayedServices.value = displayedServices.value.filter(s => s.id !== tempId)
      error.value = 'Failed to save record. Please try again.'
      console.error('Error saving service:', err)
    }
  }

  closeModal()
}

function deleteService(id) {
  if (confirm('Delete this sales record? This action cannot be undone.')) {
    displayedServices.value = displayedServices.value.filter(s => s.id !== id)

    const dbIndex = mockDatabase.findIndex(s => s.id === id)
    if (dbIndex !== -1) {
      mockDatabase.splice(dbIndex, 1)
    }

    openMenuId.value = null
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
</script>