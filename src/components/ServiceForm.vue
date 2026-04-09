<template>
  <div>
    <!-- Backdrop -->
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
        class="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-40"
        @click="handleBackdropClick"
      />
    </transition>

    <!-- Form Panel -->
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
        class="fixed inset-0 z-50 flex flex-col bg-brand-offwhite overflow-hidden md:inset-y-0 md:right-0 md:left-auto md:w-[480px] lg:w-[560px]"
      >
        <!-- Step Indicator -->
        <StepIndicator :current-step="currentStep" />

        <!-- Scrollable Content -->
        <div
          ref="scrollContainer"
          class="flex-1 overflow-y-auto pb-[84px] md:pb-0"
          @touchmove="handleTouchMove"
        >
          <form @submit.prevent="handleNext" class="p-5 space-y-5">

            <!-- STEP 1: Client & Vehicle -->
            <div v-if="currentStep === 1" class="space-y-4">
              <h2 class="text-lg font-bold text-brand-navy">Client & Vehicle Details</h2>

              <!-- Plate Number -->
              <div>
                <label class="block text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-1.5">
                  Plate Number <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.plate_number"
                  type="text"
                  required
                  @input="handlePlateNumberInput"
                  class="w-full h-11 px-4 bg-white border border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono tracking-wider uppercase shadow-sm"
                  style="border-radius: 6px;"
                  placeholder="ABC 1234"
                />
                <p v-if="errors.plate_number" class="text-xs text-red-500 mt-1">{{ errors.plate_number }}</p>
              </div>

              <div class="border-t border-border" />

              <!-- Customer Name -->
              <div>
                <label class="block text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-1.5">
                  Customer Name
                </label>
                <input
                  v-model="formData.customer_name"
                  type="text"
                  class="w-full h-11 px-4 bg-white border border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                  style="border-radius: 6px;"
                  placeholder="Enter customer name"
                />
              </div>

              <!-- Phone -->
              <div>
                <label class="block text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-1.5">
                  Phone Number
                </label>
                <input
                  v-model="formData.phone"
                  type="tel"
                  inputmode="numeric"
                  class="w-full h-11 px-4 bg-white border border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                  style="border-radius: 6px;"
                  placeholder="09xxxxxxxxx"
                />
              </div>

              <div class="border-t border-border" />

              <!-- Car Model & Year -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-1.5">
                    Car Model
                  </label>
                  <input
                    v-model="formData.car_model"
                    type="text"
                    class="w-full h-11 px-4 bg-white border border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                    style="border-radius: 6px;"
                    placeholder="Toyota Vios"
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-1.5">
                    Model Year
                  </label>
                  <input
                    v-model="formData.car_year"
                    type="number"
                    inputmode="numeric"
                    min="1900"
                    :max="new Date().getFullYear() + 1"
                    class="w-full h-11 px-4 bg-white border border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                    style="border-radius: 6px;"
                    placeholder="2024"
                  />
                </div>
              </div>
            </div>

            <!-- STEP 2: Services -->
            <div v-if="currentStep === 2" class="space-y-4">
              <h2 class="text-lg font-bold text-brand-navy">Services</h2>

              <!-- Add Services Button -->
              <button
                type="button"
                @click="toggleServicesExpansion"
                class="w-full flex items-center justify-between p-4 bg-white border border-border hover:border-primary transition-all shadow-sm"
                style="border-radius: 6px;"
              >
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-brand-navy flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-brand-ice" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div class="text-left">
                    <span class="block text-sm font-bold text-foreground">
                      {{ formData.jobs_done.length > 0 ? 'Edit Services' : 'Add Services' }}
                    </span>
                    <span class="block text-xs text-muted-foreground">
                      {{ formData.jobs_done.length > 0 ? `${formData.jobs_done.length} selected` : isMobile ? 'Tap to select' : 'Click to expand' }}
                    </span>
                  </div>
                </div>
                <svg
                  :class="['w-4 h-4 text-muted-foreground transition-transform', isServicesExpanded && !isMobile && 'rotate-180']"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" :d="isMobile ? 'M9 5l7 7-7 7' : 'M19 9l-7 7-7-7'" />
                </svg>
              </button>

              <!-- Selected Services -->
              <div v-if="formData.jobs_done.length > 0" class="space-y-3">
                <div class="flex items-center justify-between">
                  <p class="text-[10px] font-semibold text-brand-ice uppercase tracking-widest">Selected Services</p>
                  <button
                    type="button"
                    @click="clearAllServices"
                    class="text-xs text-red-500 hover:text-red-400 font-medium"
                  >
                    Clear All
                  </button>
                </div>

                <div class="divide-y divide-border border border-border bg-white shadow-sm overflow-hidden" style="border-radius: 6px;">
                  <div
                    v-for="job in formData.jobs_done"
                    :key="job"
                    class="px-4 py-3 space-y-2.5"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-semibold text-foreground">{{ getJobLabel(job) }}</span>
                      <button
                        type="button"
                        @click="removeJob(job)"
                        class="p-1 hover:bg-red-50 rounded transition-colors"
                        style="border-radius: 4px;"
                      >
                        <svg class="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <!-- Part Condition (Replace jobs only) -->
                    <div v-if="isReplaceJob(job)" class="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        @click="setPartType(job, 'brand_new')"
                        :class="[
                          'py-1.5 text-xs font-semibold border transition-all',
                          getPartType(job) === 'brand_new'
                            ? 'bg-green-100 border-green-300 text-green-900'
                            : 'bg-white border-border text-muted-foreground hover:border-emerald-300'
                        ]"
                        style="border-radius: 4px;"
                      >
                        New
                      </button>
                      <button
                        type="button"
                        @click="setPartType(job, 'surplus')"
                        :class="[
                          'py-1.5 text-xs font-semibold border transition-all',
                          getPartType(job) === 'surplus'
                            ? 'bg-amber-100 border-amber-200 text-amber-700'
                            : 'bg-white border-border text-muted-foreground hover:border-amber-300'
                        ]"
                        style="border-radius: 4px;"
                      >
                        Surplus
                      </button>
                      <button
                        type="button"
                        @click="setPartType(job, 'owner')"
                        :class="[
                          'py-1.5 text-xs font-semibold border transition-all',
                          getPartType(job) === 'owner'
                            ? 'bg-brand-sky border-brand-ice/30 text-brand-navy'
                            : 'bg-white border-border text-muted-foreground hover:border-brand-ice'
                        ]"
                        style="border-radius: 4px;"
                      >
                        Owner's
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <p v-if="errors.jobs_done" class="text-xs text-red-500 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {{ errors.jobs_done }}
              </p>
            </div>

            <!-- STEP 3: Billing & Summary -->
            <div v-if="currentStep === 3" class="space-y-4">
              <h2 class="text-lg font-bold text-brand-navy">Billing & Summary</h2>

              <!-- Invoice & Date -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-1.5">
                    Invoice No.
                  </label>
                  <input
                    v-model="formData.invoice"
                    type="text"
                    inputmode="numeric"
                    class="w-full h-11 px-4 bg-white border border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                    style="border-radius: 6px;"
                    placeholder="1234"
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-1.5">
                    Date <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.service_date"
                    type="date"
                    required
                    class="w-full h-11 px-4 bg-white border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                    style="border-radius: 6px;"
                  />
                  <p v-if="errors.service_date" class="text-xs text-red-500 mt-1">{{ errors.service_date }}</p>
                </div>
              </div>

              <!-- Cost -->
              <div>
                <label class="block text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-1.5">
                  Cost (₱) <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="formData.cost"
                  type="number"
                  inputmode="decimal"
                  step="0.01"
                  min="0"
                  required
                  class="w-full h-11 px-4 bg-white border border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all tabular-nums shadow-sm"
                  style="border-radius: 6px;"
                  placeholder="0.00"
                />
                <p v-if="errors.cost" class="text-xs text-red-500 mt-1">{{ errors.cost }}</p>
              </div>

              <!-- Notes -->
              <div>
                <label class="block text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-1.5">
                  Notes
                </label>
                <textarea
                  v-model="formData.description"
                  rows="4"
                  class="w-full px-4 py-3 bg-white border border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-sm"
                  style="border-radius: 6px;"
                  placeholder="Additional details..."
                />
              </div>

              <!-- Summary Card -->
              <div class="bg-white border border-border shadow-sm overflow-hidden" style="border-radius: 6px;">
                <div class="px-4 py-2.5 bg-brand-navy">
                  <p class="text-[10px] font-semibold text-brand-ice uppercase tracking-widest">Summary</p>
                </div>
                <div class="p-4 space-y-3 text-sm">
                  <div class="flex justify-between items-center">
                    <span class="text-muted-foreground">Plate Number</span>
                    <span class="font-bold font-mono tracking-wider text-foreground">{{ (formData.plate_number || '—').toUpperCase() }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-muted-foreground">Phone</span>
                    <span class="font-medium text-foreground">{{ formData.phone || '—' }}</span>
                  </div>

                  <div v-if="formData.jobs_done.length > 0" class="border-t border-border pt-3">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-muted-foreground font-medium">Services</span>
                      <span class="text-xs text-brand-navy font-bold bg-brand-sky px-2 py-0.5 rounded">{{ formData.jobs_done.length }} selected</span>
                    </div>
                    <div class="space-y-1.5 max-h-[160px] overflow-y-auto">
                      <div
                        v-for="job in formData.jobs_done"
                        :key="job"
                        class="flex items-start gap-2 text-xs"
                      >
                        <svg class="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span class="text-foreground font-medium">{{ getJobLabel(job) }}</span>
                        <span
                          v-if="isReplaceJob(job) && getPartType(job)"
                          class="ml-auto px-1.5 py-0.5 rounded text-[10px] font-semibold"
                          :class="{
                            'bg-emerald-100 text-emerald-700': getPartType(job) === 'brand_new',
                            'bg-amber-100 text-amber-700': getPartType(job) === 'surplus',
                            'bg-brand-sky text-brand-navy': getPartType(job) === 'owner'
                          }"
                        >
                          {{ getPartType(job) === 'brand_new' ? 'New' : getPartType(job) === 'surplus' ? 'Surplus' : "Owner's" }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div v-else class="border-t border-border pt-3">
                    <span class="text-muted-foreground text-xs italic">No services selected</span>
                  </div>

                  <div class="border-t border-border pt-3 flex justify-between items-center">
                    <span class="font-semibold text-foreground">Total Cost</span>
                    <span class="text-xl font-extrabold text-green-600 tabular-nums">₱{{ formData.cost.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Sticky Footer -->
        <div class="fixed bottom-0 left-0 right-0 md:relative border-t border-border p-4 bg-brand-offwhite mb-[56px] md:mb-0 z-10">
          <div class="flex gap-3">
            <!-- Back / Cancel -->
            <button
              v-if="currentStep > 1"
              @click="handleBack"
              type="button"
              class="flex-1 h-11 flex items-center justify-center gap-2 bg-white border border-border text-foreground font-semibold text-sm transition-all active:scale-95 hover:border-primary"
              style="border-radius: 6px;"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <button
              v-else
              @click="handleBackdropClick"
              type="button"
              class="flex-1 h-11 flex items-center justify-center gap-2 bg-white border border-border text-foreground font-semibold text-sm transition-all active:scale-95 hover:border-primary"
              style="border-radius: 6px;"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>

            <!-- Next / Save -->
            <button
              @click="handleNext"
              type="button"
              :disabled="!canProceed"
              class="flex-1 h-11 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-sm shadow-sm active:scale-[0.97] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              style="border-radius: 6px;"
            >
              <span>{{ currentStep === 3 ? (service ? 'Update Record' : 'Save Record') : 'Next Step' }}</span>
              <svg v-if="currentStep < 3" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Services Overlay Panel (Desktop) -->
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
        class="fixed inset-y-0 right-[480px] lg:right-[560px] w-[420px] lg:w-[480px] bg-brand-offwhite border-r border-border shadow-2xl z-[60] overflow-hidden"
      >
        <div class="h-full overflow-y-auto p-5">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-bold text-brand-navy">Select Services</h3>
            <button
              @click="isServicesExpanded = false"
              class="p-1.5 hover:bg-muted rounded transition-colors"
              style="border-radius: 4px;"
            >
              <svg class="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Search -->
          <div class="relative mb-4">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="Search services..."
              @keydown="handleKeyboardNav"
              class="w-full h-10 pl-10 pr-3 bg-white border border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              style="border-radius: 6px;"
            />
          </div>

          <!-- Service Sections -->
          <div class="space-y-5">
            <div v-for="(section, sectionKey) in serviceSections" :key="sectionKey">
              <div class="flex items-center justify-between mb-2">
                <p class="text-[10px] font-semibold text-brand-ice uppercase tracking-widest">{{ section.label }}</p>
                <span v-if="getSelectedCount(section.jobs) > 0" class="text-[10px] font-bold text-brand-navy bg-brand-sky px-1.5 py-0.5 rounded">
                  {{ getSelectedCount(section.jobs) }}
                </span>
              </div>
              <div class="space-y-1">
                <button
                  v-for="(job, index) in section.jobs"
                  :key="job.value"
                  :ref="el => { if (el) jobRefs[getJobIndex(sectionKey, index)] = el }"
                  @click="toggleJob(job.value)"
                  :class="[
                    'w-full flex items-center justify-between px-3 py-2.5 border transition-all text-left',
                    selectedJobs.includes(job.value)
                      ? 'bg-brand-sky border-brand-ice text-brand-navy'
                      : 'bg-white border-border text-foreground hover:border-primary',
                    focusedJobIndex === getJobIndex(sectionKey, index) && 'ring-2 ring-primary/30'
                  ]"
                  style="border-radius: 6px;"
                >
                  <span class="text-sm font-medium">{{ job.label }}</span>
                  <div :class="[
                    'w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0',
                    selectedJobs.includes(job.value)
                      ? 'bg-brand-navy border-brand-navy'
                      : 'border-border'
                  ]">
                    <svg v-if="selectedJobs.includes(job.value)" class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Keyboard Shortcuts -->
          <div class="mt-6 p-3 bg-white border border-border rounded-lg">
            <p class="text-[10px] font-semibold text-brand-ice uppercase tracking-widest mb-2">Keyboard Shortcuts</p>
            <div class="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div class="flex items-center gap-1.5">
                <kbd class="px-1.5 py-0.5 bg-muted border border-border rounded text-[10px] font-mono">↑↓</kbd>
                <span>Navigate</span>
              </div>
              <div class="flex items-center gap-1.5">
                <kbd class="px-1.5 py-0.5 bg-muted border border-border rounded text-[10px] font-mono">Space</kbd>
                <span>Toggle</span>
              </div>
              <div class="flex items-center gap-1.5">
                <kbd class="px-1.5 py-0.5 bg-muted border border-border rounded text-[10px] font-mono">Enter</kbd>
                <span>Next Step</span>
              </div>
              <div class="flex items-center gap-1.5">
                <kbd class="px-1.5 py-0.5 bg-muted border border-border rounded text-[10px] font-mono">/</kbd>
                <span>Search</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Services Bottom Sheet (Mobile) -->
    <ServicesBottomSheet
      v-if="isMobile"
      :is-open="isServicesSheetOpen"
      v-model="formData.jobs_done"
      @close="closeServicesSheet"
    />

    <!-- Discard Dialog -->
    <AlertDialog v-model:open="showDiscardDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard changes?</AlertDialogTitle>
          <AlertDialogDescription>All unsaved changes will be lost.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Continue editing</AlertDialogCancel>
          <AlertDialogAction @click="confirmDiscard">Discard changes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <!-- Clear Services Dialog -->
    <AlertDialog v-model:open="showClearServicesDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear all services?</AlertDialogTitle>
          <AlertDialogDescription>This will remove all selected services and their part details.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="confirmClearServices">Clear all</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <!-- Toast -->
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
const touchMoveTimeout = ref(null)
const hasTouchMoved = ref(false)
const showDiscardDialog = ref(false)
const showClearServicesDialog = ref(false)
const hasUnsavedChanges = ref(false)
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

const serviceSections = computed(() => ({
  replace: { label: 'Replace', jobs: filterJobs(replaceJobs) },
  pulldown: { label: 'Pulldown', jobs: filterJobs(pulldownJobs) },
  other: { label: 'Other Services', jobs: filterJobs(otherJobs) }
}))

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

const recordsByPlate = computed(() => {
  const map = new Map()
  props.existingRecords.forEach(record => {
    const key = record.plate_number.trim().toUpperCase()
    if (!map.has(key) || new Date(record.service_date) > new Date(map.get(key).service_date)) {
      map.set(key, record)
    }
  })
  return map
})

function debounce(fn, delay) {
  let timeoutId = null
  return function (...args) {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}

const checkAndAutoFill = debounce((newPlateNumber) => {
  if (props.service) return
  if (!newPlateNumber || newPlateNumber.trim() === '') { showAutoFillToast.value = false; return }
  const existingRecord = recordsByPlate.value.get(newPlateNumber.trim().toUpperCase())
  if (existingRecord) {
    formData.value.customer_name = existingRecord.customer_name || ''
    formData.value.phone = existingRecord.phone || ''
    formData.value.car_model = existingRecord.car_model || ''
    formData.value.car_year = existingRecord.car_year || ''
    showAutoFillToast.value = true
  } else {
    showAutoFillToast.value = false
  }
}, 300)

function filterJobs(jobs) {
  if (!searchQuery.value) return jobs
  return jobs.filter(job => job.label.toLowerCase().includes(searchQuery.value.toLowerCase()))
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
  if (index > -1) selectedJobs.value.splice(index, 1)
  else selectedJobs.value.push(jobValue)
}

function handleTouchMove(event) {
  if (!isMobile.value) return
  if (touchMoveTimeout.value) clearTimeout(touchMoveTimeout.value)
  if (!hasTouchMoved.value) {
    hasTouchMoved.value = true
    const activeElement = document.activeElement
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      activeElement.blur()
    }
  }
  touchMoveTimeout.value = setTimeout(() => { hasTouchMoved.value = false }, 300)
}

function handleKeyboardNav(event) {
  const totalJobs = allFilteredJobs.value.length
  if (totalJobs === 0) return
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    focusedJobIndex.value = focusedJobIndex.value === -1 ? 0 : Math.min(focusedJobIndex.value + 1, totalJobs - 1)
    scrollToFocusedJob()
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    focusedJobIndex.value = focusedJobIndex.value === -1 ? 0 : Math.max(focusedJobIndex.value - 1, 0)
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
    jobRefs.value[focusedJobIndex.value]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  })
}

