# Room-PG Finding Platform - Phase 1

This is the Phase 1 foundation of the Room & PG Finding Platform. It implements a secure, scalable authentication system with role-based access control.

## Features

- **Authentication System:** Secure registration and login using JWT and HttpOnly cookies.
- **Role-Based Access Control (RBAC):** Three distinct roles: `USER`, `OWNER`, and `ADMIN`.
- **Protected Routes:** Both backend API and frontend routes are protected based on user roles.
- **Dashboards:** Separate dashboards for Users, Owners, and Admins.
- **Modern UI:** Responsive design using Tailwind CSS.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Axios.
- **Backend:** Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT, bcryptjs.

## Project Structure

```text
room-finder/
├── client/         # React Frontend
└── server/         # Node/Express Backend
```

## Environment Variables

### Backend (`server/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/room-finder
JWT_SECRET=supersecretjwtkey_12345
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

## Installation & Setup

1. **Clone the repository.**
2. **Setup MongoDB:** Ensure MongoDB is running on your machine (e.g., `mongodb://localhost:27017/room-finder`).

### Backend Setup

```bash
cd server
npm install
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Creating an Admin User

Admin accounts cannot be created via the public registration form. Run the seed script to create a default admin account:

```bash
cd server
npx tsx src/seeder.ts
```

Default Admin Credentials:
- Email: `admin@roomfinder.com`
- Password: `AdminPassword123!`

## API Endpoints

- `POST /api/auth/register`: Register a new USER or OWNER.
- `POST /api/auth/login`: Login for all users.
- `POST /api/auth/logout`: Clear authentication cookie.
- `GET /api/auth/me`: Get current authenticated user profile.
- `GET /api/health`: Check API health.

## Future Development Phases

This project intentionally excludes property listings, maps, searches, and bookings in Phase 1. These features are scheduled for subsequent phases.
