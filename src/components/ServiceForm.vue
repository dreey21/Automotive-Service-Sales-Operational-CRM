<template>
  <div>
    <!-- Backdrop with Transition -->
    <transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-show="show && showBackdrop"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        @click="handleBackdropClick"
      />
    </transition>

    <!-- Form Container with Slide Transition -->
    <transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
      @after-leave="handleAfterLeave"
    >
      <div 
        v-show="show"
        class="fixed inset-0 z-50 flex flex-col bg-[var(--background)] overflow-hidden md:inset-y-0 md:right-0 md:left-auto md:w-[480px] lg:w-[560px]"
      >
        <!-- Step Indicator -->
        <StepIndicator :current-step="currentStep" />

        <!-- Scrollable Content with bottom padding for mobile nav -->
        <div 
          ref="scrollContainer"
          class="flex-1 overflow-y-auto pb-[140px] md:pb-0"
          @touchmove="handleTouchMove"
        >
          <!-- Desktop: Single Column Layout -->
          <form @submit.prevent="handleNext" class="p-5 space-y-5">
            <!-- STEP 1: Client & Vehicle -->
            <div v-if="currentStep === 1" class="space-y-5">
              <h2 class="text-xl font-bold text-[var(--foreground)] mb-4">Client & Vehicle Details</h2>
              
              <!-- Plate Number (REQUIRED - Unique ID) -->
              <div>
                <label for="plate_number" class="block text-xs font-semibold text-[var(--foreground)] mb-2 uppercase tracking-wide">
                  Plate Number <span class="text-red-500">*</span>
                </label>
                <input
                  id="plate_number"
                  v-model="formData.plate_number"
                  type="text"
                  required
                  @input="handlePlateNumberInput"
                  class="w-full h-12 px-4 bg-[var(--muted)] border-2 border-[var(--border)] text-base text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent)] transition-all rounded-lg font-mono tracking-wider uppercase"
                  placeholder="ABC 1234"
                />
                <p v-if="errors.plate_number" class="text-xs text-red-500 mt-1">{{ errors.plate_number }}</p>
              </div>

              <div class="border-t border-[var(--border)] my-4" />

              <!-- Customer Name -->
              <div>
                <label for="customer_name" class="block text-xs font-semibold text-[var(--foreground)] mb-2 uppercase tracking-wide">
                  Customer Name
                </label>
                <input
                  id="customer_name"
                  v-model="formData.customer_name"
                  type="text"
                  class="w-full h-12 px-4 bg-[var(--muted)] border-2 border-[var(--border)] text-base text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent)] transition-all rounded-lg"
                  placeholder="Enter customer name"
                />
              </div>

              <!-- Phone -->
              <div>
                <label for="phone" class="block text-xs font-semibold text-[var(--foreground)] mb-2 uppercase tracking-wide">
                  Phone Number
                </label>
                <input
                  id="phone"
                  v-model="formData.phone"
                  type="tel"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  class="w-full h-12 px-4 bg-[var(--muted)] border-2 border-[var(--border)] text-base text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent)] transition-all rounded-lg"
                  placeholder="09xxxxxxxxx"
                />
              </div>

              <div class="border-t border-[var(--border)] my-4" />

              <!-- Car Model & Year -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label for="car_model" class="block text-xs font-semibold text-[var(--foreground)] mb-2 uppercase tracking-wide">
                    Car Model
                  </label>
                  <input
                    id="car_model"
                    v-model="formData.car_model"
                    type="text"
                    class="w-full h-12 px-4 bg-[var(--muted)] border-2 border-[var(--border)] text-base text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent)] transition-all rounded-lg"
                    placeholder="Toyota Vios"
                  />
                </div>
                <div>
                  <label for="car_year" class="block text-xs font-semibold text-[var(--foreground)] mb-2 uppercase tracking-wide">
                    Year
                  </label>
                  <input
                    id="car_year"
                    v-model="formData.car_year"
                    type="number"
                    inputmode="numeric"
                    pattern="[0-9]{4}"
                    min="1900"
                    :max="new Date().getFullYear() + 1"
                    class="w-full h-12 px-4 bg-[var(--muted)] border-2 border-[var(--border)] text-base text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent)] transition-all rounded-lg"
                    placeholder="2024"
                  />
                </div>
              </div>
            </div>

            <!-- STEP 2: Services -->
            <div v-if="currentStep === 2" class="space-y-5">
              <h2 class="text-xl font-bold text-[var(--foreground)] mb-4">Services</h2>
              
              <!-- Expand/Collapse Button -->
              <button
                type="button"
                @click="toggleServicesExpansion"
                class="w-full flex items-center justify-between p-4 bg-[var(--muted)] border-2 border-[var(--border)] hover:border-[var(--accent)] rounded-lg transition-all active:scale-98"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-[var(--accent)]/15 flex items-center justify-center">
                    <svg class="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div class="text-left">
                    <span class="block text-sm font-bold text-[var(--foreground)]">
                      {{ formData.jobs_done.length > 0 ? 'Edit Services' : 'Add Services' }}
                    </span>
                    <span class="block text-xs text-[var(--muted-foreground)]">
                      {{ formData.jobs_done.length > 0 ? `${formData.jobs_done.length} selected` : isMobile ? 'Tap to select' : 'Click to expand' }}
                    </span>
                  </div>
                </div>
                <svg 
                  :class="['w-5 h-5 text-[var(--muted-foreground)] transition-transform', isServicesExpanded && !isMobile && 'rotate-180']" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" :d="isMobile ? 'M9 5l7 7-7 7' : 'M19 9l-7 7-7-7'" />
                </svg>
              </button>

              <!-- Selected Services with Part Details -->
              <div v-if="formData.jobs_done.length > 0" class="space-y-3">
                <div class="flex items-center justify-between">
                  <label class="block text-xs font-semibold text-[var(--foreground)] uppercase tracking-wide">
                    Selected Services
                  </label>
                  <button
                    type="button"
                    @click="clearAllServices"
                    class="text-xs text-red-500 hover:text-red-400 font-medium underline"
                  >
                    Clear All
                  </button>
                </div>
                
                <!-- Service Cards with Part Options -->
                <div class="space-y-3">
                  <div
                    v-for="job in formData.jobs_done"
                    :key="job"
                    class="bg-[var(--muted)] border border-[var(--border)] rounded-lg p-3 space-y-3"
                  >
                    <!-- Service Name -->
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-semibold text-[var(--foreground)]">{{ getJobLabel(job) }}</span>
                      <button
                        type="button"
                        @click="removeJob(job)"
                        class="p-1 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <!-- Part Condition Options (Only for Replace jobs) -->
                    <div v-if="isReplaceJob(job)" class="space-y-2">
                      <div class="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Part Details
                      </div>
                      
                      <!-- Part Type Buttons (Mutually Exclusive) -->
                      <div class="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          @click="setPartType(job, 'brand_new')"
                          :class="[
                            'px-3 py-2 text-xs font-bold rounded-lg border-2 transition-all',
                            getPartType(job) === 'brand_new'
                              ? 'bg-green-500/10 border-green-500 text-white shadow-[inset_0_0_12px_rgba(34,197,94,0.4)]'
                              : 'bg-[var(--background)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-green-500/50'
                          ]"
                        >
                          Brand New
                        </button>
                        <button
                          type="button"
                          @click="setPartType(job, 'surplus')"
                          :class="[
                            'px-3 py-2 text-xs font-bold rounded-lg border-2 transition-all',
                            getPartType(job) === 'surplus'
                              ? 'bg-yellow-500/10 border-yellow-500 text-white shadow-[inset_0_0_12px_rgba(234,179,8,0.4)]'
                              : 'bg-[var(--background)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-yellow-500/50'
                          ]"
                        >
                          Surplus
                        </button>
                        <button
                          type="button"
                          @click="setPartType(job, 'owner')"
                          :class="[
                            'px-3 py-2 text-xs font-bold rounded-lg border-2 transition-all',
                            getPartType(job) === 'owner'
                              ? 'bg-purple-500/10 border-purple-500 text-white shadow-[inset_0_0_12px_rgba(168,85,247,0.4)]'
                              : 'bg-[var(--background)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-purple-500/50'
                          ]"
                        >
                          Owner's
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p v-if="errors.jobs_done" class="text-sm text-red-500 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {{ errors.jobs_done }}
              </p>
            </div>

            <!-- STEP 3: Billing & Summary -->
            <div v-if="currentStep === 3" class="space-y-5">
              <h2 class="text-xl font-bold text-[var(--foreground)] mb-4">Billing & Summary</h2>
              
              <!-- Invoice & Date -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label for="invoice" class="block text-xs font-semibold text-[var(--foreground)] mb-2 uppercase tracking-wide">
                    Invoice No.
                  </label>
                  <input
                    id="invoice"
                    v-model="formData.invoice"
                    type="text"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    class="w-full h-12 px-4 bg-[var(--muted)] border-2 border-[var(--border)] text-base text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent)] transition-all rounded-lg"
                    placeholder="1234"
                  />
                </div>
                <div>
                  <label for="service_date" class="block text-xs font-semibold text-[var(--foreground)] mb-2 uppercase tracking-wide">
                    Date <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="service_date"
                    v-model="formData.service_date"
                    type="date"
                    required
                    class="w-full h-12 px-4 bg-[var(--muted)] border-2 border-[var(--border)] text-base text-white focus:outline-none focus:border-[var(--accent)] transition-all rounded-lg"
                  />
                  <p v-if="errors.service_date" class="text-xs text-red-500 mt-1">{{ errors.service_date }}</p>
                </div>
              </div>

              <!-- Cost -->
              <div>
                <label for="cost" class="block text-xs font-semibold text-[var(--foreground)] mb-2 uppercase tracking-wide">
                  Cost (₱) <span class="text-red-500">*</span>
                </label>
                <input
                  id="cost"
                  v-model.number="formData.cost"
                  type="number"
                  inputmode="decimal"
                  step="0.01"
                  min="0"
                  required
                  class="w-full h-12 px-4 bg-[var(--muted)] border-2 border-[var(--border)] text-base text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent)] transition-all tabular-nums rounded-lg"
                  placeholder="0.00"
                />
                <p v-if="errors.cost" class="text-xs text-red-500 mt-1">{{ errors.cost }}</p>
              </div>

              <!-- Notes -->
              <div>
                <label for="description" class="block text-xs font-semibold text-[var(--foreground)] mb-2 uppercase tracking-wide">
                  Notes
                </label>
                <textarea
                  id="description"
                  v-model="formData.description"
                  rows="4"
                  class="w-full px-4 py-3 bg-[var(--muted)] border-2 border-[var(--border)] text-base text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent)] transition-all resize-none rounded-lg"
                  placeholder="Additional details..."
                />
              </div>

              <!-- Summary Card -->
              <div class="bg-[var(--muted)] border border-[var(--border)] rounded-lg p-4 space-y-3">
                <h3 class="text-sm font-bold text-[var(--foreground)] uppercase tracking-wide">Summary</h3>
                <div class="space-y-3 text-sm">
                  <div class="flex justify-between">
                    <span class="text-[var(--muted-foreground)]">Plate Number</span>
                    <span class="text-[var(--foreground)] font-bold font-mono tracking-wider">{{ formData.plate_number || '—' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-[var(--muted-foreground)]">Mobile</span>
                    <span class="text-[var(--foreground)] font-medium">{{ formData.phone || '—' }}</span>
                  </div>
                  
                  <!-- Services List -->
                  <div v-if="formData.jobs_done.length > 0" class="border-t border-[var(--border)] pt-3">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-[var(--muted-foreground)] font-semibold">Services</span>
                      <span class="text-xs text-[var(--accent)] font-bold">{{ formData.jobs_done.length }} selected</span>
                    </div>
                    <div class="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                      <div
                        v-for="job in formData.jobs_done"
                        :key="job"
                        class="flex items-start gap-2 text-xs"
                      >
                        <svg class="w-3.5 h-3.5 text-[var(--accent)] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <div class="flex-1">
                          <span class="text-[var(--foreground)] font-medium">{{ getJobLabel(job) }}</span>
                          <span v-if="isReplaceJob(job) && getPartType(job)" class="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide"
                            :class="{
                              'bg-green-500/20 text-green-400': getPartType(job) === 'brand_new',
                              'bg-yellow-500/20 text-yellow-400': getPartType(job) === 'surplus',
                              'bg-purple-500/20 text-purple-400': getPartType(job) === 'owner'
                            }"
                          >
                            {{ getPartType(job) === 'brand_new' ? 'New' : getPartType(job) === 'surplus' ? 'Surplus' : 'Owner' }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="border-t border-[var(--border)] pt-3">
                    <span class="text-[var(--muted-foreground)] text-xs italic">No services selected</span>
                  </div>
                  
                  <div class="border-t border-[var(--border)] pt-3 flex justify-between items-center">
                    <span class="text-[var(--foreground)] font-semibold">Total Cost</span>
                    <span class="text-xl font-extrabold text-blue-300 tabular-nums">₱{{ formData.cost.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Sticky Footer - Above mobile bottom nav -->
        <div class="fixed bottom-0 left-0 right-0 md:relative border-t border-[var(--border)] p-4 bg-[var(--background)] mb-[56px] md:mb-0 z-10">
          <div class="flex gap-3">
            <button
              v-if="currentStep > 1"
              @click="handleBack"
              type="button"
              class="flex-1 h-12 flex items-center justify-center gap-2 bg-[var(--muted)] border-2 border-[var(--border)] text-[var(--foreground)] font-bold text-base rounded-lg transition-all active:scale-95"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span class="hidden sm:inline">Back</span>
            </button>
            <button
              v-else
              @click="handleBackdropClick"
              type="button"
              class="flex-1 h-12 flex items-center justify-center gap-2 bg-[var(--muted)] border-2 border-[var(--border)] text-[var(--foreground)] font-bold text-base rounded-lg transition-all active:scale-95"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span class="hidden sm:inline">Cancel</span>
            </button>
            <button
              @click="handleNext"
              type="button"
              :disabled="!canProceed"
              class="flex-1 h-12 flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--accent-foreground)] font-bold text-base rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{{ currentStep === 3 ? (service ? 'Update Record' : 'Save Record') : 'Next Step' }}</span>
              <svg v-if="currentStep < 3" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Services Overlay Panel (Desktop Only) with Slide Transition -->
    <transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <div
        v-if="isServicesExpanded && !isMobile"
        class="fixed inset-y-0 right-[480px] lg:right-[560px] w-[420px] lg:w-[480px] bg-[var(--background)] border-r border-[var(--border)] shadow-2xl z-[60] overflow-hidden"
      >
        <div class="h-full overflow-y-auto p-5">
          <!-- Header with Close Button -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-[var(--foreground)]">Select Services</h3>
            <button
              @click="isServicesExpanded = false"
              class="p-2 hover:bg-[var(--muted)] rounded-lg transition-colors"
            >
              <svg class="w-5 h-5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Search Input -->
          <div class="relative mb-4">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="Search or use arrow keys..."
              @keydown="handleKeyboardNav"
              class="w-full h-10 pl-10 pr-3 bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent)] transition-colors rounded-lg"
            />
          </div>

          <!-- Compact Services List with Keyboard Navigation -->
          <div class="space-y-4">
            <!-- Replace Section -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-xs font-bold text-[var(--foreground)] uppercase tracking-wide">Replace</h4>
                <span class="text-xs text-[var(--accent)] font-bold">{{ getSelectedCount(filteredReplaceJobs) }}</span>
              </div>
              <div class="space-y-1">
                <button
                  v-for="(job, index) in filteredReplaceJobs"
                  :key="job.value"
                  :ref="el => { if (el) jobRefs[getJobIndex('replace', index)] = el }"
                  @click="toggleJob(job.value)"
                  :class="[
                    'w-full flex items-center justify-between px-3 py-2 rounded-md transition-all text-left',
                    selectedJobs.includes(job.value)
                      ? 'bg-[var(--accent)]/15 border border-[var(--accent)]'
                      : 'bg-[var(--muted)]/50 border border-transparent hover:border-[var(--border)]',
                    focusedJobIndex === getJobIndex('replace', index) && 'ring-2 ring-[var(--accent)]/50'
                  ]"
                >
                  <span :class="[
                    'text-sm',
                    selectedJobs.includes(job.value) ? 'text-[var(--accent)] font-medium' : 'text-[var(--foreground)]'
                  ]">
                    {{ job.label }}
                  </span>
                  <div :class="[
                    'w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0',
                    selectedJobs.includes(job.value)
                      ? 'bg-[var(--accent)] border-[var(--accent)]'
                      : 'border-[var(--border)]'
                  ]">
                    <svg v-if="selectedJobs.includes(job.value)" class="w-3.5 h-3.5 text-[var(--accent-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            <!-- Pulldown Section -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-xs font-bold text-[var(--foreground)] uppercase tracking-wide">Pulldown</h4>
                <span class="text-xs text-[var(--accent)] font-bold">{{ getSelectedCount(filteredPulldownJobs) }}</span>
              </div>
              <div class="space-y-1">
                <button
                  v-for="(job, index) in filteredPulldownJobs"
                  :key="job.value"
                  :ref="el => { if (el) jobRefs[getJobIndex('pulldown', index)] = el }"
                  @click="toggleJob(job.value)"
                  :class="[
                    'w-full flex items-center justify-between px-3 py-2 rounded-md transition-all text-left',
                    selectedJobs.includes(job.value)
                      ? 'bg-[var(--accent)]/15 border border-[var(--accent)]'
                      : 'bg-[var(--muted)]/50 border border-transparent hover:border-[var(--border)]',
                    focusedJobIndex === getJobIndex('pulldown', index) && 'ring-2 ring-[var(--accent)]/50'
                  ]"
                >
                  <span :class="[
                    'text-sm',
                    selectedJobs.includes(job.value) ? 'text-[var(--accent)] font-medium' : 'text-[var(--foreground)]'
                  ]">
                    {{ job.label }}
                  </span>
                  <div :class="[
                    'w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0',
                    selectedJobs.includes(job.value)
                      ? 'bg-[var(--accent)] border-[var(--accent)]'
                      : 'border-[var(--border)]'
                  ]">
                    <svg v-if="selectedJobs.includes(job.value)" class="w-3.5 h-3.5 text-[var(--accent-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            <!-- Other Services Section -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-xs font-bold text-[var(--foreground)] uppercase tracking-wide">Other Services</h4>
                <span class="text-xs text-[var(--accent)] font-bold">{{ getSelectedCount(filteredOtherJobs) }}</span>
              </div>
              <div class="space-y-1">
                <button
                  v-for="(job, index) in filteredOtherJobs"
                  :key="job.value"
                  :ref="el => { if (el) jobRefs[getJobIndex('other', index)] = el }"
                  @click="toggleJob(job.value)"
                  :class="[
                    'w-full flex items-center justify-between px-3 py-2 rounded-md transition-all text-left',
                    selectedJobs.includes(job.value)
                      ? 'bg-[var(--accent)]/15 border border-[var(--accent)]'
                      : 'bg-[var(--muted)]/50 border border-transparent hover:border-[var(--border)]',
                    focusedJobIndex === getJobIndex('other', index) && 'ring-2 ring-[var(--accent)]/50'
                  ]"
                >
                  <span :class="[
                    'text-sm',
                    selectedJobs.includes(job.value) ? 'text-[var(--accent)] font-medium' : 'text-[var(--foreground)]'
                  ]">
                    {{ job.label }}
                  </span>
                  <div :class="[
                    'w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0',
                    selectedJobs.includes(job.value)
                      ? 'bg-[var(--accent)] border-[var(--accent)]'
                      : 'border-[var(--border)]'
                  ]">
                    <svg v-if="selectedJobs.includes(job.value)" class="w-3.5 h-3.5 text-[var(--accent-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Keyboard Shortcuts Hint -->
          <div class="mt-6 p-3 bg-[var(--muted)]/50 rounded-lg border border-[var(--border)]">
            <p class="text-xs text-[var(--muted-foreground)] mb-2 font-semibold">Keyboard Shortcuts</p>
            <div class="grid grid-cols-2 gap-2 text-xs text-[var(--muted-foreground)]">
              <div class="flex items-center gap-1.5">
                <kbd class="px-1.5 py-0.5 bg-[var(--background)] border border-[var(--border)] rounded text-[10px] font-mono">↑↓</kbd>
                <span>Navigate</span>
              </div>
              <div class="flex items-center gap-1.5">
                <kbd class="px-1.5 py-0.5 bg-[var(--background)] border border-[var(--border)] rounded text-[10px] font-mono">Space</kbd>
                <span>Toggle</span>
              </div>
              <div class="flex items-center gap-1.5">
                <kbd class="px-1.5 py-0.5 bg-[var(--background)] border border-[var(--border)] rounded text-[10px] font-mono">Enter</kbd>
                <span>Next Step</span>
              </div>
              <div class="flex items-center gap-1.5">
                <kbd class="px-1.5 py-0.5 bg-[var(--background)] border border-[var(--border)] rounded text-[10px] font-mono">/</kbd>
                <span>Search</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Services Bottom Sheet (Mobile Only) -->
    <ServicesBottomSheet
      v-if="isMobile"
      :is-open="isServicesSheetOpen"
      v-model="formData.jobs_done"
      @close="closeServicesSheet"
    />

    <!-- Discard Changes Dialog -->
    <AlertDialog v-model:open="showDiscardDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard changes?</AlertDialogTitle>
          <AlertDialogDescription>
            All unsaved changes will be lost. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Continue editing</AlertDialogCancel>
          <AlertDialogAction @click="confirmDiscard">
            Discard changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <!-- Clear Services Dialog -->
    <AlertDialog v-model:open="showClearServicesDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear all services?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove all selected services and their part details. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="confirmClearServices">
            Clear all
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <!-- Toast Notification (Replaces inline auto-fill toast) -->
    <ToastNotification
      :show="showAutoFillToast"
      message="Customer info auto-filled from previous records"
      variant="info"
      :duration="3000"
      @close="showAutoFillToast = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from 'vue'