const canProceed = computed(() => {
  errors.value = {}
  if (currentStep.value === 1) {
    if (!formData.value.plate_number?.trim()) { errors.value.plate_number = 'Plate number is required'; return false }
    return true
  }
  if (currentStep.value === 2) {
    if (formData.value.jobs_done.length === 0) { errors.value.jobs_done = 'Please select at least one service'; return false }
    return true
  }
  if (currentStep.value === 3) {
    if (!formData.value.service_date) { errors.value.service_date = 'Date is required'; return false }
    if (formData.value.cost < 0) { errors.value.cost = 'Cost must be 0 or greater'; return false }
    return true
  }
  return false
})

function safeDeepClone(obj) {
  if (!obj) return obj
  return JSON.parse(JSON.stringify(obj))
}

// ── Shared initializer so both onMounted and watchers use the same logic ──
function initFormFromService(service) {
  formData.value = safeDeepClone(service)
  if (!formData.value.jobs_done) formData.value.jobs_done = []
  if (!formData.value.owner_parts) formData.value.owner_parts = {}
  if (!formData.value.part_condition) formData.value.part_condition = {}
  selectedJobs.value = [...formData.value.jobs_done]
  currentStep.value = 1
  errors.value = {}
  isServicesExpanded.value = false
  initialFormSnapshot.value = JSON.stringify(formData.value)
  hasUnsavedChanges.value = false
}

