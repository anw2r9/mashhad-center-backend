# Mashhad Center - Backend API

Node.js + Express + MongoDB

## Setup

```bash
npm install
npm start
```

## Environment Variables
JWT_SECRET=your_secret
JWT_EXPIRE=7d
EMAIL_FROM=your_email@gmail.com
MONGODB_URI=mongodb://localhost:27017/mashhad

## API Endpoints

- **Auth:** `/api/v1/auth`
- **Products:** `/api/v1/products`
- **Orders:** `/api/v1/orders`
- **Users:** `/api/v1/users`

## Features

✅ Authentication (JWT + 2FA for admin)
✅ Product Management
✅ Orders System
✅ Real-time Updates (Socket.io)
✅ Email Notifications