import StepIndicator from './StepIndicator.vue'
import ServicesBottomSheet from './ServicesBottomSheet.vue'
import ToastNotification from './ToastNotification.vue'
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

const props = defineProps({
  service: { type: Object, default: null },
  show: Boolean,
  showBackdrop: { type: Boolean, default: true },
  existingRecords: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'closed', 'save'])

const currentStep = ref(1)
const isServicesSheetOpen = ref(false)
const isServicesExpanded = ref(false)
const errors = ref({})
const searchQuery = ref('')
const searchInput = ref(null)
const scrollContainer = ref(null)
const focusedJobIndex = ref(-1)
const jobRefs = ref([])
const isMobile = ref(window.innerWidth < 768)

// Touch and scroll tracking
const touchMoveTimeout = ref(null)
const hasTouchMoved = ref(false)

// AlertDialog states
const showDiscardDialog = ref(false)
const showClearServicesDialog = ref(false)
const hasUnsavedChanges = ref(false)

// Toast notification state
const showAutoFillToast = ref(false)
const initialFormSnapshot = ref(null)

const formData = ref({
  customer_name: '',
  phone: '',
  car_model: '',
  car_year: '',
  invoice: '',
  plate_number: '',
  jobs_done: [],
  owner_parts: {},
  part_condition: {},
  service_date: '',
  cost: 0,
  description: ''
})

