<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Type
import type { Room } from '@/types'

// Constant
import { availableAmenities, roomTypes, statusOptions } from '@/constant'

// Store
import { useFloorStore } from '@/stores/floor'
import { useRoomStore } from '@/stores/rooms'

// Components
import InputTextBase from '@/components/base/input/InputTextBase.vue'
import InputSelectBase from '@/components/base/input/InputSelectBase.vue'
import InputNumberBase from '@/components/base/input/InputNumberBase.vue'
import InputTextareaBase from '@/components/base/input/InputTextareaBase.vue'
import ButtonBase from '@/components/base/button/ButtonBase.vue'
import AlertBase from '@/components/base/alert/AlertBase.vue'

import IconBack from '@/components/icons/IconBack.vue'
import IconSpin from '@/components/icons/IconSpin.vue'

const router = useRouter()

const floorStore = useFloorStore()
const roomStore = useRoomStore()

const loading = ref<boolean>(false)
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
  
  if (!formData.price || formData.price < 500000) {
    errors.value.price = 'Giá thuê phải lớn hơn 500.000 VND'
  }
  
  if (!formData.deposit || formData.deposit < 500000 || formData.deposit >= formData.price) {
    errors.value.deposit = 'Tiền cọc phải lớn hơn 500.000 VND và nhỏ hơn giá thuê'
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
    const newRoom: Omit<Room, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name.trim(),
      type: formData.type,
      area: Number(formData.area),
      price: Number(formData.price),
      deposit: Number(formData.deposit),
      idFloor: formData.floor,
      description: formData.description.trim(),
      amenities: [...formData.amenities],
      status: formData.status,
      images: []
    }
    await roomStore.createRoom(newRoom)
    
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
        <ButtonBase
          color="outline"
          text="Quay lại"
          @click="goBack"
        >
          <IconBack />
        </ButtonBase>
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
                :rows="5"
                v-model="formData.description"
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
      <AlertBase
        v-if="errors.submit"
        :title="errors.submit"
        type="error"
      />
  
      <!-- Actions -->
      <div class="flex justify-end space-x-3">
        <ButtonBase
          text="Quay lại"
          color="outline"
          @click="goBack"
        />
        <ButtonBase 
          :text="loading ? 'Đang tạo...' : 'Tạo phòng'"
          :loading="loading"
          color="primary"
          type="submit"
        >
          <IconSpin v-if="loading" />
        </ButtonBase>
      </div>
    </form>
  </div>
</template>