onMounted(() => {
  if (props.service) {
    initFormFromService(props.service)
  } else {
    formData.value.service_date = new Date().toISOString().split('T')[0]
    hasUnsavedChanges.value = false
    initialFormSnapshot.value = null
  }

  const handleResize = () => {
    isMobile.value = window.innerWidth < 768
    if (isMobile.value && isServicesExpanded.value) isServicesExpanded.value = false
  }
  window.addEventListener('resize', handleResize)
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (touchMoveTimeout.value) clearTimeout(touchMoveTimeout.value)
  })
})

// ── FIX: watch props.show becoming true to re-initialize the form.
//         This handles the case where the user switches history entries
//         while the form is closed — when they then click Edit, the form
//         opens with the correct (newly selected) service data instead of
//         whatever was loaded on first mount.
watch(
  () => props.show,
  (isOpen) => {
    if (isOpen && props.service) {
      initFormFromService(props.service)
    }
  }
)

// ── Keep in sync if the service prop changes while the form is already open
//    (e.g. a save from a parent that updates the record in place).
watch(
  () => props.service,
  (newService) => {
    if (newService && props.show) {
      initFormFromService(newService)
    }
  },
  { deep: true }
)

watch(formData, () => {
  if (initialFormSnapshot.value) {
    hasUnsavedChanges.value = JSON.stringify(formData.value) !== initialFormSnapshot.value
  } else {
    hasUnsavedChanges.value = formData.value.plate_number !== '' || formData.value.customer_name !== '' ||
      formData.value.phone !== '' || formData.value.car_model !== '' || formData.value.car_year !== '' ||
      formData.value.invoice !== '' || formData.value.jobs_done.length > 0 ||
      formData.value.cost !== 0 || formData.value.description !== ''
  }
}, { deep: true })

