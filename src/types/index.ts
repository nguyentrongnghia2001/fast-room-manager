export interface Floor {
  _id?: string
  name: string
  createdAt: string | Date
  updatedAt: string | Date
}
export interface Room {
  id?: string
  _id?: string
  name: string
  floor?: number | string
  idFloor?: Floor | string
  type: RoomType
  area: number
  price: number
  deposit: number
  status: RoomStatus
  amenities: string[]
  description?: string
  images: string[]
  createdAt?: string | Date
  updatedAt?: string | Date
}

export type RoomType = 'single' | 'double' | 'family'
export type RoomStatus = 'available' | 'occupied' | 'maintenance'

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
  statusCode?: number
  status: 'success' | 'error'
  message?: string
  data: T
}

// Chatbot & RAG Interfaces
export interface ChatSourceMetadata {
  name?: string
  price?: number
  floor?: string | number
  area?: number
  type?: string
  title?: string
  roomId?: string
  id?: string
  [key: string]: any
}

export interface ChatSource {
  type: 'room' | 'document' | string
  score?: number
  metadata?: ChatSourceMetadata
  text?: string
}

export interface ChatMessage {
  id?: string
  sender: 'user' | 'bot'
  content: string
  sources?: ChatSource[]
  intent?: string
  timestamp?: string | Date
  loading?: boolean
  error?: string
}

export interface ChatResponseData {
  message: string
  sessionId: string
  intent?: string
  sources?: ChatSource[]
}

export interface ChatHistoryData {
  sessionId: string
  messages: Array<{
    sender: 'user' | 'bot'
    content: string
    sources?: ChatSource[]
    timestamp?: string | Date
  }>
}

export interface RagSyncResult {
  roomsSynced: number
  docsSynced: number
  totalVectors: number
}

export interface KnowledgeDoc {
  _id?: string
  id?: string
  title: string
  content: string
  fileType?: 'markdown' | 'pdf' | 'text' | string
  totalChunks?: number
  status?: string
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface RagTestQueryResult {
  score: number
  type: 'room' | 'document' | string
  text: string
  metadata?: Record<string, any>
}

export interface RagTestQueryData {
  query: string
  results: RagTestQueryResult[]
}