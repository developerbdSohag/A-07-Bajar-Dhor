# 🛒 বাজার দর / BazarDor

> A modern, responsive web application for tracking, analyzing, and comparing daily retail market prices of essential commodities across Bangladesh.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![BetterAuth](https://img.shields.io/badge/Auth-BetterAuth-green?style=flat-square)](https://better-auth.com/)

---

## 📖 Overview

**বাজার দর (BazarDor)** empowers consumers with transparent, up-to-date market intelligence for daily essentials—including rice, lentils, edible oils, vegetables, fish, meat, eggs, and spices. The platform aggregates price movements from prominent markets, calculates historical trends and averages, and provides intuitive tools for real-time market comparison.

---

## 🛠️ Technologies Used

| Category | Technology | Purpose |
|---|---|---|
| **Framework** | **Next.js 15 (App Router)** | Full-stack architecture with React Server Components (RSC), SSR, and SSG |
| **Language** | **TypeScript & React 19** | Strict static typing, reusable component architecture, and modern hooks |
| **Styling** | **Tailwind CSS & DaisyUI** | Utility-first CSS styling paired with a tailored `bazardor` theme |
| **Authentication** | **BetterAuth** | Secure session management, password hashing, and OAuth integration |
| **Database** | **Better-SQLite3** | Lightweight database engine with automated schema migrations |
| **Notifications** | **React Hot Toast** | Floating toast notification alerts with custom placement |
| **Typography** | **Google Fonts (Noto Sans Bengali)** | Clean, high-legibility Bengali typography across all viewports |

---

## 🚀 Key Features

### 1. 📈 Real-Time Price Ticker (Marquee Strip)
- An infinite scrolling marquee located below the navigation bar displaying live commodity rates and price fluctuations (`▲ / ▼ %`).
- Calibrated scroll speed for comfortable readability, GPU hardware acceleration for smooth 60fps rendering, and automatic pause on hover or focus.

### 2. ⚖️ Daily Price Fluctuation Tracker (Top Risers & Fallers)
- **Top Risers (আজ দাম বেড়েছে ▲):** Showcases the top 6 commodities that experienced price hikes compared to the previous day.
- **Top Fallers (আজ দাম কমেছে ▼):** Highlights the top 6 commodities with price reductions.
- Dynamic color-coded status badges following consumer market conventions (red for price increases, green for price decreases).

### 3. 🔍 Bazar-Wise Price Comparison & Protected Product Details
- Protected product detail routes (`/product/[slug]`) accessible to authenticated users with automatic toast alerts for unauthenticated visits.
- Comprehensive price metrics displaying **Minimum Price**, **Maximum Price**, and **Average Price**.
- Detailed comparative tables analyzing prices across renowned Dhaka markets (Karwan Bazar, New Market, Mirpur Bazar, Uttara Bazar).

### 4. 🔢 Bengali Numeral Numerical Sorting
- Interactive sorting options on Category and All Products views:
  - `Default (ডিফল্ট)`
  - `Price: Low to High (দাম: কম থেকে বেশি)`
  - `Price: High to Low (দাম: বেশি থেকে কম)`
- Pure numerical value sorting under the hood with automatic conversion to localized Bengali digits (`০-৯`).

### 5. 🔐 Secure Authentication & Profile Management
- Comprehensive authentication workflows supporting Email/Password and Social Login (Google & GitHub).
- Automated top-center toast notifications on login (`"সফল ভাবে সাইন ইন হয়েছে"`) and logout (`"সফল ভাবে সাইন আউট হয়েছে"`).
- Executive Profile Dashboard (`/profile/update`) allowing users to update their profile picture with instant preview and securely change their password.
