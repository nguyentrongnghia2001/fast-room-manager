<script setup lang="ts">
import type { Room } from '@/types'

interface Props {
  room: Room
}

defineProps<Props>()

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const getStatusColor = (status: Room['status']) => {
  switch (status) {
    case 'available':
      return 'text-success-600 bg-success-50 border-success-200'
    case 'occupied':
      return 'text-primary-600 bg-primary-50 border-primary-200'
    case 'maintenance':
      return 'text-warning-600 bg-warning-50 border-warning-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

const getStatusText = (status: Room['status']) => {
  switch (status) {
    case 'available':
      return 'Trống'
    case 'occupied':
      return 'Đã thuê'
    case 'maintenance':
      return 'Bảo trì'
    default:
      return status
  }
}

const getRoomTypeText = (type: Room['type']) => {
  switch (type) {
    case 'single':
      return 'Phòng đơn'
    case 'double':
      return 'Phòng đôi'
    case 'family':
      return 'Phòng gia đình'
    default:
      return type
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
    <!-- Room Image -->
    <div class="h-48 bg-gray-200 relative">
      <img
        v-if="room.images.length > 0"
        :src="room.images[0]"
        :alt="room.name"
        class="w-full h-full object-cover"
      >
      <div v-else class="w-full h-full flex items-center justify-center">
        <svg class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      
      <!-- Status Badge -->
      <div class="absolute top-3 right-3">
        <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', getStatusColor(room.status)]">
          {{ getStatusText(room.status) }}
        </span>
      </div>
      
      <!-- Floor Badge -->
      <div class="absolute top-3 left-3">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-white">
          Tầng {{ room.floor }}
        </span>
      </div>
    </div>

    <!-- Room Info -->
    <div class="p-6">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-semibold text-gray-900">{{ room.name }}</h3>
        <span class="text-sm text-gray-500">{{ getRoomTypeText(room.type) }}</span>
      </div>
      
      <div class="flex items-center text-sm text-gray-600 mb-3">
        <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l5.875-2.437c.381-.159.622-.52.622-.93V9.187c0-.853-.697-1.55-1.55-1.55H9.25c-.853 0-1.55.697-1.55 1.55v9.637c0 .41.24.771.622.93l5.875 2.437zM9 6.75V15m6-6v8.25" />
        </svg>
        {{ room.area }}m²
      </div>

      <div class="mb-4">
        <div class="text-2xl font-bold text-gray-900 mb-1">
          {{ formatCurrency(room.price) }}
          <span class="text-sm font-normal text-gray-500">/tháng</span>
        </div>
        <div class="text-sm text-gray-600">
          Đặt cọc: {{ formatCurrency(room.deposit) }}
        </div>
      </div>

      <!-- Amenities -->
      <div v-if="room.amenities.length > 0" class="mb-4">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Tiện nghi:</h4>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="amenity in room.amenities.slice(0, 3)"
            :key="amenity"
            class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
          >
            {{ amenity }}
          </span>
          <span
            v-if="room.amenities.length > 3"
            class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
          >
            +{{ room.amenities.length - 3 }} khác
          </span>
        </div>
      </div>

      <!-- Description -->
      <p v-if="room.description" class="text-sm text-gray-600 mb-4 line-clamp-2">
        {{ room.description }}
      </p>

      <!-- Actions -->
      <div class="flex space-x-2">
        <RouterLink
          :to="`/rooms/detail/${room?._id}`"
          class="flex-1 bg-primary-600 text-white text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
        >
          Xem chi tiết
        </RouterLink>
        <RouterLink
          :to="`/rooms/${room?._id}/edit`"
          class="flex-1 bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
        >
          Chỉnh sửa
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>