function handlePlateNumberInput(event) { checkAndAutoFill(event.target.value) }

watch(selectedJobs, (newVal) => { formData.value.jobs_done = [...newVal] }, { deep: true })
watch(searchQuery, () => { focusedJobIndex.value = allFilteredJobs.value.length > 0 ? 0 : -1 })
watch(currentStep, (newStep, oldStep) => { if (oldStep === 2 && newStep !== 2) isServicesExpanded.value = false })

function getJobLabel(jobValue) { return jobLabels[jobValue] || jobValue }
function isReplaceJob(jobValue) { return jobValue.startsWith('replace_') }

function getPartType(jobValue) {
  if (formData.value.owner_parts[jobValue]) return 'owner'
  if (formData.value.part_condition[jobValue]) return formData.value.part_condition[jobValue]
  return null
}

function setPartType(jobValue, type) {
  if (type === 'owner') { formData.value.owner_parts[jobValue] = true; delete formData.value.part_condition[jobValue] }
  else { formData.value.part_condition[jobValue] = type; delete formData.value.owner_parts[jobValue] }
}

function removeJob(jobValue) {
  const index = selectedJobs.value.indexOf(jobValue)
  if (index > -1) { selectedJobs.value.splice(index, 1); delete formData.value.owner_parts[jobValue]; delete formData.value.part_condition[jobValue] }
}

