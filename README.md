# 🛒 BazarDor — Daily Commodity Price Tracker & Market Analysis Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://a-07-bajar-dhor.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/developerbdSohag/A-07-Bajar-Dhor)
[![Next.js](https://img.shields.io/badge/Next.js-15%20App%20Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**BazarDor** is a modern, responsive web application designed to track, compare, and analyze the daily retail prices of essential kitchen commodities—including rice, lentils, edible oils, vegetables, fish, meat, eggs, and spices—across prominent local markets in Bangladesh. The platform empowers consumers with real-time price change insights, historical averages, market-by-market comparisons, and seamless user account management.

---

## 🌐 Live Demo & Repository Links

- **Live Deployment:** [https://a-07-bajar-dhor.vercel.app](https://a-07-bajar-dhor.vercel.app)
- **GitHub Repository:** [https://github.com/developerbdSohag/A-07-Bajar-Dhor](https://github.com/developerbdSohag/A-07-Bajar-Dhor)

---

## 🚀 Key Features

### 1. 📈 Real-Time Price Ticker (Marquee Strip)
- An infinite horizontal ticker positioned directly beneath the navigation bar, presenting live commodity price movements, current prices per unit, and percentage change tags (`▲ / ▼ %`).
- Equipped with GPU hardware acceleration (`will-change: transform`) and automatic pause on mouse hover or keyboard focus for comfortable reading.

### 2. ⚖️ Daily Price Fluctuation Tracker (Top Risers & Fallers)
- **Top Risers (আজ দাম বেড়েছে ▲):** Displays the top 6 commodities that experienced price increases compared to yesterday, highlighted with warning/red indicator badges.
- **Top Fallers (আজ দাম কমেছে ▼):** Displays the top 6 commodities with price drops, highlighted with consumer-friendly green badges.
- **All Products Grid:** A responsive grid showing complete inventory with category icons, unit rates, and direct links to details.

### 3. 🔍 Bazar-Wise Price Comparison & Protected Product Details
- Detailed product pages (`/product/[slug]`) are protected routes requiring user authentication, redirecting unauthenticated visitors with helpful toast alerts.
- Provides comprehensive statistical summaries: **Minimum Price**, **Maximum Price**, and **Average Price**.
- Features an interactive table comparing rates across renowned Dhaka bazaars (e.g., Karwan Bazar, New Market, Mirpur Bazar, Uttara Bazar).

### 4. 🔢 Bengali Numeral Numerical Sorting
- Flexible sorting controls across Category and All Products views:
  - `Default (ডিফল্ট)`
  - `Price: Low to High (দাম: কম থেকে বেশি)`
  - `Price: High to Low (দাম: বেশি থেকে কম)`
- Performs true numerical value sorting under the hood rather than alphabetical sorting, converting results back to Bengali numerals (`০-৯`) seamlessly.

### 5. 🔐 Secure Authentication & Dynamic Profile Management
- Powered by **BetterAuth** with email/password and social login options (Google & GitHub).
- Includes persistent flash toast notifications (`react-hot-toast`) that automatically display upon sign-in (`"সফল ভাবে সাইন ইন হয়েছে"`) and sign-out (`"সফল ভাবে সাইন আউট হয়েছে"`).
- Dedicated Settings Dashboard (`/profile/update`) featuring:
  - **Profile Information:** Interactive profile picture avatar upload and preview with real-time navbar synchronization and display name update.
  - **Security & Password:** In-dashboard password change with current password cryptographic verification, live strength meter, and show/hide visibility toggles.

---

## 🛠️ Technologies Used

| Technology | Role / Purpose |
|---|---|
| **Next.js 15 (App Router)** | Full-stack React framework with Server Components (RSC), SSR, and SSG |
| **React 19 & TypeScript** | Component architecture with strict static typing |
| **Tailwind CSS 3** | Utility-first CSS styling and custom design tokens |
| **DaisyUI 4** | Semantic UI component classes styled with custom `bazardor` theme |
| **BetterAuth** | Modern authentication engine, session tokens, and secure password hashing |
| **Better-SQLite3** | Lightweight database engine with automatic schema migrations |
| **React Hot Toast** | Floating toast notification system positioned top-center |
| **Google Fonts (Noto Sans Bengali)** | Clean, high-legibility Bengali typography across all screen viewports |

---

## 📁 Project Structure

```text
├── public/                    # Static assets, SVG illustrations, and icons
├── src/
│   ├── app/
│   │   ├── api/auth/[...all]/ # BetterAuth API endpoint routes
│   │   ├── api/user/          # User management & password change endpoints
│   │   ├── category/[slug]/   # Category product listing & sorting
│   │   ├── product/[slug]/    # Protected product detail & bazar comparison
│   │   ├── profile/           # User account profile overview
│   │   │   └── update/        # Tabbed profile & password update dashboard
│   │   ├── signin/            # User authentication sign-in page
│   │   ├── signup/            # User registration sign-up page
│   │   ├── not-found.tsx      # Custom Bengali 404 error page
│   │   ├── layout.tsx         # Root layout, Noto Sans Bengali font & navbar
│   │   ├── page.tsx           # Homepage (Hero, Risers, Fallers, All Products)
│   │   └── globals.css        # Global CSS rules, ticker animation & font styles
│   ├── components/
│   │   ├── Navbar.tsx         # Executive navbar with category pills & profile dropdown
│   │   ├── PriceTicker.tsx    # Hardware-accelerated continuous price ticker
│   │   ├── Hero.tsx           # Banner with Bengali date & anchor CTA
│   │   ├── ProductCard.tsx    # Responsive product card with change badge
│   │   ├── ProductGrid.tsx    # Responsive grid with numerical sorting
│   │   ├── SkeletonCard.tsx   # Shimmer loading states
│   │   ├── Footer.tsx         # Standardized footer matching Figma
│   │   └── ToastProvider.tsx  # Top-center persistent toast listener
│   ├── lib/
│   │   ├── api.ts             # API client with primary/secondary worker fallback
│   │   ├── auth.ts            # BetterAuth server configuration & DB sync
│   │   ├── auth-client.ts     # BetterAuth client-side React hooks
│   │   └── format.ts          # Bengali numeral, date, currency & unit formatters
│   └── types/                 # TypeScript interfaces and data contracts
├── tailwind.config.ts         # Tailwind CSS & DaisyUI theme configuration
├── package.json               # Dependencies and scripts
└── README.md                  # Project documentation
```

---

## ⚙️ Installation & Local Setup

### Prerequisites
- Node.js (v18.18.0 or higher)
- npm or yarn

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/developerbdSohag/A-07-Bajar-Dhor.git
   cd A-07-Bajar-Dhor
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   BETTER_AUTH_SECRET=your_secure_32_character_secret_key
   BETTER_AUTH_URL=http://localhost:3000
   NEXT_PUBLIC_BASE_URL_1=https://api.api-store.workers.dev/api/bazardor
   NEXT_PUBLIC_BASE_URL_2=https://api.abcz.workers.dev/api/bazardor
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

5. **Build for Production:**
   ```bash
   npm run build
   npm run start
   ```

---

## 🎯 Requirements & Verification Checklist

- [x] **Project Name:** BazarDor
- [x] **Language:** Written completely in English
- [x] **Fully Responsive:** Tested across Mobile, Tablet, and Desktop screen viewports
- [x] **Meaningful Git Commits:** Over 10+ structured and descriptive git commits
- [x] **Zero Error Deployment:** Successfully running live on Vercel without runtime errors
- [x] **Price Ticker Marquee:** Calm, hardware-accelerated scrolling with hover-to-pause
- [x] **Category Navigation & Sorting:** Clean category tabs with numerical price sorting
- [x] **Protected Routes:** Product details protected by authentication with automatic toast notification
- [x] **Persistent Notifications:** Automatic top-center toast alerts on sign-in and sign-out
- [x] **Profile & Security Dashboard:** In-dashboard profile photo upload, name change, and password reset

---

## 📄 License

This project is developed for educational purposes as part of the Programming Hero Web Development Program.
