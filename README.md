# 🩺 PhysioCare — Full-Stack Healthcare & Clinic Management Platform

[![React 19](https://img.shields.io/badge/React-19.0-blue.svg?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg?logo=nodedotjs)](https://nodejs.org/)
[![Express.js 5](https://img.shields.io/badge/Express.js-5.0-black.svg?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS 4](https://img.shields.io/badge/TailwindCSS-v4.0-06B6D4.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Supported-5A0FC8.svg?logo=pwa)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**PhysioCare** is a modern, responsive full-stack web application designed for physiotherapy clinics and healthcare practices. Built with a decoupled **React 19** frontend and an **Express 5 / Node.js** backend, PhysioCare provides seamless healthcare resource sharing, appointment inquiry management, client testimonial moderation, web push notifications, progressive web app (PWA) capabilities, and formatted Excel report exports.

---

## 🚀 Key Features

### 👤 Patient & User Portal
- **Authentication & Authorization**: Secure JWT-based authentication using HTTP-only cookies, password hashing (`bcryptjs`), and email password recovery via **Nodemailer**.
- **Interactive Clinic Services**: Explore offered medical/physiotherapy services, view detailed treatment plans, and submit contact inquiries.
- **Healthcare Content & Blogs**: Access educational articles, medical news, category-based filtering, and downloadable clinical resources hosted on **Cloudinary**.
- **Testimonial Submissions**: Patients can submit reviews and feedback directly from their personal dashboard.
- **Progressive Web App (PWA)**: Installable on desktop and mobile devices with offline caching via Service Workers and native installation prompts.

### 🛡️ Admin Management Panel
- **Role-Based Access Control (RBAC)**: Dedicated protected routes and layout for clinic administrators.
- **Service & Resource CMS**: Full CRUD operations for managing clinic offerings, blog articles, dynamic tags, and downloadable media resources.
- **Testimonial Moderation**: Approve or reject patient reviews before displaying them on the public portal.
- **Patient Directory & Excel Export Engine**: View patient records and generate formatted `.xlsx` workbooks using **ExcelJS** (featuring custom clinic headers, zebra striping, auto-filters, and frozen headers).
- **Web Push Notification Center**: Broadcast system announcements or send targeted push notifications to specific patients using VAPID keys (`web-push`).
- **Dynamic Clinic Settings**: Manage clinic branding, contact info, and operational settings in real-time.

---

## 🛠️ Tech Stack

| Domain | Technology / Library | Description |
| :--- | :--- | :--- |
| **Frontend** | **React 19** | Component-based UI rendering |
| | **Vite** | Next-generation fast frontend tooling |
| | **Tailwind CSS v4** | Utility-first responsive styling system |
| | **React Router v7** | Single Page Application (SPA) client-side routing |
| | **React Hook Form & Zod** | High-performance form state & schema validation |
| | **vite-plugin-pwa** | Service worker registration & PWA manifest configuration |
| **Backend** | **Node.js & Express.js 5** | RESTful API server framework |
| | **MongoDB & Mongoose** | NoSQL database & ODM modeling |
| | **JWT & Cookies** | Token-based session management |
| | **ExcelJS** | Server-side Excel report generation engine |
| | **Web-Push** | VAPID push notification protocol execution |
| | **Cloudinary** | Cloud image and document asset management |
| | **Nodemailer** | SMTP email transportation service |
| **Security** | **Helmet & Rate Limiter** | HTTP header protection & rate limiting (`express-rate-limit`) |

---

## 📁 Directory Structure

```
Clinic/
├── client/                   # Frontend React + Vite Application
│   ├── public/               # Static assets & PWA manifest
│   ├── src/
│   │   ├── api/              # Axios instance & API endpoint services
│   │   ├── components/       # Reusable UI components & Protected Routes
│   │   ├── context/          # Auth & App state providers
│   │   ├── hooks/            # Custom React hooks (PWA, Push Notifications)
│   │   ├── layouts/          # Main, Admin, and Dashboard Layouts
│   │   ├── pages/            # Public, Patient Dashboard & Admin pages
│   │   ├── routes/           # AppRoutes configuration
│   │   └── validations/      # Zod validation schemas
│   ├── vite.config.js        # Vite + PWA configuration
│   └── package.json
│
└── server/                   # Backend Node.js + Express API Server
    ├── src/
    │   ├── config/           # Database, Cloudinary, and Env setups
    │   ├── controllers/      # Route logic & Business controllers
    │   ├── middlewares/      # Error handler, Auth, Rate Limiter
    │   ├── models/           # Mongoose Data Schemas
    │   ├── routes/           # RESTful API route declarations
    │   ├── scripts/          # Admin seeding utility scripts
    │   ├── utils/            # Push notification & Excel helper modules
    │   └── validations/      # Server-side Zod request validation
    ├── src/server.js         # Express server entrypoint
    └── package.json
```

---

## ⚙️ Getting Started & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas cluster)
- [Git](https://git-scm.com/)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Yash-Virugama/PhysioCare.git
cd PhysioCare
```

---

### 2️⃣ Backend Setup (`/server`)

1. Navigate to the server folder:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/clinic_db
   JWT_SECRET=your_jwt_super_secret_key
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development

   # Cloudinary Credentials
   CLOUD_NAME=your_cloud_name
   CLOUD_API_KEY=your_cloud_api_key
   CLOUD_API_SECRET=your_cloud_api_secret

   # Web Push VAPID Keys
   VAPID_PUBLIC_KEY=your_vapid_public_key
   VAPID_PRIVATE_KEY=your_vapid_private_key
   VAPID_SUBJECT=mailto:your_email@domain.com

   # Email Service (Nodemailer)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password

   # Admin Seed Credentials
   ADMIN_NAME=Clinic Admin
   ADMIN_EMAIL=admin@clinic.com
   ADMIN_PASSWORD=Admin@123
   ```

4. Seed the initial Admin user (optional):
   ```bash
   npm run seed:admin
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will run on `http://localhost:5000`.*

---

### 3️⃣ Frontend Setup (`/client`)

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_VAPID_PUBLIC_KEY=your_vapid_public_key
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The client application will run on `http://localhost:5173`.*

---

## 📡 API Overview

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new patient account |
| `POST` | `/api/auth/login` | Public | Authenticate user & set JWT cookie |
| `GET` | `/api/auth/me` | Private | Fetch authenticated user profile |
| `GET` | `/api/services` | Public | List all clinic services |
| `POST` | `/api/services` | Admin | Create a new clinic service |
| `GET` | `/api/blogs` | Public | Retrieve blog posts with pagination/filters |
| `GET` | `/api/export/patients` | Admin | Download styled Excel `.xlsx` patient registry |
| `POST` | `/api/notifications/subscribe` | Private | Subscribe device to Web Push Notifications |
| `POST` | `/api/notifications/send` | Admin | Dispatch targeted/broadcast push notification |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [Issues page](https://github.com/Yash-Virugama/PhysioCare/issues).

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Yash Virugama**
- 🌐 GitHub: [@Yash-Virugama](https://github.com/Yash-Virugama)
- 📧 Email: virugamayash25@gmail.com
- 🔗 LinkedIn: [Yash Virugama](https://linkedin.com/in/Yash-Virugama)
