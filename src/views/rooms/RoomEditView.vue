<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Room } from '@/types'
import { useRoomStore } from '@/stores/rooms'

const roomStore = useRoomStore()
const route = useRoute()
const router = useRouter()

const roomId = route.params.id as string
const loading = ref(true)
const saving = ref(false)
const errors = ref<Record<string, string>>({})

const formData = reactive({
  name: '',
  type: 'single' as Room['type'],
  area: null as number | null,
  price: null as number | null,
  deposit: null as number | null,
  floor: null as number | null,
  description: '',
  amenities: [] as string[],
  status: 'available' as Room['status']
})

// Mock data - trong thực tế sẽ fetch từ API
const mockRooms: Room[] = [
  {
    id: '1',
    name: 'Phòng 101',
    type: 'single',
    area: 25,
    price: 2500000,
    deposit: 5000000,
    status: 'available',
    description: 'Phòng đơn thoáng mát, đầy đủ tiện nghi, gần trường đại học',
    amenities: ['Điều hòa', 'Tủ lạnh', 'Giường', 'Bàn học', 'Tủ quần áo'],
    images: [],
    floor: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Phòng 102',
    type: 'double',
    area: 35,
    price: 3500000,
    deposit: 7000000,
    status: 'occupied',
    description: 'Phòng đôi rộng rãi, phù hợp cho 2 người ở',
    amenities: ['Điều hòa', 'Tủ lạnh', 'Giường đôi', 'Bàn học', 'Tủ quần áo', 'Ban công'],
    images: [],
    floor: 1,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20')
  }
]

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
  { value: 'occupied', label: 'Đã thuê' },
  { value: 'maintenance', label: 'Bảo trì' }
]

const floorOptions = Array.from({ length: 10 }, (_, i) => ({
  value: i + 1,
  label: `Tầng ${i + 1}`
}))

const loadRoomData = async () => {
  loading.value = true
  try {
    const res = await roomStore.getDetailRoom(roomId)
    setRoomData(res)
  } catch (error) {
    console.error('Error loading room data:', error)
  } finally {
    loading.value = false
  }
}

const setRoomData  = (room?: Room) => {
  formData.name = room?.name || ''
  formData.type = room?.type || 'single'
  formData.area = room?.area || null
  formData.price = room?.price || null
  formData.deposit = room?.deposit || null
  formData.floor = room?.floor || null
  formData.description = room?.description || ''
  formData.amenities = [...room?.amenities || []]
  formData.status = room?.status || 'available'
}

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
  
  if (!formData.floor || formData.floor <= 0) {
    errors.value.floor = 'Tầng phải lớn hơn 0'
  }
  
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
  formData.price = parseInt(value) || null
}

const handleDepositInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, '')
  formData.deposit = parseInt(value) || null
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }
  
  saving.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const updatedRoom: Partial<Room> = {
      name: formData.name.trim(),
      type: formData.type,
      area: formData.area!,
      price: formData.price!,
      deposit: formData.deposit!,
      floor: formData.floor!,
      description: formData.description.trim(),
      amenities: [...formData.amenities],
      status: formData.status
    }
    
    console.log('Updating room:', updatedRoom)
    
    // Redirect to room detail
    router.push(`/rooms/detail/${roomId}`)
  } catch (error) {
    console.error('Error updating room:', error)
    errors.value.submit = 'Có lỗi xảy ra khi cập nhật phòng. Vui lòng thử lại.'
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  router.push(`/rooms/detail/${roomId}`)
}

const deleteRoom = async () => {
  if (!confirm('Bạn có chắc chắn muốn xóa phòng này? Hành động này không thể hoàn tác.')) {
    return
  }
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    console.log('Deleting room:', roomId)
    
    // Redirect to room list
    router.push('/rooms')
  } catch (error) {
    console.error('Error deleting room:', error)
    errors.value.submit = 'Có lỗi xảy ra khi xóa phòng. Vui lòng thử lại.'
  }
}

