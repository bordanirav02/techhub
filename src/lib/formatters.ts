export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

export const formatDate = (dateString: string): string =>
  new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(dateString))

export const formatRelativeDate = (dateString: string): string => {
  const diff = Date.now() - new Date(dateString).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}

export const formatDiscountPercent = (original: number, current: number): number =>
  Math.round(((original - current) / original) * 100)

export const estimateDelivery = (days = 3): string => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

export const generateOrderId = (): string => {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `TH-${ts}-${rand}`
}
