<template>
  <div class="p-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Contract Not Found -->
    <div v-else-if="!contract" class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">📄</div>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy hợp đồng</h2>
      <p class="text-gray-600 mb-4">Hợp đồng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      <router-link
        to="/contracts"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Quay lại danh sách
      </router-link>
    </div>

    <!-- Contract Details -->
    <div v-else>
      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Chi tiết hợp đồng</h1>
            <p class="text-gray-600 mt-1">Hợp đồng #{{ contract.id }}</p>
          </div>
          <div class="flex space-x-3">
            <router-link
              to="/contracts"
              class="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Quay lại
            </router-link>
            <button
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Contract Info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Contract Status -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Trạng thái hợp đồng</h2>
            <div class="flex items-center space-x-4">
              <span
                class="px-3 py-1 rounded-full text-sm font-medium"
                :class="getStatusColor(contract.status)"
              >
                {{ getStatusText(contract.status) }}
              </span>
              <span class="text-gray-600">
                Từ {{ formatDate(contract.startDate) }} đến {{ formatDate(contract.endDate) }}
              </span>
            </div>
          </div>

          <!-- Room Information -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Thông tin phòng</h2>
            <div v-if="room" class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">Tên phòng</p>
                <p class="font-medium">{{ room.name }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Tầng</p>
                <p class="font-medium">{{ room.idFloor?.name || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Loại phòng</p>
                <p class="font-medium">{{ getRoomTypeText(room.type) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Diện tích</p>
                <p class="font-medium">{{ room.area }}m²</p>
              </div>
            </div>
            <div class="mt-4">
              <router-link
                :to="`/rooms/${contract.roomId}`"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Xem chi tiết phòng →
              </router-link>
            </div>
          </div>

          <!-- Tenant Information -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Thông tin khách thuê</h2>
            <div v-if="tenant" class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">Họ tên</p>
                <p class="font-medium">{{ tenant.name }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Số điện thoại</p>
                <p class="font-medium">{{ tenant.phone }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Email</p>
                <p class="font-medium">{{ tenant.email || 'Chưa có' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">CMND/CCCD</p>
                <p class="font-medium">{{ tenant.idCard }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-sm text-gray-600">Địa chỉ</p>
                <p class="font-medium">{{ tenant.address }}</p>
              </div>
            </div>
            <div class="mt-4">
              <router-link
                :to="`/tenants/${contract.tenantId}`"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Xem chi tiết khách thuê →
              </router-link>
            </div>
          </div>

          <!-- Recent Payments -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900">Thanh toán gần đây</h2>
              <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Xem tất cả
              </button>
            </div>
            <div v-if="recentPayments.length > 0" class="space-y-3">
              <div
                v-for="payment in recentPayments"
                :key="payment.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p class="font-medium">{{ formatCurrency(payment.totalAmount) }}</p>
                  <p class="text-sm text-gray-600">Tháng {{ payment.month }} - {{ payment.dueDate ? formatDate(payment.dueDate) : (payment.paidDate ? formatDate(payment.paidDate) : 'N/A') }}</p>
                </div>
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="getPaymentStatusColor(payment.status)"
                >
                  {{ getPaymentStatusText(payment.status) }}
                </span>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              Chưa có thanh toán nào
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Financial Summary -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Thông tin tài chính</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Tiền thuê/tháng:</span>
                <span class="font-medium">{{ formatCurrency(contract.monthlyRent) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Tiền cọc:</span>
                <span class="font-medium">{{ formatCurrency(contract.deposit) }}</span>
              </div>
              <div class="border-t pt-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Tổng giá trị:</span>
                  <span class="font-semibold text-lg">{{ formatCurrency(totalContractValue) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
            <div class="space-y-3">
              <button class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Tạo hóa đơn
              </button>
              <button class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Xem lịch sử thanh toán
              </button>
              <button class="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                Gia hạn hợp đồng
              </button>
              <button class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Chấm dứt hợp đồng
              </button>
            </div>
          </div>

          <!-- Contract Timeline -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Thời gian hợp đồng</h3>
            <div class="space-y-3">
              <div>
                <p class="text-sm text-gray-600">Ngày bắt đầu</p>
                <p class="font-medium">{{ formatDate(contract.startDate) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Ngày kết thúc</p>
                <p class="font-medium">{{ formatDate(contract.endDate) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Thời gian còn lại</p>
                <p class="font-medium">{{ getRemainingTime() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Contract, Room, Tenant, Payment } from '@/types'
import { useContractStore } from '@/stores/contract'
import { useRoomStore } from '@/stores/rooms'
import { useTenantStore } from '@/stores/tenant'
import { usePaymentStore } from '@/stores/payment'

const route = useRoute()
const contractId = route.params.id as string
const contractStore = useContractStore()
const roomStore = useRoomStore()
const tenantStore = useTenantStore()
const paymentStore = usePaymentStore()

// Reactive data
const isLoading = ref(true)
const contract = ref<Contract | null>(null)
const room = ref<Room | null>(null)
const tenant = ref<Tenant | null>(null)
const recentPayments = ref<Payment[]>([])

// Computed
const totalContractValue = computed(() => {
  if (!contract.value) return 0
  const months = getContractMonths()
  return contract.value.monthlyRent * months + contract.value.deposit
})

// Methods
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (date: string | Date) => {
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

const getRoomTypeText = (type: string): string => {
  const texts = {
    single: 'Phòng đơn',
    double: 'Phòng đôi',
    family: 'Phòng gia đình'
  }
  return texts[type as keyof typeof texts] || type
}

const getPaymentStatusColor = (status: string): string => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const getPaymentStatusText = (status: string): string => {
  const texts = {
    pending: 'Chờ thanh toán',
    paid: 'Đã thanh toán',
    overdue: 'Quá hạn'
  }
  return texts[status as keyof typeof texts] || status
}

const getContractMonths = (): number => {
  if (!contract.value) return 0
  const start = new Date(contract.value.startDate)
  const end = new Date(contract.value.endDate)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30))
}

const getRemainingTime = (): string => {
  if (!contract.value) return ''
  const end = new Date(contract.value.endDate)
  const now = new Date()
  const diff = end.getTime() - now.getTime()
  
  if (diff <= 0) return 'Đã hết hạn'
  
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  if (days < 30) return `${days} ngày`
  
  const months = Math.floor(days / 30)
  return `${months} tháng`
}

const loadContractData = async () => {
  isLoading.value = true
  if(!route.params.id) {
    isLoading.value = false
    return
  }
  console.log('Loading contract data for ID:', route.params.id);
  
  try {
    // Fetch contract detail from API
    contract.value = await contractStore.getDetailContract(route.params.id as string)
    
    if (contract.value) {
      // Load related data
      const [roomData, tenantData, paymentsData] = await Promise.all([
        roomStore.getDetailRoom(contract.value.roomId),
        tenantStore.getDetailTenant(contract.value.tenantId),
        paymentStore.getListPayments({ contractId: contract.value.id })
      ])
      
      room.value = roomData
      tenant.value = tenantData
      recentPayments.value = paymentsData.slice(0, 3)
    }
  } catch (error) {
    console.error('Error loading contract:', error)
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadContractData()
})
</script>