const selectedJobs = ref([])

const jobLabels = {
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
  pulldown_evaporator: 'Pulldown Evaporator',
  pulldown_condenser: 'Pulldown Condenser',
  pulldown_compressor: 'Pulldown Compressor',
  flushing_system: 'Flushing System',
  install_cabin_filter: 'Install Cabin Filter',
  cleaning: 'Cleaning',
  freon: 'Freon'
}

const replaceJobs = [
  { value: 'replace_evaporator_front', label: 'Evaporator Front' },
  { value: 'replace_evaporator_rear', label: 'Evaporator Rear' },
  { value: 'replace_condenser', label: 'Condenser' },
  { value: 'replace_compressor', label: 'Compressor' },
  { value: 'replace_blower_motor', label: 'Blower Motor' },
  { value: 'replace_expansion_valve', label: 'Expansion Valve' },
  { value: 'replace_pulley_assembly', label: 'Pulley Assembly' },
  { value: 'replace_fan_motor', label: 'Fan Motor' },
  { value: 'replace_suction_hose_assembly', label: 'Suction Hose Assembly' },
  { value: 'replace_fan_belt', label: 'Fan Belt' },
  { value: 'replace_filter_drier', label: 'Filter Drier' },
  { value: 'replace_discharge_hose_suction', label: 'Discharge Hose Suction' },
  { value: 'replace_ecv', label: 'ECV' },
  { value: 'replace_oring', label: 'O-ring' },
  { value: 'replace_radiator', label: 'Radiator' },
  { value: 'replace_cabin_filter', label: 'Cabin Filter' },
  { value: 'replace_magnetic', label: 'Magnetic' }
]