onMounted(() => {
  loadRoomData()
})
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Edit Form -->
    <div v-else>
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
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
              <h1 class="text-2xl font-bold text-gray-900">Chỉnh sửa phòng</h1>
              <p class="mt-1 text-sm text-gray-500">Cập nhật thông tin phòng trọ</p>
            </div>
          </div>
          <button
            @click="deleteRoom"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg class="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Xóa phòng
          </button>
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
                <label for="name" class="block text-sm font-medium text-gray-700">Tên phòng *</label>
                <input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  placeholder="VD: Phòng 101"
                  :class="[
                    'mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm',
                    errors.name ? 'border-red-300' : ''
                  ]"
                >
                <p v-if="errors.name" class="mt-2 text-sm text-red-600">{{ errors.name }}</p>
              </div>

              <!-- Room Type -->
              <div>
                <label for="type" class="block text-sm font-medium text-gray-700">Loại phòng *</label>
                <select
                  id="type"
                  v-model="formData.type"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option v-for="type in roomTypes" :key="type.value" :value="type.value">
                    {{ type.label }}
                  </option>
                </select>
              </div>

              <!-- Floor -->
              <div>
                <label for="floor" class="block text-sm font-medium text-gray-700">Tầng *</label>
                <select
                  id="floor"
                  v-model="formData.floor"
                  :class="[
                    'mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm',
                    errors.floor ? 'border-red-300' : ''
                  ]"
                >
                  <option value="">Chọn tầng</option>
                  <option v-for="floor in floorOptions" :key="floor.value" :value="floor.value">
                    {{ floor.label }}
                  </option>
                </select>
                <p v-if="errors.floor" class="mt-2 text-sm text-red-600">{{ errors.floor }}</p>
              </div>

              <!-- Area -->
              <div>
                <label for="area" class="block text-sm font-medium text-gray-700">Diện tích (m²) *</label>
                <input
                  id="area"
                  v-model.number="formData.area"
                  type="number"
                  min="1"
                  step="0.1"
                  placeholder="VD: 25"
                  :class="[
                    'mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm',
                    errors.area ? 'border-red-300' : ''
                  ]"
                >
                <p v-if="errors.area" class="mt-2 text-sm text-red-600">{{ errors.area }}</p>
              </div>

              <!-- Status -->
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700">Trạng thái</label>
                <select
                  id="status"
                  v-model="formData.status"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                    {{ status.label }}
                  </option>
                </select>
              </div>

              <!-- Price -->
              <div>
                <label for="price" class="block text-sm font-medium text-gray-700">Giá thuê (VND/tháng) *</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="price"
                    :value="formData.price ? formatCurrency(formData.price.toString()) : ''"
                    @input="handlePriceInput"
                    type="text"
                    placeholder="VD: 2,500,000"
                    :class="[
                      'block w-full pr-12 border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm',
                      errors.price ? 'border-red-300' : ''
                    ]"
                  >
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">VND</span>
                  </div>
                </div>
                <p v-if="errors.price" class="mt-2 text-sm text-red-600">{{ errors.price }}</p>
              </div>

              <!-- Deposit -->
              <div>
                <label for="deposit" class="block text-sm font-medium text-gray-700">Tiền cọc (VND) *</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="deposit"
                    :value="formData.deposit ? formatCurrency(formData.deposit.toString()) : ''"
                    @input="handleDepositInput"
                    type="text"
                    placeholder="VD: 5,000,000"
                    :class="[
                      'block w-full pr-12 border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm',
                      errors.deposit ? 'border-red-300' : ''
                    ]"
                  >
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">VND</span>
                  </div>
                </div>
                <p v-if="errors.deposit" class="mt-2 text-sm text-red-600">{{ errors.deposit }}</p>
              </div>

              <!-- Description -->
              <div class="sm:col-span-2">
                <label for="description" class="block text-sm font-medium text-gray-700">Mô tả *</label>
                <textarea
                  id="description"
                  v-model="formData.description"
                  rows="3"
                  placeholder="Mô tả chi tiết về phòng trọ..."
                  :class="[
                    'mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm',
                    errors.description ? 'border-red-300' : ''
                  ]"
                ></textarea>
                <p v-if="errors.description" class="mt-2 text-sm text-red-600">{{ errors.description }}</p>
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
            :disabled="saving"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="saving" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ saving ? 'Đang lưu...' : 'Lưu thay đổi' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>