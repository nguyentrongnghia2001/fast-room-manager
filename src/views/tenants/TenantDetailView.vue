<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Tenant, Contract, Room } from '@/types'

const route = useRoute()
const router = useRouter()

const tenantId = route.params.id as string
const isLoading = ref(true)
const tenant = ref<Tenant | null>(null)
const contracts = ref<Contract[]>([])
const rooms = ref<Room[]>([])

// Mock data
const mockTenants: Tenant[] = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    phone: '0901234567',
    email: 'nguyenvanan@email.com',
    idCard: '123456789012',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    emergencyContact: 'Nguyễn Thị Bình',
    emergencyPhone: '0987654321',
    notes: 'Khách thuê uy tín, thanh toán đúng hạn',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    status: 'active',
  },
  {
    id: '2',
    name: 'Trần Thị Bình',
    phone: '0912345678',
    email: 'tranthibinh@email.com',
    idCard: '987654321098',
    address: '456 Đường XYZ, Quận 2, TP.HCM',
    emergencyContact: 'Trần Văn Cường',
    emergencyPhone: '0976543210',
    notes: '',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01',
    status: 'active',
  },
]

const mockContracts: Contract[] = [
  {
    id: '1',
    roomId: '1',
    tenantId: '1',
    startDate: '2024-01-15',
    endDate: '2024-07-15',
    monthlyRent: 5000000,
    deposit: 10000000,
    status: 'active',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
]

const mockRooms: Room[] = [
  {
    id: '1',
    name: 'Phòng 101',
    floor: 1,
    type: 'single',
    area: 25,
    price: 5000000,
    deposit: 10000000,
    status: 'occupied',
    amenities: ['wifi', 'ac', 'kitchen'],
    description: 'Phòng đơn thoáng mát',
    images: ['/room1.jpg'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('vi-VN')
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    active: 'Đang thuê',
    inactive: 'Không hoạt động',
    terminated: 'Đã chấm dứt',
  }
  return statusMap[status] || status
}

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    terminated: 'bg-red-100 text-red-800',
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}

const activeContracts = computed(() => {
  return contracts.value.filter((contract) => contract.status === 'active')
})

const loadTenantData = async () => {
  isLoading.value = true

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    tenant.value = mockTenants.find((t) => t.id === tenantId) || null
    contracts.value = mockContracts.filter((c) => c.tenantId === tenantId)

    // Load room data for contracts
    const roomIds = contracts.value.map((c) => c.roomId)
    rooms.value = mockRooms.filter((r) => roomIds.includes(r.id))
  } catch (error) {
    console.error('Error loading tenant data:', error)
  } finally {
    isLoading.value = false
  }
}

const getRoomName = (roomId: string) => {
  const room = rooms.value.find((r) => r.id === roomId)
  return room ? room.name : 'N/A'
}

const goBack = () => {
  router.push('/tenants')
}

onMounted(() => {
  loadTenantData()
})
</script>

