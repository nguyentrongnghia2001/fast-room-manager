<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Tenant } from '@/types'
import { useTenantStore } from '@/stores/tenant'

const router = useRouter()
const tenantStore = useTenantStore()

const isLoading = ref(true)
const tenants = ref<Tenant[]>([])
const searchQuery = ref('')
const statusFilter = ref('all')
const sortBy = ref('name')
const sortOrder = ref<'asc' | 'desc'>('asc')

const filteredAndSortedTenants = computed(() => {
  let filtered = tenants.value
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(tenant => 
      tenant.name.toLowerCase().includes(query) ||
      tenant.phone.includes(query) ||
      tenant.email?.toLowerCase().includes(query) ||
      tenant.idCard.includes(query)
    )
  }
  
  // Filter by status
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(tenant => tenant.status === statusFilter.value)
  }
  
  // Sort
  filtered.sort((a, b) => {
    let aValue: string | number
    let bValue: string | number
    
    switch (sortBy.value) {
      case 'name':
        aValue = a.name
        bValue = b.name
        break
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
        break
      case 'phone':
        aValue = a.phone
        bValue = b.phone
        break
      default:
        aValue = a.name
        bValue = b.name
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue)
      return sortOrder.value === 'asc' ? comparison : -comparison
    } else {
      const comparison = (aValue as number) - (bValue as number)
      return sortOrder.value === 'asc' ? comparison : -comparison
    }
  })
  
  return filtered
})

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('vi-VN')
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    active: 'Đang thuê',
    inactive: 'Không hoạt động',
    terminated: 'Đã chấm dứt'
  }
  return statusMap[status] || status
}

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    terminated: 'bg-red-100 text-red-800'
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}

const toggleSort = (field: string) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'asc'
  }
}

const loadTenants = async () => {
  isLoading.value = true
  try {
    const response = await tenantStore.getListTenants()
    tenants.value = response
  } catch (error) {
    console.error('Error loading tenants:', error)
  } finally {
    isLoading.value = false
  }
}

const tenantStats = computed(() => {
  const total = tenants.value.length
  const active = tenants.value.filter(t => t.status === 'active').length
  const inactive = tenants.value.filter(t => t.status === 'inactive').length
  const terminated = tenants.value.filter(t => t.status === 'terminated').length
  
  return { total, active, inactive, terminated }
})

onMounted(() => {
  loadTenants()
})
</script>

<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Quản lý khách thuê</h1>
      <button 
        @click="$router.push('/tenants/create')"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Thêm khách thuê mới
      </button>
    </div>
    
    <!-- Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Tổng khách thuê</p>
            <p class="text-2xl font-semibold text-gray-900">{{ tenantStats.total }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Đang thuê</p>
            <p class="text-2xl font-semibold text-gray-900">{{ tenantStats.active }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-gray-100 rounded-lg">
            <svg class="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Không hoạt động</p>
            <p class="text-2xl font-semibold text-gray-900">{{ tenantStats.inactive }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Đã chấm dứt</p>
            <p class="text-2xl font-semibold text-gray-900">{{ tenantStats.terminated }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Filters and Search -->
    <div class="bg-white rounded-lg shadow mb-6">
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Search -->
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="Tìm theo tên, SĐT, email, CMND..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <!-- Status Filter -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              id="status"
              v-model="statusFilter"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang thuê</option>
              <option value="inactive">Không hoạt động</option>
              <option value="terminated">Đã chấm dứt</option>
            </select>
          </div>
          
          <!-- Sort -->
          <div>
            <label for="sort" class="block text-sm font-medium text-gray-700 mb-2">
              Sắp xếp theo
            </label>
            <select
              id="sort"
              v-model="sortBy"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Tên</option>
              <option value="createdAt">Ngày tạo</option>
              <option value="phone">Số điện thoại</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Tenants Table -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">
          Danh sách khách thuê ({{ filteredAndSortedTenants.length }})
        </h2>
      </div>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="p-6">
        <div class="animate-pulse space-y-4">
          <div v-for="i in 5" :key="i" class="flex space-x-4">
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="filteredAndSortedTenants.length === 0" class="p-6 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Không tìm thấy khách thuê</h3>
        <p class="text-gray-500 mb-4">Không có khách thuê nào phù hợp với tiêu chí tìm kiếm.</p>
        <button 
          @click="$router.push('/tenants/create')"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Thêm khách thuê đầu tiên
        </button>
      </div>
      
      <!-- Tenants List -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th 
                @click="toggleSort('name')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div class="flex items-center space-x-1">
                  <span>Tên khách thuê</span>
                  <svg v-if="sortBy === 'name'" class="w-4 h-4" :class="sortOrder === 'asc' ? 'transform rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Liên hệ
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CMND/CCCD
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th 
                @click="toggleSort('createdAt')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div class="flex items-center space-x-1">
                  <span>Ngày tạo</span>
                  <svg v-if="sortBy === 'createdAt'" class="w-4 h-4" :class="sortOrder === 'asc' ? 'transform rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="tenant in filteredAndSortedTenants" :key="tenant.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ tenant.name }}</div>
                  <div class="text-sm text-gray-500">{{ tenant.address }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ tenant.phone }}</div>
                <div class="text-sm text-gray-500">{{ tenant.email || 'Chưa cập nhật' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ tenant.idCard }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusColor(tenant.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getStatusText(tenant.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(tenant.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button 
                  @click="$router.push(`/tenants/detail/${tenant?._id}`)"
                  class="text-blue-600 hover:text-blue-900"
                >
                  Xem
                </button>
                <button 
                  @click="$router.push(`/tenants/${tenant?._id}/edit`)"
                  class="text-orange-600 hover:text-orange-900"
                >
                  Sửa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>