import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(v => v === true, 'You must accept the terms'),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const addressSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  fullName: z.string().min(2, 'Full name is required'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  country: z.string().min(2, 'Country is required'),
  isDefault: z.boolean().optional(),
})

export const shippingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  country: z.string().min(2, 'Country is required'),
})

export const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, 'Invalid card number'),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry (MM/YY)'),
  cvv: z.string().regex(/^\d{3,4}$/, 'Invalid CVV'),
  nameOnCard: z.string().min(2, 'Name on card is required'),
})

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(3, 'Title is required'),
  body: z.string().min(10, 'Review must be at least 10 characters'),
})

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  bio: z.string().max(200, 'Bio must be under 200 characters').optional(),
})

export type LoginForm = z.infer<typeof loginSchema>
export type RegisterForm = z.infer<typeof registerSchema>
export type AddressForm = z.infer<typeof addressSchema>
export type ShippingForm = z.infer<typeof shippingSchema>
export type PaymentForm = z.infer<typeof paymentSchema>
export type ReviewForm = z.infer<typeof reviewSchema>
export type ProfileForm = z.infer<typeof profileSchema>
