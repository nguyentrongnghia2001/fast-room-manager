<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import RoomCard from '@/components/rooms/RoomCard.vue'
import type { Room } from '@/types'

// Mock data - trong thực tế sẽ fetch từ API
const rooms = ref<Room[]>([
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
  },
  {
    id: '3',
    name: 'Phòng 201',
    type: 'single',
    area: 28,
    price: 2800000,
    deposit: 5600000,
    status: 'available',
    description: 'Phòng đơn view đẹp, tầng 2 thoáng mát',
    amenities: ['Điều hòa', 'Tủ lạnh', 'Giường', 'Bàn học'],
    images: [],
    floor: 2,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '4',
    name: 'Phòng 202',
    type: 'family',
    area: 45,
    price: 4500000,
    deposit: 9000000,
    status: 'maintenance',
    description: 'Phòng gia đình rộng rãi, phù hợp cho gia đình nhỏ',
    amenities: ['Điều hòa', 'Tủ lạnh', 'Giường đôi', 'Bàn ăn', 'Sofa', 'Ban công'],
    images: [],
    floor: 2,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: '5',
    name: 'Phòng 301',
    type: 'single',
    area: 30,
    price: 3000000,
    deposit: 6000000,
    status: 'occupied',
    description: 'Phòng đơn cao cấp, view thành phố',
    amenities: ['Điều hòa', 'Tủ lạnh', 'Giường', 'Bàn học', 'Tủ quần áo', 'Ban công'],
    images: [],
    floor: 3,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '6',
    name: 'Phòng 302',
    type: 'double',
    area: 38,
    price: 3800000,
    deposit: 7600000,
    status: 'available',
    description: 'Phòng đôi cao cấp với đầy đủ tiện nghi hiện đại',
    amenities: ['Điều hòa', 'Tủ lạnh', 'Giường đôi', 'Bàn học', 'Tủ quần áo', 'Ban công', 'Máy nước nóng'],
    images: [],
    floor: 3,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-16')
  }
])

const searchQuery = ref('')
const selectedStatus = ref<Room['status'] | 'all'>('all')
const selectedType = ref<Room['type'] | 'all'>('all')
const selectedFloor = ref<number | 'all'>('all')
const sortBy = ref<'name' | 'price' | 'area' | 'createdAt'>('name')
const sortOrder = ref<'asc' | 'desc'>('asc')

const statusOptions = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'available', label: 'Trống' },
  { value: 'occupied', label: 'Đã thuê' },
  { value: 'maintenance', label: 'Bảo trì' }
]

const typeOptions = [
  { value: 'all', label: 'Tất cả loại phòng' },
  { value: 'single', label: 'Phòng đơn' },
  { value: 'double', label: 'Phòng đôi' },
  { value: 'family', label: 'Phòng gia đình' }
]

const floorOptions = [
  { value: 'all', label: 'Tất cả tầng' },
  { value: 1, label: 'Tầng 1' },
  { value: 2, label: 'Tầng 2' },
  { value: 3, label: 'Tầng 3' }
]

const sortOptions = [
  { value: 'name', label: 'Tên phòng' },
  { value: 'price', label: 'Giá thuê' },
  { value: 'area', label: 'Diện tích' },
  { value: 'createdAt', label: 'Ngày tạo' }
]

const filteredAndSortedRooms = computed(() => {
  const filtered = rooms.value.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         room.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = selectedStatus.value === 'all' || room.status === selectedStatus.value
    const matchesType = selectedType.value === 'all' || room.type === selectedType.value
    const matchesFloor = selectedFloor.value === 'all' || room.floor === selectedFloor.value
    
    return matchesSearch && matchesStatus && matchesType && matchesFloor
  })

  // Sort
  const sorted = filtered.sort((a, b) => {
    let aValue: Room[keyof Room] = a[sortBy.value]
    let bValue: Room[keyof Room] = b[sortBy.value]
    
    if (sortBy.value === 'createdAt') {
      aValue = new Date(aValue).getTime()
      bValue = new Date(bValue).getTime()
    }
    
    if (sortOrder.value === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return sorted
})

const roomStats = computed(() => {
  const total = rooms.value.length
  const available = rooms.value.filter(r => r.status === 'available').length
  const occupied = rooms.value.filter(r => r.status === 'occupied').length
  const maintenance = rooms.value.filter(r => r.status === 'maintenance').length
  
  return { total, available, occupied, maintenance }
})

const clearFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = 'all'
  selectedType.value = 'all'
  selectedFloor.value = 'all'
  sortBy.value = 'name'
  sortOrder.value = 'asc'
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Quản lý phòng trọ</h1>
          <p class="mt-2 text-sm text-gray-700">
            Quản lý thông tin các phòng trọ trong hệ thống
          </p>
        </div>
        <RouterLink
          to="/rooms/new"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Thêm phòng mới
        </RouterLink>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Tổng số phòng</dt>
                <dd class="text-lg font-medium text-gray-900">{{ roomStats.total }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-success-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Phòng trống</dt>
                <dd class="text-lg font-medium text-gray-900">{{ roomStats.available }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Đã thuê</dt>
                <dd class="text-lg font-medium text-gray-900">{{ roomStats.occupied }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-warning-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Bảo trì</dt>
                <dd class="text-lg font-medium text-gray-900">{{ roomStats.maintenance }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white shadow rounded-lg mb-8">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Bộ lọc và tìm kiếm</h3>
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <!-- Search -->
          <div class="lg:col-span-2">
            <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <input
                id="search"
                v-model="searchQuery"
                type="text"
                placeholder="Tìm theo tên phòng, mô tả..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
            </div>
          </div>

          <!-- Status Filter -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select
              id="status"
              v-model="selectedStatus"
              class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Type Filter -->
          <div>
            <label for="type" class="block text-sm font-medium text-gray-700 mb-1">Loại phòng</label>
            <select
              id="type"
              v-model="selectedType"
              class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option v-for="option in typeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Floor Filter -->
          <div>
            <label for="floor" class="block text-sm font-medium text-gray-700 mb-1">Tầng</label>
            <select
              id="floor"
              v-model="selectedFloor"
              class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option v-for="option in floorOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Sort -->
          <div>
            <label for="sort" class="block text-sm font-medium text-gray-700 mb-1">Sắp xếp</label>
            <div class="flex space-x-2">
              <select
                id="sort"
                v-model="sortBy"
                class="flex-1 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <button
                @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
                class="px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              >
                <svg v-if="sortOrder === 'asc'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
                </svg>
                <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="mt-4 flex justify-between items-center">
          <p class="text-sm text-gray-700">
            Hiển thị {{ filteredAndSortedRooms.length }} trong tổng số {{ rooms.length }} phòng
          </p>
          <button
            @click="clearFilters"
            class="text-sm text-primary-600 hover:text-primary-500 font-medium"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>
    </div>

    <!-- Room Grid -->
    <div v-if="filteredAndSortedRooms.length > 0" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <RoomCard v-for="room in filteredAndSortedRooms" :key="room.id" :room="room" />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Không tìm thấy phòng nào</h3>
      <p class="mt-1 text-sm text-gray-500">Thử thay đổi bộ lọc hoặc thêm phòng mới.</p>
      <div class="mt-6">
        <RouterLink
          to="/rooms/new"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Thêm phòng mới
        </RouterLink>
      </div>
    </div>
  </div>
</template>