<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Room, Tenant, Contract } from '@/types'

const route = useRoute()
const router = useRouter()

const roomId = route.params.id as string
const room = ref<Room | null>(null)
const currentTenant = ref<Tenant | null>(null)
const currentContract = ref<Contract | null>(null)
const loading = ref(true)

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
    description: 'Phòng đơn thoáng mát, đầy đủ tiện nghi, gần trường đại học. Phòng được trang bị đầy đủ nội thất cơ bản, có cửa sổ lớn đón ánh sáng tự nhiên.',
    amenities: ['Điều hòa', 'Tủ lạnh', 'Giường', 'Bàn học', 'Tủ quần áo', 'WiFi miễn phí', 'Máy nước nóng'],
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

const mockTenants: Tenant[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0123456789',
    idCard: '123456789012',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    emergencyContact: 'Nguyễn Thị B',
    emergencyPhone: '0987654321',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  }
]

const mockContracts: Contract[] = [
  {
    id: '1',
    roomId: '2',
    tenantId: '1',
    startDate: '2024-01-15',
    endDate: '2024-07-15',
    monthlyRent: 3500000,
    deposit: 7000000,
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  }
]

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const getStatusText = (status: Room['status']): string => {
  const statusMap = {
    available: 'Trống',
    occupied: 'Đã thuê',
    maintenance: 'Bảo trì'
  }
  return statusMap[status]
}

const getStatusColor = (status: Room['status']): string => {
  const colorMap = {
    available: 'bg-success-100 text-success-800',
    occupied: 'bg-primary-100 text-primary-800',
    maintenance: 'bg-warning-100 text-warning-800'
  }
  return colorMap[status]
}

const getRoomTypeText = (type: Room['type']): string => {
  const typeMap = {
    single: 'Phòng đơn',
    double: 'Phòng đôi',
    family: 'Phòng gia đình'
  }
  return typeMap[type]
}

const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

const loadRoomData = () => {
  loading.value = true
  
  // Simulate API call
  setTimeout(() => {
    const foundRoom = mockRooms.find(r => r.id === roomId)
    if (foundRoom) {
      room.value = foundRoom
      
      // Load tenant and contract if room is occupied
      if (foundRoom.status === 'occupied') {
        const contract = mockContracts.find(c => c.roomId === foundRoom.id)
        if (contract) {
          currentContract.value = contract
          const tenant = mockTenants.find(t => t.id === contract.tenantId)
          if (tenant) {
            currentTenant.value = tenant
          }
        }
      }
    }
    loading.value = false
  }, 500)
}

const goBack = () => {
  router.push('/rooms')
}

const editRoom = () => {
  router.push(`/rooms/${roomId}/edit`)
}

const createContract = () => {
  router.push(`/contracts/new?roomId=${roomId}`)
}

const viewContract = () => {
  if (currentContract.value) {
    router.push(`/contracts/${currentContract.value.id}`)
  }
}

const viewTenant = () => {
  if (currentTenant.value) {
    router.push(`/tenants/${currentTenant.value.id}`)
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

    <!-- Room Not Found -->
    <div v-else-if="!room" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Không tìm thấy phòng</h3>
      <p class="mt-1 text-sm text-gray-500">Phòng với ID này không tồn tại trong hệ thống.</p>
      <div class="mt-6">
        <button
          @click="goBack"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Quay lại danh sách
        </button>
      </div>
    </div>

    <!-- Room Details -->
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
              <h1 class="text-2xl font-bold text-gray-900">{{ room.name }}</h1>
              <p class="mt-1 text-sm text-gray-500">Chi tiết thông tin phòng trọ</p>
            </div>
          </div>
          <div class="flex space-x-3">
            <button
              @click="editRoom"
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg class="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Chỉnh sửa
            </button>
            <button
              v-if="room.status === 'available'"
              @click="createContract"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg class="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              Tạo hợp đồng
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Room Information -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Thông tin phòng</h3>
              
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Tên phòng</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ room.name }}</dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500">Trạng thái</dt>
                  <dd class="mt-1">
                    <span :class="getStatusColor(room.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {{ getStatusText(room.status) }}
                    </span>
                  </dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500">Loại phòng</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ getRoomTypeText(room.type) }}</dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500">Tầng</dt>
                  <dd class="mt-1 text-sm text-gray-900">Tầng {{ room.floor }}</dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500">Diện tích</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ room.area }} m²</dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500">Giá thuê</dt>
                  <dd class="mt-1 text-sm font-semibold text-gray-900">{{ formatCurrency(room.price) }}/tháng</dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500">Tiền cọc</dt>
                  <dd class="mt-1 text-sm font-semibold text-gray-900">{{ formatCurrency(room.deposit) }}</dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500">Ngày tạo</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ formatDate(room.createdAt) }}</dd>
                </div>
              </div>
              
              <div class="mt-6">
                <dt class="text-sm font-medium text-gray-500">Mô tả</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ room.description }}</dd>
              </div>
            </div>
          </div>

          <!-- Amenities -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Tiện nghi</h3>
              <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div v-for="amenity in room.amenities" :key="amenity" class="flex items-center">
                  <svg class="h-5 w-5 text-success-500 mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-sm text-gray-900">{{ amenity }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Current Tenant & Contract (if occupied) -->
          <div v-if="room.status === 'occupied' && currentTenant && currentContract" class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Thông tin thuê hiện tại</h3>
              
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Người thuê</dt>
                  <dd class="mt-1">
                    <button
                      @click="viewTenant"
                      class="text-sm text-primary-600 hover:text-primary-500 font-medium"
                    >
                      {{ currentTenant.name }}
                    </button>
                  </dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500">Số điện thoại</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ currentTenant.phone }}</dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500">Ngày bắt đầu</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ formatDate(currentContract.startDate) }}</dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500">Ngày kết thúc</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ formatDate(currentContract.endDate) }}</dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500">Giá thuê hợp đồng</dt>
                  <dd class="mt-1 text-sm font-semibold text-gray-900">{{ formatCurrency(currentContract.monthlyRent) }}/tháng</dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500">Hành động</dt>
                  <dd class="mt-1">
                    <button
                      @click="viewContract"
                      class="text-sm text-primary-600 hover:text-primary-500 font-medium"
                    >
                      Xem hợp đồng
                    </button>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Thao tác nhanh</h3>
              <div class="space-y-3">
                <button
                  @click="editRoom"
                  class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg class="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  Chỉnh sửa phòng
                </button>
                
                <button
                  v-if="room.status === 'available'"
                  @click="createContract"
                  class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg class="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  Tạo hợp đồng thuê
                </button>
                
                <button
                  v-if="currentContract"
                  @click="viewContract"
                  class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg class="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  Xem hợp đồng
                </button>
              </div>
            </div>
          </div>

          <!-- Room Statistics -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Thống kê</h3>
              <dl class="space-y-3">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Lần cập nhật cuối</dt>
                  <dd class="text-sm text-gray-900">{{ formatDate(room.updatedAt) }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Tỷ lệ giá/m²</dt>
                  <dd class="text-sm text-gray-900">{{ formatCurrency(Math.round(room.price / room.area)) }}/m²</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>