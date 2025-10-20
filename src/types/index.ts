export interface Floor {
  _id?: string
  name: string
  createdAt: string | Date
  updatedAt: string | Date
}
export interface Room {
  id: string
  _id?: string
  name: string
  floor: string
  type: RoomType
  area: number
  price: number
  deposit: number
  status: RoomStatus
  amenities: string[]
  description?: string
  images: string[]
  createdAt: string | Date
  updatedAt: string | Date
}

type RoomType = 'single' | 'double' | 'family'
type RoomStatus = 'available' | 'occupied' | 'maintenance'

export interface Tenant {
  id: string
  _id?: string
  name: string
  phone: string
  email?: string
  idCard: string
  address: string
  emergencyContact?: string
  emergencyPhone?: string
  notes?: string
  status: TenantStatus
  createdAt: string | Date
  updatedAt: string | Date
}

type TenantStatus = 'active' | 'inactive' | 'terminated'

export interface Contract {
  _id?: string
  id: string
  roomId: string
  tenantId: string
  startDate: string
  endDate: string
  monthlyRent: number
  deposit: number
  status: 'active' | 'expired' | 'terminated'
  createdAt: string | Date
  updatedAt: string | Date
}

export interface Payment {
  id: string
  contractId: string
  month: string
  rentAmount: number
  electricityAmount: number
  waterAmount: number
  otherFees: number
  totalAmount: number
  paidAmount: number
  status: 'pending' | 'paid' | 'overdue'
  dueDate?: string | Date
  paidDate?: string | Date
  notes?: string
  createdAt: string | Date
  updatedAt: string | Date
}

export interface Utility {
  id: string
  roomId: string
  type: 'electricity' | 'water' | 'internet' | 'gas'
  previousReading: number
  currentReading: number
  unitPrice: number
  amount: number
  month: string
  year: number
  createdAt: string | Date
  updatedAt: string | Date
}

export interface DashboardStats {
  totalRooms: number
  occupiedRooms: number
  availableRooms: number
  maintenanceRooms: number
  totalTenants: number
  monthlyRevenue: number
  pendingPayments: number
  overduePayments: number
}

export interface ApiResponse<T> {
  status: 'success' | 'error'
  message?: string
  data: T
}