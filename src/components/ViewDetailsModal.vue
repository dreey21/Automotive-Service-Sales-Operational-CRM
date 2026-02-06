<template>
  <div v-if="show">
    <!-- Backdrop with fade -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="showBackdrop"
        class="fixed inset-0 bg-black/50 z-40 transition-[left] duration-300 ease-in-out"
        :class="isSidebarCollapsed ? 'md:left-16' : 'md:left-64'"
        @click="close"
      ></div>
    </transition>

    <!-- Main Modal Panel -->
    <div class="fixed inset-0 z-50 flex flex-col transition-[left] duration-300 ease-in-out bg-[var(--background)]"
         :class="isSidebarCollapsed ? 'md:left-16' : 'md:left-64'">
      <!-- Header Bar -->
      <div class="bg-grey-950 px-3.5 py-3.5 flex items-center gap-3">
        <button
          @click="close"
          class="p-2 -ml-2 text-[var(--foreground)] hover:bg-[var(--muted)]/50 transition-colors"
          style="border-radius: 6px;"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div class="flex-1 min-w-0">
          <h1 class="text-lg font-bold text-[var(--foreground)] tracking-tight truncate">
            Service Details
          </h1>
        </div>
        <button
          @click="handleEdit"
          class="px-4 py-2 text-sm font-semibold text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
          style="border-radius: 6px;"
        >
          Edit
        </button>
      </div>

      <!-- Recent Service History Component -->
      <RecentServiceHistory
        v-if="currentService.plate_number && jobHistory.length > 1"
        :jobs="jobHistory"
        :current-job-id="currentService.id"
        @select-job="viewJob"
        @view-all="showFullHistory = true"
      />

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto hide-scrollbar pb-20 md:pb-0">
        <!-- MOBILE LAYOUT (default) -->
        <div class="md:hidden p-4 space-y-5">
          
          <!-- PRIMARY INFO SECTION -->
          <div class="space-y-5">
            <!-- Plate Number with Warranty Badge -->
            <div v-if="currentService.plate_number">
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-2.5">
                  <svg class="w-5 h-5 text-[var(--muted-foreground)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <div>
                    <p class="text-xs text-[var(--muted-foreground)] font-medium uppercase tracking-wide">Plate Number</p>
                    <p class="text-xl font-bold text-[var(--foreground)] tracking-tight">{{ currentService.plate_number }}</p>
                  </div>
                </div>
                <!-- Warranty status badge -->
                <span 
                  v-if="warrantyStatus"
                  :class="[
                    'px-3 py-1.5 text-xs font-bold uppercase tracking-wide flex-shrink-0',
                    warrantyStatus === 'active' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  ]"
                  style="border-radius: 6px;"
                >
                  {{ warrantyStatus === 'active' ? 'In Warranty' : 'Out of Warranty' }}
                </span>
              </div>
            </div>

            <!-- Invoice & Date -->
            <div class="grid grid-cols-2 gap-3">
              <div v-if="currentService.invoice" class="flex items-start gap-2.5">
                <svg class="w-5 h-5 text-[var(--muted-foreground)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p class="text-xs text-[var(--muted-foreground)] font-medium uppercase tracking-wide">Invoice</p>
                  <p class="text-base font-semibold text-[var(--foreground)] leading-tight">#{{ currentService.invoice }}</p>
                </div>
              </div>
              
              <div class="flex items-start gap-2.5">
                <svg class="w-5 h-5 text-[var(--muted-foreground)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p class="text-xs text-[var(--muted-foreground)] font-medium uppercase tracking-wide">Date</p>
                  <p class="text-base font-semibold text-[var(--foreground)] leading-tight">{{ formatDate(currentService.service_date) }}</p>
                </div>
              </div>
            </div>

            <!-- Price -->
            <div class="flex items-center gap-2.5 pt-2">
              <svg class="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="text-xs text-[var(--muted-foreground)] font-medium uppercase tracking-wide">Cost</p>
                <p class="text-2xl font-extrabold text-blue-300 tabular-nums">₱{{ currentService.cost?.toFixed(2) || '0.00' }}</p>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="border-t border-[var(--border)]"></div>

          <!-- JOBS DONE SECTION -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <svg class="w-4 h-4 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h4 class="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
                Jobs Done
              </h4>
            </div>
            
            <div v-if="currentService.jobs_done && currentService.jobs_done.length > 0" class="space-y-2">
              <div 
                v-for="job in currentService.jobs_done" 
                :key="job"
                class="flex items-start justify-between gap-3 p-3 bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)]/40 transition-colors"
                style="border-radius: 6px;"
              >
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-[var(--foreground)] mb-1">
                    {{ getJobLabel(job) }}
                  </p>
                  <div v-if="getJobPartDetails(job)" class="flex flex-wrap gap-1.5">
                    <span 
                      v-if="getJobPartDetails(job).condition"
                      :class="[
                        'text-[10px] px-2 py-0.5 rounded font-medium',
                        getJobPartDetails(job).condition === 'brand_new' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      ]"
                    >
                      {{ getJobPartDetails(job).condition === 'brand_new' ? 'Brand New' : 'Surplus' }}
                    </span>
                    <span 
                      v-if="getJobPartDetails(job).isOwnerPart"
                      class="text-[10px] px-2 py-0.5 rounded font-medium bg-purple-500/20 text-purple-400"
                    >
                      Owner's Part
                    </span>
                  </div>
                </div>
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div v-else class="p-4 text-center text-sm text-[var(--muted-foreground)] bg-[var(--muted)]/30 border border-[var(--border)]" style="border-radius: 6px;">
              No jobs recorded
            </div>
          </div>

          <!-- Divider -->
          <div class="border-t border-[var(--border)]"></div>

          <!-- Notes Section -->
          <div v-if="currentService.description">
            <div class="flex items-center gap-2 mb-2.5">
              <svg class="w-4 h-4 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h4 class="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
                Service Notes
              </h4>
            </div>
            <div class="p-3.5 bg-[var(--muted)]/30 border border-[var(--border)]" style="border-radius: 8px;">
              <p class="text-[15px] text-[var(--foreground)] leading-relaxed whitespace-pre-wrap">{{ currentService.description }}</p>
            </div>
          </div>

          <!-- Divider -->
          <div class="border-t border-[var(--border)]"></div>

          <!-- Secondary Info: Customer & Vehicle -->
          <div class="space-y-4">
            <!-- Customer Section -->
            <div>
              <h4 class="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-2.5">
                Customer
              </h4>
              <div class="space-y-2">
                <div class="flex items-center gap-2.5">
                  <svg class="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p class="text-sm font-medium text-[var(--foreground)]">{{ currentService.customer_name || 'Walk-in Customer' }}</p>
                </div>
                <div v-if="currentService.phone" class="flex items-center gap-2.5">
                  <svg class="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p class="text-sm text-[var(--foreground)]">{{ currentService.phone }}</p>
                </div>
              </div>
            </div>

            <!-- Vehicle Section -->
            <div v-if="currentService.car_model || currentService.car_year">
              <h4 class="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-2.5">
                Vehicle
              </h4>
              <div class="flex items-center gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 13l1-3h16l1 3M5 16h14a2 2 0 002-2v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2zm2 4a1 1 0 110-2 1 1 0 010 2zm10 0a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
                <p class="text-sm text-[var(--foreground)]">
                  {{ currentService.car_model || 'N/A' }}
                  <span v-if="currentService.car_year" class="text-[var(--muted-foreground)]"> ({{ currentService.car_year }})</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Audit Trail Metadata -->
          <div class="pt-3 border-t border-[var(--border)] space-y-2">
            <div v-if="currentService.created_at" class="flex items-center justify-center gap-2 text-xs text-[var(--muted-foreground)]">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Created {{ formatDate(currentService.created_at) }}</span>
              <span v-if="currentService.updated_by" class="text-[var(--muted-foreground)]/70">by {{ currentService.updated_by }}</span>
            </div>
            
            <div v-if="currentService.updated_at && currentService.updated_at !== currentService.created_at" 
                 class="flex items-center justify-center gap-2 text-xs text-[var(--muted-foreground)]">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Last edited {{ formatDate(currentService.updated_at) }}</span>
              <span v-if="currentService.updated_by" class="text-[var(--muted-foreground)]/70">by {{ currentService.updated_by }}</span>
            </div>
          </div>

          <!-- Bottom padding -->
          <div class="h-4"></div>
        </div>

        <!-- DESKTOP LAYOUT -->
        <div class="hidden md:block p-6 max-w-6xl mx-auto">
          <!-- Top Section with Plate Number and Warranty -->
          <div class="flex items-start justify-between mb-6">
            <div v-if="currentService.plate_number" class="flex items-center gap-3">
              <svg class="w-6 h-6 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <div>
                <p class="text-xs text-[var(--muted-foreground)] font-medium uppercase tracking-wide mb-1">Plate Number</p>
                <p class="text-2xl font-bold text-[var(--foreground)]">{{ currentService.plate_number }}</p>
              </div>
            </div>
            
            <!-- Warranty Badge -->
            <span 
              v-if="warrantyStatus"
              :class="[
                'px-4 py-2 text-sm font-bold uppercase tracking-wide',
                warrantyStatus === 'active' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              ]"
              style="border-radius: 8px;"
            >
              {{ warrantyStatus === 'active' ? 'In Warranty' : 'Out of Warranty' }}
            </span>
          </div>

          <!-- Info Cards Grid -->
          <div class="grid grid-cols-3 gap-4 mb-6">
            <!-- Invoice Card -->
            <div v-if="currentService.invoice" class="p-4 bg-[var(--card)] border border-[var(--border)]" style="border-radius: 8px;">
              <div class="flex items-center gap-3 mb-2">
                <svg class="w-5 h-5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-xs text-[var(--muted-foreground)] font-semibold uppercase tracking-wide">Invoice</p>
              </div>
              <p class="text-xl font-bold text-[var(--foreground)]">#{{ currentService.invoice }}</p>
            </div>

            <!-- Date Card -->
            <div class="p-4 bg-[var(--card)] border border-[var(--border)]" style="border-radius: 8px;">
              <div class="flex items-center gap-3 mb-2">
                <svg class="w-5 h-5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-xs text-[var(--muted-foreground)] font-semibold uppercase tracking-wide">Service Date</p>
              </div>
              <p class="text-xl font-bold text-[var(--foreground)]">{{ formatDate(currentService.service_date) }}</p>
            </div>

            <!-- Cost Card -->
            <div class="p-4 bg-[var(--card)] border border-[var(--border)]" style="border-radius: 8px;">
              <div class="flex items-center gap-3 mb-2">
                <svg class="w-5 h-5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-xs text-[var(--muted-foreground)] font-semibold uppercase tracking-wide">Total Cost</p>
              </div>
              <p class="text-2xl font-bold text-blue-300 tabular-nums">₱{{ currentService.cost?.toFixed(2) || '0.00' }}</p>
            </div>
          </div>

          <!-- Two Column Layout -->
          <div class="grid grid-cols-2 gap-6">
            <!-- Left Column -->
            <div class="space-y-6">
              <!-- Jobs Done Section -->
              <div>
                <div class="flex items-center gap-2 mb-4">
                  <svg class="w-5 h-5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <h3 class="text-sm font-bold text-[var(--foreground)] uppercase tracking-wide">Jobs Done</h3>
                </div>
                
                <div v-if="currentService.jobs_done && currentService.jobs_done.length > 0" class="space-y-2">
                  <div 
                    v-for="job in currentService.jobs_done" 
                    :key="job"
                    class="flex items-start justify-between gap-3 p-4 bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)]/40 transition-colors"
                    style="border-radius: 8px;"
                  >
                    <div class="flex-1 min-w-0">
                      <p class="text-base font-semibold text-[var(--foreground)] mb-2">
                        {{ getJobLabel(job) }}
                      </p>
                      <div v-if="getJobPartDetails(job)" class="flex flex-wrap gap-2">
                        <span 
                          v-if="getJobPartDetails(job).condition"
                          :class="[
                            'text-xs px-2.5 py-1 rounded font-medium',
                            getJobPartDetails(job).condition === 'brand_new' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          ]"
                        >
                          {{ getJobPartDetails(job).condition === 'brand_new' ? 'Brand New' : 'Surplus' }}
                        </span>
                        <span 
                          v-if="getJobPartDetails(job).isOwnerPart"
                          class="text-xs px-2.5 py-1 rounded font-medium bg-purple-500/20 text-purple-400"
                        >
                          Owner's Part
                        </span>
                      </div>
                    </div>
                    <svg class="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div v-else class="p-6 text-center text-sm text-[var(--muted-foreground)] bg-[var(--muted)]/30 border border-[var(--border)]" style="border-radius: 8px;">
                  No jobs recorded
                </div>
              </div>

              <!-- Notes Section -->
              <div v-if="currentService.description">
                <div class="flex items-center gap-2 mb-4">
                  <svg class="w-5 h-5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 class="text-sm font-bold text-[var(--foreground)] uppercase tracking-wide">Service Notes</h3>
                </div>
                <div class="p-4 bg-[var(--muted)]/30 border border-[var(--border)]" style="border-radius: 8px;">
                  <p class="text-base text-[var(--foreground)] leading-relaxed whitespace-pre-wrap">{{ currentService.description }}</p>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-6">
              <!-- Customer Info -->
              <div class="p-5 bg-[var(--card)] border border-[var(--border)]" style="border-radius: 8px;">
                <h3 class="text-sm font-bold text-[var(--foreground)] uppercase tracking-wide mb-4">Customer Information</h3>
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-[var(--muted-foreground)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <p class="text-xs text-[var(--muted-foreground)] font-medium">Name</p>
                      <p class="text-base font-semibold text-[var(--foreground)]">{{ currentService.customer_name || 'Walk-in Customer' }}</p>
                    </div>
                  </div>
                  <div v-if="currentService.phone" class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-[var(--muted-foreground)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p class="text-xs text-[var(--muted-foreground)] font-medium">Phone</p>
                      <p class="text-base font-semibold text-[var(--foreground)]">{{ currentService.phone }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Vehicle Info -->
              <div v-if="currentService.car_model || currentService.car_year" class="p-5 bg-[var(--card)] border border-[var(--border)]" style="border-radius: 8px;">
                <h3 class="text-sm font-bold text-[var(--foreground)] uppercase tracking-wide mb-4">Vehicle Information</h3>
                <div class="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[var(--muted-foreground)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 13l1-3h16l1 3M5 16h14a2 2 0 002-2v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2zm2 4a1 1 0 110-2 1 1 0 010 2zm10 0a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                  <div>
                    <p class="text-xs text-[var(--muted-foreground)] font-medium">Model & Year</p>
                    <p class="text-base font-semibold text-[var(--foreground)]">
                      {{ currentService.car_model || 'N/A' }}
                      <span v-if="currentService.car_year" class="text-[var(--muted-foreground)]"> ({{ currentService.car_year }})</span>
                    </p>
                  </div>
                </div>
              </div>

              <!-- Audit Trail Metadata -->
              <div class="p-4 bg-[var(--muted)]/20 border border-[var(--border)] space-y-2" style="border-radius: 8px;">
                <div v-if="currentService.created_at" class="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                  <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <div class="flex-1">
                    <span>Created {{ formatDate(currentService.created_at) }}</span>
                    <span v-if="currentService.updated_by" class="text-[var(--muted-foreground)]/70"> by {{ currentService.updated_by }}</span>
                  </div>
                </div>
                
                <div v-if="currentService.updated_at && currentService.updated_at !== currentService.created_at" 
                     class="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                  <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <div class="flex-1">
                    <span>Last edited {{ formatDate(currentService.updated_at) }}</span>
                    <span v-if="currentService.updated_by" class="text-[var(--muted-foreground)]/70"> by {{ currentService.updated_by }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Full History Slide-over Panel -->
      <ServiceHistoryList
        v-if="showFullHistory"
        :jobs="jobHistory"
        :plate-number="currentService.plate_number"
        :current-job-id="currentService.id"
        :is-sidebar-collapsed="isSidebarCollapsed"
        @close="showFullHistory = false"
        @select-job="handleJobSelect"
      />

      <!-- Edit Form -->
      <ServiceForm
        v-if="showEditForm"
        :service="currentService"
        :show="showEditForm"
        :show-backdrop="true"
        :is-sidebar-collapsed="isSidebarCollapsed"
        @close="showEditForm = false"
        @save="handleSave"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import RecentServiceHistory from './RecentServiceHistory.vue'
import ServiceHistoryList from './ServiceHistoryList.vue'
import ServiceForm from './ServiceForm.vue'

const props = defineProps({
  service: {
    type: Object,
    required: true
  },
  allServices: {
    type: Array,
    default: () => []
  },
  show: {
    type: Boolean,
    default: true
  },
  showBackdrop: {
    type: Boolean,
    default: true
  },
  isSidebarCollapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'edit', 'viewJob'])

const showFullHistory = ref(false)
const showEditForm = ref(false)
const currentService = computed(() => props.service)

// Job label mapping
const jobLabels = {
  // Replace jobs
  replace_evaporator_front: 'Replace Evaporator Front',
  replace_evaporator_rear: 'Replace Evaporator Rear',
  replace_condenser: 'Replace Condenser',
  replace_compressor: 'Replace Compressor',
  replace_blower_motor: 'Replace Blower Motor',
  replace_expansion_valve: 'Replace Expansion Valve',
  replace_pulley_assembly: 'Replace Pulley Assembly',
  replace_fan_motor: 'Replace Fan Motor',
  replace_suction_hose_assembly: 'Replace Suction Hose Assembly',
  replace_fan_belt: 'Replace Fan Belt',
  replace_filter_drier: 'Replace Filter Drier',
  replace_discharge_hose_suction: 'Replace Discharge Hose Suction',
  replace_ecv: 'Replace ECV',
  replace_oring: 'Replace O-ring',
  replace_radiator: 'Replace Radiator',
  replace_cabin_filter: 'Replace Cabin Filter',
  replace_magnetic: 'Replace Magnetic',
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

// Calculate job history for the same plate number (sorted by date descending)
const jobHistory = computed(() => {
  if (!currentService.value.plate_number || !props.allServices.length) {
    return []
  }
  
  return props.allServices
    .filter(s => s.plate_number === currentService.value.plate_number)
    .sort((a, b) => new Date(b.service_date) - new Date(a.service_date))
})

// Calculate warranty status based on service date
const warrantyStatus = computed(() => {
  if (!currentService.value.service_date) return null
  
  const serviceDate = new Date(currentService.value.service_date)
  const today = new Date()
  const daysDiff = Math.floor((today - serviceDate) / (1000 * 60 * 60 * 24))
  
  const warrantyPeriodDays = 30
  
  return daysDiff <= warrantyPeriodDays ? 'active' : 'expired'
})

function getJobLabel(jobKey) {
  return jobLabels[jobKey] || jobKey
}

function getJobPartDetails(jobKey) {
  const condition = currentService.value.part_condition?.[jobKey]
  const isOwnerPart = currentService.value.owner_parts?.[jobKey]
  
  if (!condition && !isOwnerPart) return null
  
  return {
    condition,
    isOwnerPart
  }
}

function close() {
  emit('close')
}

function handleEdit() {
  // Open the edit form inside this modal instead of closing
  showEditForm.value = true
}

function handleSave(serviceData) {
  // Close the edit form
  showEditForm.value = false
  
  // Emit to parent to update the main list
  emit('edit', serviceData)
}

function viewJob(job) {
  emit('viewJob', job)
}

function handleJobSelect(job) {
  // Keep the history panel open when selecting a job
  // Just update the main detail view
  viewJob(job)
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
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>