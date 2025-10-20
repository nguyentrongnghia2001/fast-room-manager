<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Type
import type { Room } from '@/types'

// Store
import { useFloorStore } from '@/stores/floor'

// Components
import InputTextBase from '@/components/base/input/InputTextBase.vue'
import InputSelectBase from '@/components/base/input/InputSelectBase.vue'
import InputNumberBase from '@/components/base/input/InputNumberBase.vue'
import InputTextareaBase from '@/components/base/input/InputTextareaBase.vue'

const router = useRouter()

const floorStore = useFloorStore()

const loading = ref(false)
const errors = ref<Record<string, string>>({})

const formData = reactive({
  name: '',
  type: 'single' as Room['type'],
  area: 0 as number,
  price: 0 as number,
  deposit: 0 as number,
  floor: '' as string,
  description: '',
  amenities: [] as string[],
  status: 'available' as Room['status']
})

const availableAmenities = [
  'Điều hòa',
  'Tủ lạnh',
  'Giường',
  'Bàn học',
  'Tủ quần áo',
  'Ban công',
  'WiFi miễn phí',
  'Máy nước nóng',
  'Máy giặt',
  'Bếp gas',
  'Tủ bếp',
  'Sofa',
  'Bàn ăn',
  'TV',
  'Thang máy',
  'Bãi đỗ xe'
]

const roomTypes = [
  { value: 'single', label: 'Phòng đơn' },
  { value: 'double', label: 'Phòng đôi' },
  { value: 'family', label: 'Phòng gia đình' }
]

const statusOptions = [
  { value: 'available', label: 'Trống' },
  { value: 'maintenance', label: 'Bảo trì' }
]

const getFloorOptions = async () => {
  try {
    await floorStore.getListFloors()
  } catch (error) {
    console.error('Error fetching floors:', error)
  }
}

const floorOptions = computed(() => {
  return floorStore.listFloors.map((floor) => ({
    value: floor?._id || '',
    label: floor?.name || ''
  })) || []
})

const validateForm = (): boolean => {
  errors.value = {}
  
  if (!formData.name.trim()) {
    errors.value.name = 'Tên phòng là bắt buộc'
  }
  
  if (!formData.area || formData.area <= 0) {
    errors.value.area = 'Diện tích phải lớn hơn 0'
  }
  
  if (!formData.price || formData.price <= 0) {
    errors.value.price = 'Giá thuê phải lớn hơn 0'
  }
  
  if (!formData.deposit || formData.deposit <= 0) {
    errors.value.deposit = 'Tiền cọc phải lớn hơn 0'
  }
  
  // if (!formData.floor) {
  //   errors.value.floor = 'Tầng không được để trống'
  // }
  
  if (!formData.description.trim()) {
    errors.value.description = 'Mô tả là bắt buộc'
  }
  
  return Object.keys(errors.value).length === 0
}

const toggleAmenity = (amenity: string) => {
  const index = formData.amenities.indexOf(amenity)
  if (index > -1) {
    formData.amenities.splice(index, 1)
  } else {
    formData.amenities.push(amenity)
  }
}

const formatCurrency = (value: string): string => {
  const number = value.replace(/\D/g, '')
  return new Intl.NumberFormat('vi-VN').format(parseInt(number) || 0)
}

const handlePriceInput = (event: Event) => {  
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, '')
  formData.price = parseInt(value)  
}

const handleDepositInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, '')
  formData.deposit = parseInt(value)
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newRoom: Omit<Room, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name.trim(),
      type: formData.type,
      area: formData.area!,
      price: formData.price!,
      deposit: formData.deposit!,
      floor: formData.floor!,
      description: formData.description.trim(),
      amenities: [...formData.amenities],
      status: formData.status,
      images: []
    }
    
    console.log('Creating room:', newRoom)
    
    // Redirect to room list
    router.push('/rooms')
  } catch (error) {
    console.error('Error creating room:', error)
    errors.value.submit = 'Có lỗi xảy ra khi tạo phòng. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/rooms')
}

onMounted(() => {
  getFloorOptions()
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center space-x-4">
        <button
          @click="goBack"
          class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg class="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Quay lại
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Thêm phòng mới</h1>
          <p class="mt-1 text-sm text-gray-500">Tạo thông tin phòng trọ mới trong hệ thống</p>
        </div>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="submitForm" class="space-y-8">
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">Thông tin cơ bản</h3>
          
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <!-- Room Name -->
            <div class="sm:col-span-2">
              <InputTextBase
                label="Tên phòng"
                name="name"
                v-model="formData.name"
                type="text"
                placeholder="VD: Phòng 101"
                :errors="errors.name"
              />
            </div>

            <!-- Room Type -->
            <div>
              <InputSelectBase
                label="Loại phòng"
                name="type"
                v-model="formData.type"
                :options="roomTypes"
                :errors="errors.type"
              />
            </div>

            <!-- Floor -->
            <div>
              <InputSelectBase
                label="Tầng"
                name="floor"
                v-model="formData.floor"
                :options="floorOptions"
                :errors="errors.floor"
              />
            </div>

            <!-- Area -->
            <div>
              <InputTextBase
                label="Diện tích (m2)"
                name="area"
                v-model="formData.area"
                type="text"
                placeholder="VD: 25"
                :errors="errors.area"
              />
            </div>

            <!-- Status -->
            <div>
              <InputSelectBase
                label="Trạng thái"
                name="status"
                v-model="formData.status"
                :options="statusOptions"
                :errors="errors.status"
              />
            </div>

            <!-- Price -->
            <div>
              <InputNumberBase
                label="Giá thuê (VND/tháng)"
                name="price"
                :model-value="formData.price ? formatCurrency(formData.price.toString()) : ''"
                placeholder="VD: 2,500,000"
                suffix="VND"
                :errors="errors.price"
                @change="handlePriceInput"
              />
            </div>

            <!-- Deposit -->
            <div>
              <InputNumberBase
                label="Tiền cọc (VND)"
                name="deposit"
                :model-value="formData.deposit ? formatCurrency(formData.deposit.toString()) : ''"
                type="number"
                placeholder="VD: 5,000,000"
                suffix="VND"
                :errors="errors.deposit"
                @change="handleDepositInput"
              />
            </div>

            <!-- Description -->
            <div class="sm:col-span-2">
              <InputTextareaBase
                label="Mô tả"
                name="description"
                v-model="formData.description"
                type="text"
                placeholder="Mô tả chi tiết về phòng trọ..."
                :errors="errors.description"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Amenities -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">Tiện nghi</h3>
          <p class="text-sm text-gray-500 mb-4">Chọn các tiện nghi có sẵn trong phòng</p>
          
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <div v-for="amenity in availableAmenities" :key="amenity" class="relative flex items-start">
              <div class="flex items-center h-5">
                <input
                  :id="`amenity-${amenity}`"
                  :checked="formData.amenities.includes(amenity)"
                  @change="toggleAmenity(amenity)"
                  type="checkbox"
                  class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                >
              </div>
              <div class="ml-3 text-sm">
                <label :for="`amenity-${amenity}`" class="font-medium text-gray-700 cursor-pointer">
                  {{ amenity }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Error -->
      <div v-if="errors.submit" class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-800">{{ errors.submit }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="goBack"
          class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Hủy
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Đang tạo...' : 'Tạo phòng' }}
        </button>
      </div>
    </form>
  </div>
</template>