const pulldownJobs = [
  { value: 'pulldown_evaporator', label: 'Evaporator' },
  { value: 'pulldown_condenser', label: 'Condenser' },
  { value: 'pulldown_compressor', label: 'Compressor' }
]

const otherJobs = [
  { value: 'flushing_system', label: 'Flushing System' },
  { value: 'install_cabin_filter', label: 'Install Cabin Filter' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'freon', label: 'Freon' }
]

const filteredReplaceJobs = computed(() => filterJobs(replaceJobs))
const filteredPulldownJobs = computed(() => filterJobs(pulldownJobs))
const filteredOtherJobs = computed(() => filterJobs(otherJobs))
const allFilteredJobs = computed(() => [...filteredReplaceJobs.value, ...filteredPulldownJobs.value, ...filteredOtherJobs.value])

// Indexed lookup for O(1) performance
const recordsByPlate = computed(() => {
  const map = new Map()
  props.existingRecords.forEach(record => {
    const key = record.plate_number.trim().toUpperCase()
    // Keep the most recent record for each plate number
    if (!map.has(key) || new Date(record.service_date) > new Date(map.get(key).service_date)) {
      map.set(key, record)
    }
  })
  return map
})

// Simple debounce implementation
function debounce(fn, delay) {
  let timeoutId = null
  return function (...args) {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// Debounced autofill check
const checkAndAutoFill = debounce((newPlateNumber) => {
  // Skip if editing existing record
  if (props.service) return
  
  if (!newPlateNumber || newPlateNumber.trim() === '') {
    showAutoFillToast.value = false
    return
  }
  
  const normalizedPlate = newPlateNumber.trim().toUpperCase()
  const existingRecord = recordsByPlate.value.get(normalizedPlate)
  
  if (existingRecord) {
    formData.value.customer_name = existingRecord.customer_name || ''
    formData.value.phone = existingRecord.phone || ''
    formData.value.car_model = existingRecord.car_model || ''
    formData.value.car_year = existingRecord.car_year || ''
    
    // Show toast notification
    showAutoFillToast.value = true
  } else {
    showAutoFillToast.value = false
  }
}, 300)

function filterJobs(jobs) {
  if (!searchQuery.value) return jobs
  const query = searchQuery.value.toLowerCase()
  return jobs.filter(job => job.label.toLowerCase().includes(query))
}

function getSelectedCount(jobs) {
  return jobs.filter(job => selectedJobs.value.includes(job.value)).length
}

function getJobIndex(section, index) {
  if (section === 'replace') return index
  if (section === 'pulldown') return filteredReplaceJobs.value.length + index
  return filteredReplaceJobs.value.length + filteredPulldownJobs.value.length + index
}

function toggleJob(jobValue) {
  const index = selectedJobs.value.indexOf(jobValue)
  if (index > -1) {
    selectedJobs.value.splice(index, 1)
  } else {
    selectedJobs.value.push(jobValue)
  }
}

function handleTouchMove(event) {
  if (!isMobile.value) return
  
  if (touchMoveTimeout.value) {
    clearTimeout(touchMoveTimeout.value)
  }
  
  if (!hasTouchMoved.value) {
    hasTouchMoved.value = true
    
    const activeElement = document.activeElement
    if (activeElement && (
      activeElement.tagName === 'INPUT' || 
      activeElement.tagName === 'TEXTAREA'
    )) {
      activeElement.blur()
      
      const tempButton = document.createElement('button')
      tempButton.style.position = 'fixed'
      tempButton.style.top = '-9999px'
      document.body.appendChild(tempButton)
      tempButton.focus()
      setTimeout(() => {
        document.body.removeChild(tempButton)
      }, 0)
    }
  }
  
  touchMoveTimeout.value = setTimeout(() => {
    hasTouchMoved.value = false
  }, 300)
}

function handleKeyboardNav(event) {
  const totalJobs = allFilteredJobs.value.length
  
  if (totalJobs === 0) return
  
  if (event.key === '/' && document.activeElement !== searchInput.value) {
    event.preventDefault()
    searchInput.value?.focus()
    return
  }
  
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (focusedJobIndex.value === -1) {
      focusedJobIndex.value = 0
    } else {
      focusedJobIndex.value = Math.min(focusedJobIndex.value + 1, totalJobs - 1)
    }
    scrollToFocusedJob()
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (focusedJobIndex.value === -1) {
      focusedJobIndex.value = 0
    } else {
      focusedJobIndex.value = Math.max(focusedJobIndex.value - 1, 0)
    }
    scrollToFocusedJob()
  } else if (event.key === ' ' && focusedJobIndex.value >= 0) {
    event.preventDefault()
    const job = allFilteredJobs.value[focusedJobIndex.value]
    if (job) toggleJob(job.value)
  } else if (event.key === 'Enter') {
    event.preventDefault()
    handleNext()
  }
}

function scrollToFocusedJob() {
  nextTick(() => {
    const focusedEl = jobRefs.value[focusedJobIndex.value]
    if (focusedEl) {
      focusedEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  })
}

const canProceed = computed(() => {
  errors.value = {}
  
  if (currentStep.value === 1) {
    if (!formData.value.plate_number || formData.value.plate_number.trim() === '') {
      errors.value.plate_number = 'Plate number is required'
      return false
    }
    return true
  }
  
  if (currentStep.value === 2) {
    if (formData.value.jobs_done.length === 0) {
      errors.value.jobs_done = 'Please select at least one service'
      return false
    }
    return true
  }
  
  if (currentStep.value === 3) {
    if (!formData.value.service_date) {
      errors.value.service_date = 'Date is required'
      return false
    }
    if (formData.value.cost < 0) {
      errors.value.cost = 'Cost must be 0 or greater'
      return false
    }
    return true
  }
  
  return false
})

function safeDeepClone(obj) {
  if (!obj) return obj
  return JSON.parse(JSON.stringify(obj))
}

onMounted(() => {
  if (props.service) {
    formData.value = safeDeepClone(props.service)
    
    if (!formData.value.jobs_done) formData.value.jobs_done = []
    if (!formData.value.owner_parts) formData.value.owner_parts = {}
    if (!formData.value.part_condition) formData.value.part_condition = {}
    
    selectedJobs.value = [...formData.value.jobs_done]
    hasUnsavedChanges.value = false
    
    initialFormSnapshot.value = JSON.stringify(formData.value)
  } else {
    formData.value.service_date = new Date().toISOString().split('T')[0]
    hasUnsavedChanges.value = false
    initialFormSnapshot.value = null
  }
  
  const handleResize = () => {
    isMobile.value = window.innerWidth < 768
    if (isMobile.value && isServicesExpanded.value) {
      isServicesExpanded.value = false
    }
  }
  
  window.addEventListener('resize', handleResize)
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (touchMoveTimeout.value) {
      clearTimeout(touchMoveTimeout.value)
    }
  })
})

