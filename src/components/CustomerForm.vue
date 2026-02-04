<template>
  <!-- 
    Modal Overlay:
    - fixed: fixed positioning
    - inset-0: covers entire screen (top-0, right-0, bottom-0, left-0)
    - bg-black bg-opacity-50: semi-transparent black background
    - z-50: high z-index to appear above other content
    - flex items-center justify-center: centers the modal
  -->
  <div
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    @click.self="close"
  >
    <!-- 
      @click.self: only triggers if you click the overlay itself, not the modal content
      This allows closing by clicking outside the modal
    -->

    <!-- Modal Content -->
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
      <!-- 
        Modal Styling:
        - bg-white: white background
        - rounded-lg: rounded corners
        - shadow-xl: large shadow for depth
        - w-full: full width on mobile
        - max-w-md: maximum width on desktop (28rem / 448px)
        - max-h-[90vh]: maximum height (90% of viewport)
        - overflow-y-auto: scroll if content is too tall
      -->

      <!-- Modal Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
        <!-- 
          sticky top-0: sticks to top when scrolling
        -->
        <h3 class="text-lg md:text-xl font-semibold text-gray-900">
          {{ customer ? 'Edit Customer' : 'Add New Customer' }}
        </h3>
        <button
          @click="close"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <span class="text-2xl">&times;</span>
        </button>
      </div>

      <!-- Form Content -->
      <form @submit.prevent="handleSubmit" class="p-4 md:p-6 space-y-4">
        <!-- 
          Form Handling:
          - @submit.prevent: prevents default form submission and page reload
          - space-y-4: vertical spacing between form fields
        -->

        <!-- Name Field -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
            Customer Name
          </label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="Enter customer name"
          />
          <!-- 
            v-model: two-way binding
            - When user types, formData.name updates
            - When formData.name changes, input value updates
          -->
        </div>

        <!-- Phone Field -->
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
            Phone Number 
          </label>
          <input
            id="phone"
            v-model="formData.phone"
            type="tel"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="09xxxxxxxxx"
          />
        </div>

        <!-- Car Model Field -->
        <div>
          <label for="car_model" class="block text-sm font-medium text-gray-700 mb-1">
            Car Model 
          </label>
          <input
            id="car_model"
            v-model="formData.car_model"
            type="text"
            
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="e.g., Toyota Vios"
          />
        </div>

        <!-- Plate Number Field -->
        <div>
          <label for="plate_number" class="block text-sm font-medium text-gray-700 mb-1">
            Plate Number 
            <input 
            id="plate_number"
            v-model="formData.plate_number"
            type="text"
            
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="e.g., ABC 1234"
            />

          </label>
        </div>

        <!-- Car Year Field -->
        <div>
          <label for="car_year" class="block text-sm font-medium text-gray-700 mb-1">
            Car Year 
          </label>
          <input
            id="car_year"
            v-model="formData.car_year"
            type="text"
            
            pattern="[0-9]{4}"
            maxlength="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="2020"
          />
          <!-- 
            pattern="[0-9]{4}": HTML5 validation for 4 digits
            maxlength="4": prevents typing more than 4 characters
          -->
        </div>

        <!-- Form Actions -->
        <div class="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="close"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="flex-1 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors font-medium shadow-sm"
          >
            {{ customer ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Props: data passed from parent component
const props = defineProps({
  customer: {
    type: Object,
    default: null // null = new customer, object = edit customer
  }
})

// Emits: events sent to parent component
const emit = defineEmits(['close', 'save'])

// Form data - reactive object
const formData = ref({
  name: '',
  phone: '',
  email: '',
  car_model: '',
  car_year: ''
})

// Initialize form when component mounts or when customer prop changes
onMounted(() => {
  if (props.customer) {
    // Edit mode: populate form with existing data
    formData.value = {
      name: props.customer.name || '',
      phone: props.customer.phone || '',
      email: props.customer.email || '',
      car_model: props.customer.car_model || '',
      car_year: props.customer.car_year || ''
    }
  } else {
    // Add mode: start with empty form
    formData.value = {
      name: '',
      phone: '',
      email: '',
      car_model: '',
      car_year: ''
    }
  }
})

function handleSubmit() {
  // Prepare data to send to parent
  const dataToSave = {
    ...formData.value
  }

  // If editing, include the ID
  if (props.customer?.id) {
    dataToSave.id = props.customer.id
  }

  // Emit 'save' event with the form data
  emit('save', dataToSave)
}

function close() {
  emit('close')
}
</script>