function clearAllServices() { showClearServicesDialog.value = true }
function confirmClearServices() { selectedJobs.value = []; formData.value.owner_parts = {}; formData.value.part_condition = {}; showClearServicesDialog.value = false }

function toggleServicesExpansion() {
  if (isMobile.value) { openServicesSheet() }
  else {
    isServicesExpanded.value = !isServicesExpanded.value
    if (isServicesExpanded.value) { searchQuery.value = ''; nextTick(() => { searchInput.value?.focus(); focusedJobIndex.value = 0 }) }
    else { searchQuery.value = '' }
  }
}

function openServicesSheet() { isServicesSheetOpen.value = true }
function closeServicesSheet() { isServicesSheetOpen.value = false }
function handleBack() { if (currentStep.value > 1) { currentStep.value--; errors.value = {}; isServicesExpanded.value = false } }

function handleNext() {
  if (!canProceed.value) return
  if (currentStep.value < 3) { currentStep.value++; errors.value = {} }
  else { handleSubmit() }
}

function handleSubmit() {
  const dataToSave = { ...formData.value }
  dataToSave.plate_number = dataToSave.plate_number.trim().toUpperCase()
  const now = new Date().toISOString().split('T')[0]
  if (props.service?.id) { dataToSave.id = props.service.id; dataToSave.created_at = props.service.created_at; dataToSave.updated_at = now; dataToSave.updated_by = 'admin' }
  else { dataToSave.created_at = now; dataToSave.updated_at = now; dataToSave.updated_by = 'admin' }
  emit('save', dataToSave)
  close()
}

function handleBackdropClick() { hasUnsavedChanges.value ? showDiscardDialog.value = true : close() }
function confirmDiscard() { showDiscardDialog.value = false; close() }

function handleAfterLeave() {
  currentStep.value = 1; errors.value = {}; isServicesExpanded.value = false
  hasUnsavedChanges.value = false; initialFormSnapshot.value = null; showAutoFillToast.value = false
  formData.value = { customer_name: '', phone: '', car_model: '', car_year: '', invoice: '', plate_number: '', jobs_done: [], owner_parts: {}, part_condition: {}, service_date: '', cost: 0, description: '' }
  selectedJobs.value = []
  emit('closed')
}

function close() { emit('close') }
</script>