// Watch for prop changes to reset form when opening with new data
watch(() => props.service, (newService) => {
  if (newService && props.show) {
    formData.value = safeDeepClone(newService)
    
    if (!formData.value.jobs_done) formData.value.jobs_done = []
    if (!formData.value.owner_parts) formData.value.owner_parts = {}
    if (!formData.value.part_condition) formData.value.part_condition = {}
    
    selectedJobs.value = [...formData.value.jobs_done]
    initialFormSnapshot.value = JSON.stringify(formData.value)
    hasUnsavedChanges.value = false
  }
}, { deep: true })

watch(formData, () => {
  if (initialFormSnapshot.value) {
    const currentSnapshot = JSON.stringify(formData.value)
    hasUnsavedChanges.value = currentSnapshot !== initialFormSnapshot.value
  } else {
    const hasChanges = 
      formData.value.plate_number !== '' ||
      formData.value.customer_name !== '' ||
      formData.value.phone !== '' ||
      formData.value.car_model !== '' ||
      formData.value.car_year !== '' ||
      formData.value.invoice !== '' ||
      formData.value.jobs_done.length > 0 ||
      formData.value.cost !== 0 ||
      formData.value.description !== ''
    
    hasUnsavedChanges.value = hasChanges
  }
}, { deep: true })

