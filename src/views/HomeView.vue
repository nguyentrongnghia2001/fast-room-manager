<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DashboardStats, Room, Payment } from '@/types'

// Mock data - trong thực tế sẽ fetch từ API
const stats = ref<DashboardStats>({
  totalRooms: 24,
  occupiedRooms: 18,
  availableRooms: 4,
  maintenanceRooms: 2,
  totalTenants: 22,
  monthlyRevenue: 45000000,
  pendingPayments: 8,
  overduePayments: 2
})

const recentRooms = ref<Room[]>([
  {
    id: '1',
    name: 'Phòng 101',
    type: 'single',
    area: 25,
    price: 2500000,
    deposit: 5000000,
    status: 'available',
    amenities: ['Điều hòa', 'Tủ lạnh', 'Giường'],
    images: [],
    floor: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Phòng 102',
    type: 'double',
    area: 35,
    price: 3500000,
    deposit: 7000000,
    status: 'occupied',
    amenities: ['Điều hòa', 'Tủ lạnh', 'Giường đôi'],
    images: [],
    floor: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }
])

const recentPayments = ref<Payment[]>([
  {
    id: '1',
    contractId: 'CT001',
    month: '2024-01',
    rentAmount: 2500000,
    electricityAmount: 150000,
    waterAmount: 50000,
    otherFees: 0,
    totalAmount: 2700000,
    paidAmount: 2700000,
    paidDate: new Date(),
    status: 'paid',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    contractId: 'CT002',
    month: '2024-01',
    rentAmount: 3500000,
    electricityAmount: 200000,
    waterAmount: 75000,
    otherFees: 100000,
    totalAmount: 3875000,
    paidAmount: 0,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  }
])

const occupancyRate = computed(() => {
  return Math.round((stats.value.occupiedRooms / stats.value.totalRooms) * 100)
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'available':
      return 'text-success-600 bg-success-50'
    case 'occupied':
      return 'text-primary-600 bg-primary-50'
    case 'maintenance':
      return 'text-warning-600 bg-warning-50'
    case 'paid':
      return 'text-success-600 bg-success-50'
    case 'pending':
      return 'text-warning-600 bg-warning-50'
    case 'overdue':
      return 'text-danger-600 bg-danger-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'available':
      return 'Trống'
    case 'occupied':
      return 'Đã thuê'
    case 'maintenance':
      return 'Bảo trì'
    case 'paid':
      return 'Đã thanh toán'
    case 'pending':
      return 'Chờ thanh toán'
    case 'overdue':
      return 'Quá hạn'
    default:
      return status
  }
}
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p class="mt-2 text-sm text-gray-700">
        Tổng quan về tình hình kinh doanh phòng trọ
      </p>
    </div>

    <!-- Stats Grid -->
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
                <dd class="text-lg font-medium text-gray-900">{{ stats.totalRooms }}</dd>
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
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Khách thuê</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.totalTenants }}</dd>
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
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Doanh thu tháng</dt>
                <dd class="text-lg font-medium text-gray-900">{{ formatCurrency(stats.monthlyRevenue) }}</dd>
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
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Chờ thanh toán</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.pendingPayments }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Occupancy Rate -->
    <div class="bg-white shadow rounded-lg mb-8">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Tỷ lệ lấp đầy</h3>
        <div class="flex items-center">
          <div class="flex-1">
            <div class="flex justify-between text-sm text-gray-600 mb-1">
              <span>{{ stats.occupiedRooms }}/{{ stats.totalRooms }} phòng</span>
              <span>{{ occupancyRate }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-primary-600 h-2 rounded-full" :style="{ width: occupancyRate + '%' }"></div>
            </div>
          </div>
        </div>
        <div class="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div class="text-center">
            <div class="text-2xl font-bold text-primary-600">{{ stats.occupiedRooms }}</div>
            <div class="text-gray-500">Đã thuê</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-success-600">{{ stats.availableRooms }}</div>
            <div class="text-gray-500">Trống</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-warning-600">{{ stats.maintenanceRooms }}</div>
            <div class="text-gray-500">Bảo trì</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Rooms -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Phòng mới nhất</h3>
          <div class="space-y-4">
            <div v-for="room in recentRooms" :key="room.id" class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ room.name }}</div>
                  <div class="text-sm text-gray-500">{{ room.area }}m² - {{ formatCurrency(room.price) }}/tháng</div>
                </div>
              </div>
              <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusColor(room.status)]">
                {{ getStatusText(room.status) }}
              </span>
            </div>
          </div>
          <div class="mt-4">
            <RouterLink to="/rooms" class="text-sm font-medium text-primary-600 hover:text-primary-500">
              Xem tất cả phòng →
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Recent Payments -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Thanh toán gần đây</h3>
          <div class="space-y-4">
            <div v-for="payment in recentPayments" :key="payment.id" class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ payment.contractId }}</div>
                  <div class="text-sm text-gray-500">{{ payment.month }} - {{ formatCurrency(payment.totalAmount) }}</div>
                </div>
              </div>
              <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusColor(payment.status)]">
                {{ getStatusText(payment.status) }}
              </span>
            </div>
          </div>
          <div class="mt-4">
            <RouterLink to="/contracts" class="text-sm font-medium text-primary-600 hover:text-primary-500">
              Xem tất cả thanh toán →
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
