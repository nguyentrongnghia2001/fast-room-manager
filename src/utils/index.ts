const formatDate = (date?: string | Date | null): string => {
  if (!date) return ''
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  } catch {
    return ''
  }
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

export { formatDate, formatCurrency }