function handlePlateNumberInput(event) {
  const plateNumber = event.target.value
  checkAndAutoFill(plateNumber)
}

watch(selectedJobs, (newVal) => {
  formData.value.jobs_done = [...newVal]
}, { deep: true })

watch(searchQuery, () => {
  focusedJobIndex.value = allFilteredJobs.value.length > 0 ? 0 : -1
})

watch(currentStep, (newStep, oldStep) => {
  if (oldStep === 2 && newStep !== 2) {
    isServicesExpanded.value = false
  }
})

function getJobLabel(jobValue) {
  return jobLabels[jobValue] || jobValue
}

function isReplaceJob(jobValue) {
  return jobValue.startsWith('replace_')
}

function getPartType(jobValue) {
  if (formData.value.owner_parts[jobValue]) {
    return 'owner'
  }
  if (formData.value.part_condition[jobValue]) {
    return formData.value.part_condition[jobValue]
  }
  return null
}

function setPartType(jobValue, type) {
  if (type === 'owner') {
    formData.value.owner_parts[jobValue] = true
    delete formData.value.part_condition[jobValue]
  } else {
    formData.value.part_condition[jobValue] = type
    delete formData.value.owner_parts[jobValue]
  }
}

function removeJob(jobValue) {
  const index = selectedJobs.value.indexOf(jobValue)
  if (index > -1) {
    selectedJobs.value.splice(index, 1)
    delete formData.value.owner_parts[jobValue]
    delete formData.value.part_condition[jobValue]
  }
}

