<div align="center">

<img src="https://img.shields.io/badge/SmartNest-Property%20Rental%20Platform-6366f1?style=for-the-badge&logo=home&logoColor=white" alt="SmartNest Banner" />

# 🏡 SmartNest

### A Modern Full-Stack Property Rental & Booking Platform

**SmartNest** is a production-ready rental management platform where property owners can list their properties and tenants can discover, book, and pay reservation fees — all in one place. Built with a modern tech stack, it offers role-based dashboards, secure authentication, Stripe payments, and real-time analytics.

<<<<<<< HEAD

=======
[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Visit%20Site-6366f1?style=for-the-badge)](https://smart-nest-kappa.vercel.app)
[![Client Repo](https://img.shields.io/badge/GitHub-Client%20Repo-181717?style=for-the-badge&logo=github)](https://github.com/anika-chhoa/smart-nest.git)
[![Server Repo](https://img.shields.io/badge/GitHub-Server%20Repo-181717?style=for-the-badge&logo=github)](https://github.com/anika-chhoa/smart-nest-server.git)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [User Roles](#user-roles)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Security](#security)
- [Roadmap](#roadmap)
- [Author](#author)

---

## 🌟 Overview

SmartNest bridges the gap between property owners and tenants with a streamlined rental management experience. From property listing to booking approval and payment — everything is handled within a single, intuitive platform.
>>>>>>> a167335 (add: git redmimd)

---

## ✨ Features

| Category | Features |
|---|---|
| 🔐 **Authentication** | JWT, Better Auth, Social Login |
| 👥 **Access Control** | Role-Based (Admin, Owner, Tenant) |
| 🏠 **Property Management** | List, Update, Delete, Approve/Reject |
| 🔎 **Discovery** | Search, Filter, Sort, Pagination |
| 📅 **Booking System** | Request, Approve/Reject, History |
| 💳 **Payments** | Stripe Integration, Transaction Records |
| 📊 **Analytics** | Dashboard Charts, Monthly Earnings |
| 📱 **UI/UX** | Fully Responsive, Framer Motion Animations |
| ❤️ **Personalization** | Favorites, Reviews & Ratings |

---

## 👤 User Roles

<details>
<summary><b>👨‍💼 Admin</b></summary>

- Manage all registered users
- Change user roles
- Approve or reject property listings
- Monitor all platform bookings
- View transactions and platform activity
- Update or remove any property

</details>

<details>
<summary><b>🏠 Property Owner</b></summary>

- Add and manage property listings
- Update property details and availability
- View and manage booking requests
- Approve or reject tenant bookings
- Track monthly earnings via analytics dashboard

</details>

<details>
<summary><b>🙋 Tenant</b></summary>

- Browse and search approved properties
- Filter and sort by preferences
- Save properties to favorites
- Submit booking requests
- Pay reservation fees via Stripe
- Leave reviews and ratings
- Manage personal booking history

</details>

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **Next.js** | React Framework (SSR/SSG) |
| **Tailwind CSS** | Utility-First Styling |
| **HeroUI** | Component Library |
| **Framer Motion** | Animations & Transitions |
| **Recharts** | Data Visualization |
| **Lucide React** | Icon Library |
| **Stripe.js** | Client-side Payment Handling |

### Backend

| Technology | Purpose |
|---|---|
| **Express.js** | REST API Server |
| **MongoDB** | NoSQL Database |
| **Better Auth** | Session & Auth Management |
| **JWT** | Stateless Authentication |
| **Stripe** | Payment Processing |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- MongoDB (local or Atlas)
- Stripe account (for payment integration)

### 1. Clone the Repositories

```bash
# Clone the client
git clone https://github.com/anika-chhoa/smart-nest.git
cd smart-nest

# Clone the server
git clone https://github.com/anika-chhoa/smart-nest-server.git
cd smart-nest-server
```

### 2. Install Dependencies

```bash
# In both client and server directories
npm install
```

### 3. Configure Environment Variables

See the [Environment Variables](#environment-variables) section below.

### 4. Run the Development Servers

```bash
# Start the frontend (runs on http://localhost:3000)
npm run dev

# Start the backend (runs on http://localhost:5000 or your configured PORT)
npm run dev
```

---

## 🔑 Environment Variables

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=your_backend_api_url
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Backend `.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=your_better_auth_url
STRIPE_SECRET_KEY=your_stripe_secret_key
```

> ⚠️ **Never commit `.env` files to version control.** Add them to `.gitignore`.

---

## 📦 Key Dependencies

### Frontend Packages

```
next · react · react-dom · tailwindcss · @heroui/react · better-auth
framer-motion · recharts · stripe · @stripe/stripe-js
react-hot-toast · react-icons · lucide-react · next-themes · mongodb
```

### Backend Packages

```
express · mongodb · better-auth · @better-auth/mongo-adapter · jsonwebtoken · stripe
```

---

## 📱 Responsive Design

SmartNest is fully optimized across all screen sizes:

```
✅ Mobile      ✅ Tablet      ✅ Laptop      ✅ Desktop
```

---

## 🔒 Security

- ✅ JWT-based stateless authentication
- ✅ Better Auth session management
- ✅ Role-based route protection
- ✅ Environment variable encryption
- ✅ Secure MongoDB credential handling
- ✅ Protected API endpoints

---

## 🔮 Roadmap

- [ ] 🔔 Property Wishlist Notifications
- [ ] 📧 Email Notifications (Booking, Approval)
- [ ] 💬 Real-time Chat (Owner ↔ Tenant)
- [ ] 🤖 Property Recommendation System (AI-based)
- [ ] 🌙 Dark Mode Support
- [ ] 🗺️ Google Maps Integration
- [ ] 🌍 Multi-language Support

---

## 👨‍💻 Author

<div align="center">

**Md Shakibul Islam**

If you found this project helpful, please consider giving it a ⭐ — it means a lot!

[![GitHub](https://img.shields.io/badge/GitHub-anika--chhoa-181717?style=for-the-badge&logo=github)](https://github.com/anika-chhoa)

</div>

---

<div align="center">

Made with ❤️ by **Md Shakibul Islam**

</div>