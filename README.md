# 🏢 Rentify — Smart Room & PG Finder Platform

<p align="center">
  <img src="client/public/favicon.svg" alt="Rentify Logo" width="80" height="80" />
</p>

<p align="center">
  <b>Rentify</b> is a full-stack, enterprise-grade accommodation finder platform built with <b>React, Node.js, Express, TypeScript, and MongoDB</b>. It empowers renters to easily discover PG & flat listings, property owners to seamlessly showcase listings with Cloudinary image uploads, and system administrators to manage system integrity with full audit trail history.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
</p>

---

## ✨ Features & Highlights

### 🔐 Multi-Role Access Control (RBAC)
- **Renter (USER)**: Search, filter, and view PG/Flat listings by city, type, price range, and availability. Write ratings & reviews.
- **Property Owner (OWNER)**: Post new listings, upload property photos (Cloudinary integration), manage bed availability, and edit/delete properties.
- **Administrator (ADMIN)**: Comprehensive system dashboard with metrics, owner & tenant management, item deletion with mandatory audit logging (`DeletionHistory`), and log purging.

### 🛡️ Robust Security & Route Guarding
- **JWT Authentication via HttpOnly Cookies**: Protection against XSS and token theft.
- **Strict Client-Side Route Guards (`ProtectedRoute`)**: Automatically intercepts unauthenticated or unauthorized URL direct navigation (e.g., `/user/dashboard`, `/owner/dashboard`, `/admin/dashboard`) and redirects users to Login.
- **Server & Client Schema Validation (Joi)**: Full payload validation for registration, login, and property management.
- **Enterprise Express Security**: Integrated **Helmet** HTTP security headers, rate limiting (`express-rate-limit`), and strict CORS policies.
- **Centralized Error Middleware**: Express `asyncHandler` wrapper with custom `ErrorResponse` routing and standardized JSON error outputs.

### 🤖 AI Webhook Assistant Integration
- Native proxy controller for **Make.com AI Assistant / Webhook Chatbot**, enabling real-time automated tenant Q&A support.

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Axios, Joi |
| **Backend** | Node.js, Express.js, TypeScript, Mongoose, JWT, Joi, bcryptjs |
| **Database** | MongoDB / MongoDB Atlas |
| **Media Storage** | Cloudinary API (base64 & image URL uploads) |
| **Security** | HttpOnly Cookies, Helmet, Express Rate Limit, CORS, Centralized Error Handling |
| **Automation** | Make.com Webhook AI Chatbot Proxy |

---

## 📁 Repository Structure

```text
room-finder/
├── client/                 # React + TypeScript Frontend (Vite)
│   ├── public/             # Static assets & brand favicon
│   ├── src/
│   │   ├── components/     # UI components & Route Guards
│   │   ├── context/        # Auth Context & State Management
│   │   ├── pages/          # Renter, Owner, Admin pages & dashboards
│   │   ├── schemas/        # Client-side Joi validation schemas
│   │   ├── services/       # Axios API client services
│   │   └── types/          # TypeScript interfaces
│   └── package.json
└── server/                 # Node.js + Express Backend (TypeScript)
    ├── src/
    │   ├── config/         # Database & Cloudinary setup
    │   ├── controllers/    # Refactored async controller handlers
    │   ├── middleware/     # Auth, Security, Validation, Async, Error middleware
    │   ├── models/         # User, Property, DeletionHistory Mongoose schemas
    │   ├── routes/         # Auth, Property, Admin, Chat routes
    │   ├── schemas/        # Server-side Joi validation schemas
    │   ├── utils/          # ErrorResponse & JWT token generator
    │   ├── propertySeeder.ts# Property mock data seeder
    │   ├── seeder.ts       # Admin account seeder
    │   └── server.ts       # Express application entry point
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.x or higher
- **MongoDB**: Local MongoDB instance running or MongoDB Atlas connection string
- **Cloudinary Account**: (Optional) for property image uploads

---

### 1. Environment Configuration

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/room-finder
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Optional Integrations
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MAKE_WEBHOOK_URL=https://hook.make.com/your-webhook-id
```

Create a `.env` file in the `client` directory (optional):

```env
VITE_API_URL=http://localhost:5000/api
```

---

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# (Optional) Seed Admin Account & Demo Properties
npx tsx src/seeder.ts
npx tsx src/propertySeeder.ts

# Start Development Server
npm run dev
```

---

### 3. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start Vite Development Server
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 📡 API Reference Overview

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new USER or OWNER account |
| `POST` | `/api/auth/login` | Public | Authenticate user & set JWT HttpOnly cookie |
| `POST` | `/api/auth/logout` | Public | Clear authentication cookie |
| `GET` | `/api/auth/me` | Private | Get authenticated user profile |
| `PUT` | `/api/auth/profile` | Private | Update user profile details |

### 🏠 Property Listings (`/api/properties`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/properties` | Public | List properties with search, city, type & price filters |
| `GET` | `/api/properties/my-properties` | Owner/Admin | Get properties owned by logged-in user |
| `GET` | `/api/properties/:id` | Public | Get single property details |
| `POST` | `/api/properties` | Owner/Admin | Create new listing (Joi validated & Cloudinary image support) |
| `PUT` | `/api/properties/:id` | Owner/Admin | Update existing listing |
| `DELETE` | `/api/properties/:id` | Owner/Admin | Delete property listing |
| `POST` | `/api/properties/:id/reviews` | Private (Renter)| Add or update rating review |

### 🛡️ Administrative Portal (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Admin | Get platform overview & analytics |
| `GET` | `/api/admin/owners` | Admin | Get all registered property owners |
| `GET` | `/api/admin/renters` | Admin | Get all registered tenants/renters |
| `POST` | `/api/admin/delete-item` | Admin | Audit-logged deletion of Property, Owner, or Renter |
| `GET` | `/api/admin/history` | Admin | View deletion audit trail history logs |
| `DELETE` | `/api/admin/history/:id` | Admin | Remove specific deletion log entry |
| `DELETE` | `/api/admin/history` | Admin | Clear all deletion audit logs |

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.
