export const CATEGORIES = [
  { id: 'smartphones', label: 'Smartphones', icon: '📱', color: '#3b82f6' },
  { id: 'laptops', label: 'Laptops', icon: '💻', color: '#8b5cf6' },
  { id: 'headphones', label: 'Headphones', icon: '🎧', color: '#ec4899' },
  { id: 'smartwatches', label: 'Smart Watches', icon: '⌚', color: '#10b981' },
  { id: 'tablets', label: 'Tablets', icon: '📲', color: '#f59e0b' },
  { id: 'cameras', label: 'Cameras', icon: '📷', color: '#ef4444' },
  { id: 'monitors', label: 'Monitors', icon: '🖥️', color: '#6366f1' },
  { id: 'smart-home', label: 'Smart Home', icon: '🏠', color: '#14b8a6' },
  { id: 'accessories', label: 'Accessories', icon: '🔌', color: '#f97316' },
  { id: 'storage', label: 'Storage', icon: '💾', color: '#84cc16' },
  { id: 'tvs', label: 'TVs', icon: '📺', color: '#06b6d4' },
]

export const BRANDS = [
  'Apple', 'Samsung', 'Google', 'Sony', 'Dell', 'LG',
  'Logitech', 'Razer', 'ASUS', 'Lenovo', 'Microsoft',
  'Bose', 'Anker', 'DJI', 'Garmin', 'Corsair', 'NVIDIA',
  'Sennheiser', 'Jabra', 'SteelSeries', 'Keychron', 'Elgato',
  'Nothing', 'OnePlus', 'Xiaomi', 'Belkin', 'Spigen', 'Philips',
]

export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'best-seller', label: 'Best Sellers' },
]

export const TRENDING_SEARCHES = [
  'iPhone 15 Pro',
  'MacBook Pro M3',
  'Samsung Galaxy S24',
  'AirPods Pro',
  'RTX 4090',
  'Sony WH-1000XM5',
  'iPad Pro M4',
  'Apple Watch Ultra',
]

export const COUPON_CODES = {
  SAVE10: '10% off',
  TECH20: '20% off',
  FLAT50: '$50 off',
  WELCOME: '15% off for new users',
  STUDENT: '25% off student discount',
}

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/deals', label: 'Deals' },
  { href: '/compatibility', label: 'Compatibility' },
]

export const STATS = [
  { value: 50000, label: 'Happy Customers', suffix: '+' },
  { value: 4.9, label: 'Average Rating', suffix: '★', isFloat: true },
  { value: 50, label: 'Free Shipping', prefix: '$', label2: 'and above' },
  { value: 30, label: 'Day Returns', suffix: '-day' },
]
