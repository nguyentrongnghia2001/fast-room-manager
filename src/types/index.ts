export interface Room {
  id: string
  name: string
  floor: number
  type: 'single' | 'double' | 'family'
  area: number
  price: number
  deposit: number
  status: 'available' | 'occupied' | 'maintenance'
  amenities: string[]
  description?: string
  images: string[]
  createdAt: string | Date
  updatedAt: string | Date
}

export interface Tenant {
  id: string
  name: string
  phone: string
  email?: string
  idCard: string
  address: string
  emergencyContact?: string
  emergencyPhone?: string
  notes?: string
  status: 'active' | 'inactive' | 'terminated'
  createdAt: string | Date
  updatedAt: string | Date
}

export interface Contract {
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