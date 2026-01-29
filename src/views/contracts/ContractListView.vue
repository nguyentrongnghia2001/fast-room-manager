<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quản lý hợp đồng</h1>
        <p class="text-gray-600 mt-1">Quản lý tất cả hợp đồng thuê phòng</p>
      </div>
      <router-link
        to="/contracts/create"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Tạo hợp đồng mới
      </router-link>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Tổng hợp đồng</p>
            <p class="text-2xl font-bold text-gray-900">{{ contractStats.total }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Đang hiệu lực</p>
            <p class="text-2xl font-bold text-gray-900">{{ contractStats.active }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Sắp hết hạn</p>
            <p class="text-2xl font-bold text-gray-900">{{ contractStats.expiring }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Đã hết hạn</p>
            <p class="text-2xl font-bold text-gray-900">{{ contractStats.expired }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm theo tên phòng, khách thuê..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
          <select
            v-model="statusFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hiệu lực</option>
            <option value="expired">Đã hết hạn</option>
            <option value="terminated">Đã chấm dứt</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Sắp xếp</label>
          <select
            v-model="sortBy"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="createdAt">Ngày tạo</option>
            <option value="startDate">Ngày bắt đầu</option>
            <option value="endDate">Ngày kết thúc</option>
            <option value="monthlyRent">Tiền thuê</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="w-full px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Đặt lại
          </button>
        </div>
      </div>
    </div>

    <!-- Contracts Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hợp đồng
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phòng
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách thuê
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tiền thuê
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="isLoading">
              <td colspan="7" class="px-6 py-12 text-center">
                <div class="flex justify-center items-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span class="ml-2 text-gray-600">Đang tải...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredContracts.length === 0">
              <td colspan="7" class="px-6 py-12 text-center">
                <div class="text-gray-400 text-6xl mb-4">📄</div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Không có hợp đồng nào</h3>
                <p class="text-gray-600">{{ searchQuery ? 'Không tìm thấy hợp đồng phù hợp với từ khóa tìm kiếm.' : 'Chưa có hợp đồng nào được tạo.' }}</p>
              </td>
            </tr>
            <tr v-else v-for="contract in filteredContracts" :key="contract.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">#{{ contract.id }}</div>
                  <div class="text-sm text-gray-500">{{ formatDate(contract.createdAt) }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ getRoomName(contract.roomId) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ getTenantName(contract.tenantId) }}</div>
                  <div class="text-sm text-gray-500">{{ getTenantPhone(contract.tenantId) }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm text-gray-900">{{ formatDate(contract.startDate) }}</div>
                  <div class="text-sm text-gray-500">đến {{ formatDate(contract.endDate) }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ formatCurrency(contract.monthlyRent) }}</div>
                <div class="text-sm text-gray-500">Cọc: {{ formatCurrency(contract.deposit) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusColor(contract.status)"
                >
                  {{ getStatusText(contract.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <router-link
                    :to="`/contracts/detail/${contract.id}`"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    Xem
                  </router-link>
                  <button class="text-green-600 hover:text-green-900">
                    Thanh toán
                  </button>
                  <button class="text-gray-600 hover:text-gray-900">
                    Sửa
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Contract, Room, Tenant } from '@/types'
import { useContractStore } from '@/stores/contract'
import { useRoomStore } from '@/stores/rooms'
import { useTenantStore } from '@/stores/tenant'

const contractStore = useContractStore()
const roomStore = useRoomStore()
const tenantStore = useTenantStore()

// Reactive data
const isLoading = ref(true)
const contracts = ref<Contract[]>([])
const rooms = ref<Room[]>([])
const tenants = ref<Tenant[]>([])
const searchQuery = ref('')
const statusFilter = ref('')
const sortBy = ref('createdAt')

// Computed
const contractStats = computed(() => {
  const total = contracts.value.length
  const active = contracts.value.filter(c => c.status === 'active').length
  const expired = contracts.value.filter(c => c.status === 'expired').length
  const expiring = contracts.value.filter(c => {
    if (c.status !== 'active') return false
    const endDate = new Date(c.endDate)
    const now = new Date()
    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }).length
  
  return { total, active, expired, expiring }
})

const filteredContracts = computed(() => {
  let filtered = [...contracts.value]
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(contract => {
      const roomName = getRoomName(contract.roomId).toLowerCase()
      const tenantName = getTenantName(contract.tenantId).toLowerCase()
      return roomName.includes(query) || tenantName.includes(query) || contract.id.includes(query)
    })
  }
  
  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(contract => contract.status === statusFilter.value)
  }
  
  // Sort
  filtered.sort((a, b) => {
    const aValue = a[sortBy.value as keyof Contract]
    const bValue = b[sortBy.value as keyof Contract]
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return bValue.localeCompare(aValue)
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return bValue - aValue
    }
    return 0
  })
  
  return filtered
})

// Methods
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('vi-VN')
}

const getStatusColor = (status: string): string => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    expired: 'bg-red-100 text-red-800',
    terminated: 'bg-gray-100 text-gray-800'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status: string): string => {
  const texts = {
    active: 'Đang hiệu lực',
    expired: 'Đã hết hạn',
    terminated: 'Đã chấm dứt'
  }
  return texts[status as keyof typeof texts] || status
}

const getRoomName = (roomId: string): string => {
  const room = rooms.value.find(r => r.id === roomId)
  return room ? room.name : 'N/A'
}

const getTenantName = (tenantId: string): string => {
  const tenant = tenants.value.find(t => t.id === tenantId)
  return tenant ? tenant.name : 'N/A'
}

const getTenantPhone = (tenantId: string): string => {
  const tenant = tenants.value.find(t => t.id === tenantId)
  return tenant ? tenant.phone : 'N/A'
}

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  sortBy.value = 'createdAt'
}

const loadData = async () => {
  isLoading.value = true
  
  try {
    // Fetch data from API
    const [contractsData, roomsData, tenantsData] = await Promise.all([
      contractStore.getListContracts(),
      roomStore.getListRooms(),
      tenantStore.getListTenants()
    ])
    
    contracts.value = contractsData
    rooms.value = roomsData
    tenants.value = tenantsData
  } catch (error) {
    console.error('Error loading contracts:', error)
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadData()
})
</script>