<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Tạo hợp đồng mới</h1>
          <p class="text-gray-600 mt-1">Tạo hợp đồng thuê phòng cho khách thuê</p>
        </div>
        <router-link
          to="/contracts"
          class="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Quay lại
        </router-link>
      </div>
    </div>

    <!-- Form -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Room Selection -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Phòng <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.roomId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': errors.roomId }"
            >
              <option value="">Chọn phòng</option>
              <option
                v-for="room in availableRooms"
                :key="room.id"
                :value="room.id"
              >
                {{ room.name }} - {{ formatCurrency(room.price) }}/tháng
              </option>
            </select>
            <p v-if="errors.roomId" class="text-red-500 text-sm mt-1">{{ errors.roomId }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Khách thuê <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.tenantId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': errors.tenantId }"
            >
              <option value="">Chọn khách thuê</option>
              <option
                v-for="tenant in tenants"
                :key="tenant.id"
                :value="tenant.id"
              >
                {{ tenant.name }} - {{ tenant.phone }}
              </option>
            </select>
            <p v-if="errors.tenantId" class="text-red-500 text-sm mt-1">{{ errors.tenantId }}</p>
          </div>
        </div>

        <!-- Contract Dates -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ngày bắt đầu <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.startDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': errors.startDate }"
            />
            <p v-if="errors.startDate" class="text-red-500 text-sm mt-1">{{ errors.startDate }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ngày kết thúc <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.endDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': errors.endDate }"
            />
            <p v-if="errors.endDate" class="text-red-500 text-sm mt-1">{{ errors.endDate }}</p>
          </div>
        </div>

        <!-- Financial Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tiền thuê hàng tháng <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.monthlyRent"
              type="number"
              min="0"
              step="1000"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': errors.monthlyRent }"
              placeholder="VND"
            />
            <p v-if="errors.monthlyRent" class="text-red-500 text-sm mt-1">{{ errors.monthlyRent }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tiền cọc <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.deposit"
              type="number"
              min="0"
              step="1000"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': errors.deposit }"
              placeholder="VND"
            />
            <p v-if="errors.deposit" class="text-red-500 text-sm mt-1">{{ errors.deposit }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <router-link
            to="/contracts"
            class="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </router-link>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isSubmitting ? 'Đang tạo...' : 'Tạo hợp đồng' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { Room, Tenant } from '@/types'

const router = useRouter()

// Mock data
const availableRooms = ref<Room[]>([
  {
    id: '1',
    name: 'Phòng 101',
    floor: 1,
    type: 'single',
    area: 25,
    price: 3000000,
    deposit: 6000000,
    status: 'available',
    amenities: ['Điều hòa', 'Tủ lạnh'],
    description: 'Phòng đơn thoáng mát',
    images: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Phòng 102',
    floor: 1,
    type: 'double',
    area: 35,
    price: 4500000,
    deposit: 9000000,
    status: 'available',
    amenities: ['Điều hòa', 'Tủ lạnh', 'Máy giặt'],
    description: 'Phòng đôi rộng rãi',
    images: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
])

const tenants = ref<Tenant[]>([
  {
    id: '1',
    name: 'Nguyễn Văn A',
    phone: '0123456789',
    email: 'nguyenvana@email.com',
    idCard: '123456789',
    address: 'Hà Nội',
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Trần Thị B',
    phone: '0987654321',
    email: 'tranthib@email.com',
    idCard: '987654321',
    address: 'TP.HCM',
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
])

// Form data
const form = reactive({
  roomId: '',
  tenantId: '',
  startDate: '',
  endDate: '',
  monthlyRent: 0,
  deposit: 0
})

const errors = reactive({
  roomId: '',
  tenantId: '',
  startDate: '',
  endDate: '',
  monthlyRent: '',
  deposit: ''
})

const isSubmitting = ref(false)

// Computed
const selectedRoom = computed(() => {
  return availableRooms.value.find(room => room.id === form.roomId)
})

// Methods
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const validateForm = (): boolean => {
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  if (!form.roomId) {
    errors.roomId = 'Vui lòng chọn phòng'
    isValid = false
  }

  if (!form.tenantId) {
    errors.tenantId = 'Vui lòng chọn khách thuê'
    isValid = false
  }

  if (!form.startDate) {
    errors.startDate = 'Vui lòng chọn ngày bắt đầu'
    isValid = false
  }

  if (!form.endDate) {
    errors.endDate = 'Vui lòng chọn ngày kết thúc'
    isValid = false
  }

  if (form.startDate && form.endDate && new Date(form.startDate) >= new Date(form.endDate)) {
    errors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu'
    isValid = false
  }

  if (!form.monthlyRent || form.monthlyRent <= 0) {
    errors.monthlyRent = 'Vui lòng nhập tiền thuê hợp lệ'
    isValid = false
  }

  if (!form.deposit || form.deposit <= 0) {
    errors.deposit = 'Vui lòng nhập tiền cọc hợp lệ'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Creating contract:', form)
    
    // Redirect to contracts list
    router.push('/contracts')
  } catch (error) {
    console.error('Error creating contract:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Auto-fill rent and deposit when room is selected
const updateRoomDetails = () => {
  if (selectedRoom.value) {
    form.monthlyRent = selectedRoom.value.price
    form.deposit = selectedRoom.value.deposit
  }
}

// Watch for room selection changes
watch(() => form.roomId, updateRoomDetails)
</script>