<template>
  <div>
    <div class="mb-8">
      <div class="flex items-center space-x-4">
        <button
          @click="goBack"
          class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg
            class="-ml-1 mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Quay lại
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Chi tiết khách thuê</h1>
          <p class="mt-1 text-sm text-gray-500">ID: {{ tenantId }}</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white rounded-lg shadow p-6">
      <div class="animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>

    <!-- Tenant Not Found -->
    <div v-else-if="!tenant" class="bg-white rounded-lg shadow p-6 text-center">
      <svg
        class="mx-auto h-12 w-12 text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Không tìm thấy khách thuê</h3>
      <p class="text-gray-500">Khách thuê với ID {{ tenantId }} không tồn tại.</p>
    </div>

    <!-- Tenant Details -->
    <div v-else class="space-y-6">
      <!-- Basic Information -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900">Thông tin cơ bản</h2>
          <div class="flex space-x-2">
            <span
              :class="getStatusColor(tenant.status)"
              class="px-2 py-1 text-xs font-medium rounded-full"
            >
              {{ getStatusText(tenant.status) }}
            </span>
            <button
              @click="$router.push(`/tenants/${tenant.id}/edit`)"
              class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Chỉnh sửa
            </button>
          </div>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Họ và tên</label>
              <p class="text-gray-900">{{ tenant.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Số điện thoại</label>
              <p class="text-gray-900">{{ tenant.phone }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <p class="text-gray-900">{{ tenant.email || 'Chưa cập nhật' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Số CMND/CCCD</label>
              <p class="text-gray-900">{{ tenant.idCard }}</p>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-500 mb-1">Địa chỉ thường trú</label>
              <p class="text-gray-900">{{ tenant.address }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1"
                >Người liên hệ khẩn cấp</label
              >
              <p class="text-gray-900">{{ tenant.emergencyContact || 'Chưa cập nhật' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">SĐT khẩn cấp</label>
              <p class="text-gray-900">{{ tenant.emergencyPhone || 'Chưa cập nhật' }}</p>
            </div>
            <div class="md:col-span-2" v-if="tenant.notes">
              <label class="block text-sm font-medium text-gray-500 mb-1">Ghi chú</label>
              <p class="text-gray-900">{{ tenant.notes }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Ngày tạo</label>
              <p class="text-gray-900">{{ formatDate(tenant.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Contracts -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900">Hợp đồng hiện tại</h2>
          <button
            @click="$router.push(`/contracts/create?tenantId=${tenant.id}`)"
            class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          >
            Tạo hợp đồng mới
          </button>
        </div>
        <div class="p-6">
          <div v-if="activeContracts.length === 0" class="text-center py-8">
            <svg
              class="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p class="text-gray-500">Khách thuê chưa có hợp đồng nào đang hoạt động</p>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="contract in activeContracts"
              :key="contract.id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="font-medium text-gray-900">{{ getRoomName(contract.roomId) }}</h3>
                  <p class="text-sm text-gray-500">Hợp đồng #{{ contract.id }}</p>
                </div>
                <span
                  class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                >
                  Đang hoạt động
                </span>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <label class="block text-gray-500 mb-1">Ngày bắt đầu</label>
                  <p class="text-gray-900">{{ formatDate(contract.startDate) }}</p>
                </div>
                <div>
                  <label class="block text-gray-500 mb-1">Ngày kết thúc</label>
                  <p class="text-gray-900">{{ formatDate(contract.endDate) }}</p>
                </div>
                <div>
                  <label class="block text-gray-500 mb-1">Tiền thuê/tháng</label>
                  <p class="text-gray-900">{{ formatCurrency(contract.monthlyRent) }}</p>
                </div>
                <div>
                  <label class="block text-gray-500 mb-1">Tiền cọc</label>
                  <p class="text-gray-900">{{ formatCurrency(contract.deposit) }}</p>
                </div>
              </div>
              <div class="mt-3 flex space-x-2">
                <button
                  @click="$router.push(`/contracts/${contract.id}`)"
                  class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Xem chi tiết
                </button>
                <button
                  @click="$router.push(`/rooms/${contract.roomId}`)"
                  class="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Xem phòng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Thao tác nhanh</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              @click="$router.push(`/contracts?tenantId=${tenant.id}`)"
              class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div class="flex items-center">
                <svg
                  class="w-6 h-6 text-blue-600 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div>
                  <p class="font-medium text-gray-900">Xem tất cả hợp đồng</p>
                  <p class="text-sm text-gray-500">Lịch sử hợp đồng của khách thuê</p>
                </div>
              </div>
            </button>

            <button
              @click="$router.push(`/payments?tenantId=${tenant.id}`)"
              class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div class="flex items-center">
                <svg
                  class="w-6 h-6 text-green-600 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
                <div>
                  <p class="font-medium text-gray-900">Lịch sử thanh toán</p>
                  <p class="text-sm text-gray-500">Xem các khoản thanh toán</p>
                </div>
              </div>
            </button>

            <button
              @click="$router.push(`/tenants/${tenant.id}/edit`)"
              class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div class="flex items-center">
                <svg
                  class="w-6 h-6 text-orange-600 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <div>
                  <p class="font-medium text-gray-900">Chỉnh sửa thông tin</p>
                  <p class="text-sm text-gray-500">Cập nhật thông tin khách thuê</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
