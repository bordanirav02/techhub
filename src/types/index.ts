export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  images: string[];
  colors?: ProductColor[];
  storage?: string[];
  description: string;
  features: string[];
  specs: Record<string, string>;
  tags: string[];
  badge?: 'New' | 'Sale' | 'Best Seller' | 'Low Stock' | 'Pre-order';
  compatibleWith?: string[];
  bundleWith?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: ProductColor;
  selectedStorage?: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  passwordHash: string;
  createdAt: string;
  notificationPrefs: {
    orderUpdates: boolean;
    promotions: boolean;
    priceDrops: boolean;
    newsletters: boolean;
  };
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  selectedColor?: ProductColor;
  selectedStorage?: string;
  unitPrice: number;
}

export type OrderStatus = 'Processing' | 'Confirmed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Returned';

export interface OrderStatusEvent {
  status: OrderStatus;
  timestamp: string;
  description: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  statusHistory: OrderStatusEvent[];
  shippingAddress: Address;
  paymentMethod: string;
  estimatedDelivery: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  body: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpful: number;
  notHelpful: number;
  createdAt: string;
}

export interface Question {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  question: string;
  answers: QAnswer[];
  createdAt: string;
}

export interface QAnswer {
  id: string;
  userId: string;
  userName: string;
  answer: string;
  helpful: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'deal' | 'priceAlert' | 'system';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface BundleDeal {
  id: string;
  name: string;
  description: string;
  productIds: string[];
  bundlePrice: number;
  savings: number;
}

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'best-seller';
export type ViewMode = 'grid-2' | 'grid-3' | 'grid-4' | 'list';
export type Theme = 'dark' | 'light';
