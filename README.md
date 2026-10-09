# 🛒 BazarDor

**BazarDor** is a modern, responsive web application designed to track, compare, and analyze daily retail prices of essential commodities (rice, lentils, oil, vegetables, fish, meat, eggs, and spices) across major local markets in Bangladesh. The platform provides real-time market updates, daily price trends, market-by-market comparisons, and seamless user account management.

---

## 🛠️ Technologies Used

- **Next.js 15 (App Router)** — Full-stack React framework with Server Components (SSR & SSG)
- **React 19 & TypeScript** — Type-safe component architecture
- **Tailwind CSS & DaisyUI** — Utility-first styling and themeable UI components
- **BetterAuth** — Secure authentication and session management
- **Better-SQLite3** — Lightweight serverless database adapter
- **React Hot Toast** — Floating toast notification system
- **Google Fonts (Noto Sans Bengali)** — Clean and legible typography

---

## 🚀 Key Features

1. **Real-Time Price Ticker (Marquee Strip):**
   Continuous scrolling ticker showing live commodity prices, unit rates, and percentage changes (▲/▼ %) with hover-to-pause and hardware acceleration.

2. **Daily Price Fluctuation Tracker (Top Risers & Fallers):**
   Dedicated sections highlighting the top 6 price risers (আজ দাম বেড়েছে ▲) and top 6 price drops (আজ দাম কমেছে ▼) with color-coded status badges.

3. **Bazar-Wise Price Comparison & Protected Product Details:**
   Protected product detail pages (`/product/[slug]`) displaying minimum, maximum, and average prices alongside comparative breakdown across major local bazaars.

4. **Bengali Numeral Numerical Sorting:**
   Precise numerical price sorting (Default, Price: Low to High, Price: High to Low) displayed seamlessly in Bengali digits (`০-৯`).

5. **Secure Authentication & Profile Management:**
   Email/password and social login options with automatic toast notifications on sign-in and sign-out, avatar image upload, and an in-dashboard password update system.
