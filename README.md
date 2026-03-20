# StockWave Client

Frontend for StockWave, built with React, TypeScript, Vite, Material UI, Axios, and Socket.IO.

## Features

- User login and registration
- Role-based navigation for admin and trader users
- Admin dashboard to view registered users
- Trader dashboard to view live asset price updates
- Real-time updates from the backend with Socket.IO

## Tech Stack

- React 19
- TypeScript
- Vite
- Material UI
- React Router
- Axios
- Socket.IO Client

## Prerequisites

- Node.js 18+
- npm
- StockWave server running locally

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

The app runs on `http://localhost:5173`.

## Environment Variables

The frontend uses Vite's dev proxy for API requests:

- `/api/*` -> `http://localhost:8080`

Optional environment variable:

```env
VITE_SOCKET_SERVER_URL=http://localhost:8080
```

If `VITE_SOCKET_SERVER_URL` is not set, the client falls back to `http://localhost:8080`.

## Available Scripts

- `npm run dev` - start the Vite development server
- `npm run build` - type-check and create a production build
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint

## App Routes

- `/` - login page
- `/register` - registration page
- `/admin-dashboard` - admin-only dashboard
- `/trader-dashboard` - trader-only dashboard

## Notes

- The frontend stores the JWT token in `localStorage` under `token`.
- The current user role is stored in `localStorage` under `role`.
- For full functionality, start the backend before opening the dashboards.
