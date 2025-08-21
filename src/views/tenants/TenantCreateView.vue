<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { Tenant } from '@/types'

const router = useRouter()

const isLoading = ref(false)
const errors = ref<Record<string, string>>({})

const formData = reactive({
  name: '',
  phone: '',
  email: '',
  idCard: '',
  address: '',
  emergencyContact: '',
  emergencyPhone: '',
  notes: ''
})

const validateForm = () => {
  errors.value = {}
  
  if (!formData.name.trim()) {
    errors.value.name = 'Tên khách thuê là bắt buộc'
  }
  
  if (!formData.phone.trim()) {
    errors.value.phone = 'Số điện thoại là bắt buộc'
  } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
    errors.value.phone = 'Số điện thoại không hợp lệ'
  }
  
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.value.email = 'Email không hợp lệ'
  }
  
  if (!formData.idCard.trim()) {
    errors.value.idCard = 'Số CMND/CCCD là bắt buộc'
  }
  
  if (!formData.address.trim()) {
    errors.value.address = 'Địa chỉ là bắt buộc'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In real app, this would be an API call
    console.log('Creating tenant:', formData)
    
    router.push('/tenants')
  } catch (error) {
    console.error('Error creating tenant:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <button 
        @click="$router.push('/tenants')"
        class="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Quay lại danh sách khách thuê
      </button>
      <h1 class="text-2xl font-bold text-gray-900">Thêm khách thuê mới</h1>
    </div>
    
    <div class="bg-white rounded-lg shadow">
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Thông tin cơ bản -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên *
            </label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.name }"
              placeholder="Nhập họ và tên"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>
          
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại *
            </label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.phone }"
              placeholder="Nhập số điện thoại"
            />
            <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.email }"
              placeholder="Nhập email"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>
          
          <div>
            <label for="idCard" class="block text-sm font-medium text-gray-700 mb-2">
              Số CMND/CCCD *
            </label>
            <input
              id="idCard"
              v-model="formData.idCard"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.idCard }"
              placeholder="Nhập số CMND/CCCD"
            />
            <p v-if="errors.idCard" class="mt-1 text-sm text-red-600">{{ errors.idCard }}</p>
          </div>
        </div>
        
        <!-- Địa chỉ -->
        <div>
          <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
            Địa chỉ thường trú *
          </label>
          <textarea
            id="address"
            v-model="formData.address"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.address }"
            placeholder="Nhập địa chỉ thường trú"
          ></textarea>
          <p v-if="errors.address" class="mt-1 text-sm text-red-600">{{ errors.address }}</p>
        </div>
        
        <!-- Liên hệ khẩn cấp -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="emergencyContact" class="block text-sm font-medium text-gray-700 mb-2">
              Người liên hệ khẩn cấp
            </label>
            <input
              id="emergencyContact"
              v-model="formData.emergencyContact"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tên người liên hệ"
            />
          </div>
          
          <div>
            <label for="emergencyPhone" class="block text-sm font-medium text-gray-700 mb-2">
              SĐT người liên hệ khẩn cấp
            </label>
            <input
              id="emergencyPhone"
              v-model="formData.emergencyPhone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Số điện thoại"
            />
          </div>
        </div>
        
        <!-- Ghi chú -->
        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú
          </label>
          <textarea
            id="notes"
            v-model="formData.notes"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ghi chú thêm về khách thuê"
          ></textarea>
        </div>
        
        <!-- Actions -->
        <div class="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            @click="$router.push('/tenants')"
            class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Hủy
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Đang lưu...</span>
            <span v-else>Lưu khách thuê</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>