function clearAllServices() {
  showClearServicesDialog.value = true
}

function confirmClearServices() {
  selectedJobs.value = []
  formData.value.owner_parts = {}
  formData.value.part_condition = {}
  showClearServicesDialog.value = false
}

function toggleServicesExpansion() {
  if (isMobile.value) {
    openServicesSheet()
  } else {
    isServicesExpanded.value = !isServicesExpanded.value
    if (isServicesExpanded.value) {
      searchQuery.value = ''
      nextTick(() => {
        searchInput.value?.focus()
        focusedJobIndex.value = 0
      })
    } else {
      searchQuery.value = ''
    }
  }
}

function openServicesSheet() {
  isServicesSheetOpen.value = true
}

function closeServicesSheet() {
  isServicesSheetOpen.value = false
}

function handleBack() {
  if (currentStep.value > 1) {
    currentStep.value--
    errors.value = {}
    isServicesExpanded.value = false
  }
}

function handleNext() {
  if (!canProceed.value) return

  if (currentStep.value < 3) {
    currentStep.value++
    errors.value = {}
  } else {
    handleSubmit()
  }
}

function handleSubmit() {
  const dataToSave = { ...formData.value }
  
  const now = new Date().toISOString().split('T')[0]
  
  if (props.service?.id) {
    dataToSave.id = props.service.id
    dataToSave.created_at = props.service.created_at
    dataToSave.updated_at = now
    dataToSave.updated_by = 'admin'
  } else {
    dataToSave.created_at = now
    dataToSave.updated_at = now
    dataToSave.updated_by = 'admin'
  }
  
  emit('save', dataToSave)
  close()
}

function handleBackdropClick() {
  if (hasUnsavedChanges.value) {
    showDiscardDialog.value = true
  } else {
    close()
  }
}

function confirmDiscard() {
  showDiscardDialog.value = false
  close()
}

function handleAfterLeave() {
  // Reset all state after transition completes
  currentStep.value = 1
  errors.value = {}
  isServicesExpanded.value = false
  hasUnsavedChanges.value = false
  initialFormSnapshot.value = null
  showAutoFillToast.value = false
  
  formData.value = {
    customer_name: '',
    phone: '',
    car_model: '',
    car_year: '',
    invoice: '',
    plate_number: '',
    jobs_done: [],
    owner_parts: {},
    part_condition: {},
    service_date: '',
    cost: 0,
    description: ''
  }
  
  selectedJobs.value = []
  
  // Notify parent that transition is complete
  emit('closed')
}

function close() {
  // Just emit close - parent will set show=false
  // State will be reset in handleAfterLeave
  emit('close')
}
</script>

<style scoped>
.active\:scale-95:active {
  transform: scale(0.95);
}

.active\:scale-98:active {
  transform: scale(0.98);
}
</style>