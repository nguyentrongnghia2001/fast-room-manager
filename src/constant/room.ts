import type { SelectOption } from "@/types/type"

export const availableAmenities = [
  'Điều hòa',
  'Tủ lạnh',
  'Giường',
  'Bàn học',
  'Tủ quần áo',
  'Ban công',
  'WiFi miễn phí',
  'Máy nước nóng',
  'Máy giặt',
  'Bếp gas',
  'Tủ bếp',
  'Sofa',
  'Bàn ăn',
  'TV',
  'Thang máy',
  'Bãi đỗ xe'
] as string[]

export const roomTypes = [
  { value: 'single', label: 'Phòng đơn' },
  { value: 'double', label: 'Phòng đôi' },
  { value: 'family', label: 'Phòng gia đình' }
] as SelectOption[]

export const statusOptions = [
  { value: 'available', label: 'Trống' },
  { value: 'occupied', label: 'Đã thuê' },
  { value: 'maintenance', label: 'Bảo trì' }
] as SelectOption[]
