# TechHub — Premium Tech Gadgets Store

A production-ready, full-featured tech e-commerce web application built with React 18, TypeScript, and Tailwind CSS. Shop the latest smartphones, laptops, headphones, smartwatches, and more.

## Live Demo

**[techhub-kappa.vercel.app](https://techhub-kappa.vercel.app)**

---

## Features

### Shopping Experience
- **50 products** across 10 categories — Smartphones, Laptops, Headphones, Smartwatches, Tablets, Cameras, Monitors, Smart Home, Accessories, Storage
- **3D tilt product cards** with spring physics, glare overlay, and hover image swap
- **Quick View modal** — preview product without leaving the page
- **Advanced filters** — category, brand, price range, rating, in-stock, on-sale, new arrivals
- **Sort options** — relevance, price, rating, newest, best seller
- **Grid / list view** toggle (2 / 3 / 4 columns)

### Cart & Checkout
- **Slide-in cart drawer** with quantity controls
- **Coupon codes**: `SAVE10` · `TECH20` · `FLAT50` · `WELCOME` · `STUDENT`
- **Multi-step checkout** — Shipping → Payment → Review
- Auto-calculated shipping (free over $50), tax (8%), and discounts

### User Account
- Register / Login / Forgot Password (localStorage-based auth)
- **Profile** — avatar upload, name, phone, bio
- **Order history** with full order detail page and animated status timeline
- **Saved addresses** — add, edit, delete, set default
- **Shopping analytics** — monthly spend chart, category breakdown, top brands (Recharts)
- **Settings** — theme toggle, notification preferences, delete account

### UI & Animations
- **Hero banner** — 4 slides with floating transparent product images, per-slide accent colors, floating spec badges, real-time countdown timer, direction-aware transitions
- **3D CategoryGrid** — each card tilts toward the cursor with perspective transform
- **Command Palette** — `Ctrl+K` global search and navigation
- **CompareBar** — sticky bottom bar when products are queued for comparison
- **Framer Motion** — page transitions, spring animations, AnimatePresence throughout
- **Dark / Light theme** with CSS custom properties

### PWA & Deployment
- `manifest.json` for "Add to Home Screen" on mobile
- Vercel SPA routing via `vercel.json`
- Code-split lazy routes for fast load

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v3 + CSS custom properties |
| Animation | Framer Motion 11 |
| State | Zustand 5 (with persist middleware) |
| Server State | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Icons | Lucide React + React Icons |
| Charts | Recharts |
| Toast | React Hot Toast |
| Routing | React Router v6 |
| Build | Vite 5 |
| Deploy | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/bordanirav02/techhub.git
cd techhub

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
techhub/
├── public/
│   ├── products.json         # 50 product records
│   ├── manifest.json         # PWA manifest
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── cart/             # CartDrawer
│   │   ├── home/             # HeroBanner, CategoryGrid, FlashDeals, StatsBar, TrendingProducts
│   │   ├── layout/           # Navbar, Footer, BottomNav
│   │   ├── product/          # ProductCard (3D), QuickViewModal, CompareBar
│   │   └── ui/               # Button, Badge, Modal, Drawer, Input, Skeleton, CommandPalette
│   ├── hooks/                # useProducts, useDebounce, useLocalStorage, useRecentlyViewed
│   ├── lib/                  # constants, formatters, Zod validators
│   ├── pages/
│   │   ├── account/          # Profile, Orders, OrderDetail, Addresses, Analytics, Settings
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Wishlist.tsx
│   │   ├── Compare.tsx
│   │   ├── Search.tsx
│   │   ├── Deals.tsx
│   │   ├── Compatibility.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── ForgotPassword.tsx
│   ├── store/                # cartStore, wishlistStore, authStore, compareStore, uiStore
│   └── types/                # TypeScript interfaces
├── vercel.json               # SPA rewrite rules
├── tailwind.config.ts
└── vite.config.ts
```

---

## Demo Account

Click **Demo Login** on the sign-in page for instant access — no registration needed.

All data is stored in browser `localStorage` — nothing is sent to any server.

### Coupon Codes to Try

| Code | Discount |
|---|---|
| `SAVE10` | 10% off |
| `TECH20` | 20% off |
| `FLAT50` | $50 flat off |
| `WELCOME` | 15% off |
| `STUDENT` | 25% off |

---

## Deploying to Vercel

1. Go to **[vercel.com](https://vercel.com)** → **New Project**
2. Click **Import** next to `bordanirav02/techhub`
3. Framework is auto-detected as **Vite** — no config changes needed
4. Click **Deploy** — done in ~60 seconds

The `vercel.json` file already handles SPA routing so all routes (`/products`, `/account`, etc.) work correctly on page refresh.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+K` / `Cmd+K` | Open Command Palette |
| `↑` `↓` | Navigate palette results |
| `Enter` | Select result |
| `Esc` | Close palette / modal |

---

## License

MIT — free to use for personal and commercial projects.

---

*Built with React 18 · TypeScript · Tailwind CSS · Framer Motion*
