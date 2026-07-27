# PhysioCare — Physiotherapy Clinic Management Platform

[![React 19](https://img.shields.io/badge/React-19.0-blue.svg?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg?logo=nodedotjs)](https://nodejs.org/)
[![Express.js 5](https://img.shields.io/badge/Express.js-5.0-black.svg?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS 4](https://img.shields.io/badge/TailwindCSS-v4.0-06B6D4.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Supported-5A0FC8.svg?logo=pwa)](https://web.dev/progressive-web-apps/)

**PhysioCare** is a modern, responsive full-stack web application designed for physiotherapy clinics and healthcare practices. Built with a decoupled **React 19** frontend and an **Express 5 / Node.js** backend, PhysioCare provides seamless healthcare resource sharing, appointment inquiry management, client testimonial moderation, web push notifications, progressive web app (PWA) capabilities, and formatted Excel report exports.

---

## 🌐 Live Demo

🚀 **Live Application:** [physiocare-therapy.vercel.app](https://physiocare-therapy.vercel.app)

> 🚧 **Project Status:** PhysioCare is currently under active development.

> ⚠️ **Render Free-Tier Notice:** The backend is deployed on Render's free tier, which may spin down the service during periods of inactivity. As a result, the initial request may experience a short delay while the server wakes up. Once active, the application should respond normally.

---

## ✨ Key Features

### 👤 Patient Experience

- **Patient Authentication**: Secure registration and login with JWT-based authentication and protected patient routes.
- **Password Recovery**: Email-based password reset workflow powered by **Nodemailer** with time-limited reset tokens.
- **Patient Dashboard**: Personalized dashboard for accessing account information, clinic resources, and patient-specific features.
- **Testimonial Submissions**: Authenticated patients can submit reviews directly from their dashboard for administrator approval.
- **Progressive Web App (PWA)**: Installable on supported desktop and mobile devices, with Service Worker caching for improved reliability and offline access.
- **Push Notifications**: Patients can subscribe their devices to receive clinic announcements and targeted notifications through the Web Push API.

### 🛡️ Admin Management Panel

- **Role-Based Access Control (RBAC)**: Separate Patient/Admin authorization with protected administrative routes and layouts.
- **Content Management**: Full CRUD functionality for managing clinic services, blog articles, tags, and downloadable healthcare resources.
- **Testimonial Moderation**: Review, approve, edit, or remove patient testimonials before they appear publicly.
- **Patient Management & Excel Reports**: View patient records and export formatted `.xlsx` reports using **ExcelJS**, including clinic headers, alternating row formatting, auto-filters, and frozen header rows.
- **Web Push Notification Center**: Send broadcast announcements or targeted notifications to individual patients using **VAPID-based Web Push (`web-push`)**.
- **Dynamic Clinic Settings**: Manage clinic branding, contact information, and operational settings dynamically through the admin panel.

---

## 🛠️ Tech Stack

| Category | Technology / Library | Purpose |
| --- | --- | --- |
| **Frontend** | React 19 | Component-based user interface |
| | Vite | Frontend development and build tooling |
| | Tailwind CSS v4 | Utility-first responsive styling |
| | React Router v7 | Client-side SPA routing |
| | React Hook Form + Zod | Form management and schema-based validation |
| | vite-plugin-pwa | PWA manifest and Service Worker integration |
| **Backend** | Node.js + Express.js 5 | RESTful API and server-side application |
| | MongoDB + Mongoose | NoSQL database and object data modeling |
| | JWT + HTTP-only Cookies | Authentication and session management |
| | ExcelJS | Server-side `.xlsx` report generation |
| | web-push | VAPID-based Web Push notification delivery |
| | Cloudinary | Cloud-based image and document storage |
| | Nodemailer | Transactional email and password recovery |
| **Security** | Helmet | HTTP security headers |
| | express-rate-limit | API rate limiting and abuse protection |
| | Zod | Server-side request payload validation |

---

## 📁 Project Structure

```text
Clinic/
├── client/                         # React + Vite frontend
│   ├── public/                     # Static assets and PWA resources
│   ├── src/
│   │   ├── api/                    # Axios instance and API services
│   │   ├── components/             # Reusable UI components
│   │   ├── context/                # Authentication and application state
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── layouts/                # Public, patient, and admin layouts
│   │   ├── pages/                  # Application pages
│   │   ├── routes/                 # Application route configuration
│   │   └── validations/            # Client-side Zod schemas
│   │
│   ├── vite.config.js              # Vite and PWA configuration
│   └── package.json
│
└── server/                         # Node.js + Express backend
    ├── src/
    │   ├── config/                 # Database and external service config
    │   ├── controllers/            # Request handlers and business logic
    │   ├── middlewares/            # Auth, validation, errors, rate limiting
    │   ├── models/                 # Mongoose schemas and models
    │   ├── routes/                 # REST API routes
    │   ├── scripts/                # Administrative utility scripts
    │   ├── utils/                  # Shared utilities and helpers
    │   └── validations/            # Server-side Zod schemas
    │
    ├── src/server.js               # Express application entry point
    └── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

Before running PhysioCare locally, make sure you have:

- **Node.js** v18 or later
- **MongoDB** or a MongoDB Atlas cluster
- **Git**
- A **Cloudinary** account for media storage
- VAPID keys for Web Push notifications
- Email credentials for Nodemailer

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Yash-Virugama/Clinic.git
cd Clinic
```

---

### 2️⃣ Backend Setup

Navigate to the backend directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000

MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/clinic_db

JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d

CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Cloudinary
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloud_api_key
CLOUD_API_SECRET=your_cloud_api_secret

# Web Push
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_SUBJECT=mailto:your_email@example.com

# Email / Nodemailer
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Initial Admin
ADMIN_NAME=admin_name
ADMIN_EMAIL=admin_email
ADMIN_PASSWORD=admin_password
ADMIN_PHONE=admin_phone
ADMIN_AGE=admin_age
ADMIN_GENDER=admin_gender
```

> **Important:** Never commit your actual `.env` file, passwords, API secrets, JWT secret, or VAPID private key to GitHub.

#### Seed an Admin Account

If required, create the initial administrator:

```bash
npm run seed:admin
```

#### Start the Backend

```bash
npm run dev
```

The API server will be available at:

```text
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_VAPID_PUBLIC_KEY=your_vapid_public_key
```

> The VAPID **public key** can be exposed to the frontend. Never expose `VAPID_PRIVATE_KEY` in your client environment variables.

Start the frontend:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## 📡 API Overview

The following table highlights some of the primary API endpoints.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Register a new patient |
| `POST` | `/api/auth/login` | Public | Authenticate user and set JWT cookie |
| `POST` | `/api/auth/logout` | Private | Log out the authenticated user |
| `GET` | `/api/auth/me` | Private | Get the authenticated user's profile |
| `POST` | `/api/auth/forgot-password` | Public | Request a password reset email |
| `PUT` | `/api/auth/reset-password/:token` | Public | Reset password using a valid token |
| `GET` | `/api/services` | Public | Retrieve clinic services |
| `POST` | `/api/services` | Admin | Create a clinic service |
| `GET` | `/api/blogs` | Public | Retrieve published blog articles |
| `GET` | `/api/resources` | Public | Retrieve published healthcare resources |
| `POST` | `/api/testimonials` | Patient | Submit a patient testimonial |
| `POST` | `/api/contact` | Public | Submit the clinic contact form |
| `GET` | `/api/export/patients` | Admin | Export patient records as an Excel workbook |
| `POST` | `/api/notifications/subscribe` | Private | Register a device for Web Push notifications |
| `POST` | `/api/notifications/send` | Admin | Send targeted or broadcast push notifications |

> Additional administrative endpoints are available for managing services, blogs, resources, testimonials, patients, contacts, notifications, and clinic settings.

---

## 🔐 Security

PhysioCare incorporates multiple security measures across the application:

- **JWT-based authentication**
- **HTTP-only authentication cookies**
- **Role-based authorization (Patient/Admin)**
- **Password hashing**
- **Helmet security headers**
- **API rate limiting**
- **Zod request validation**
- **Protected administrative endpoints**
- **Environment-based secret management**
- **Time-limited password reset tokens**

---

## 📱 Progressive Web App

PhysioCare is designed as a **Progressive Web App (PWA)**, allowing supported browsers to provide an app-like experience.

Key PWA capabilities include:

- Installable on supported desktop and mobile devices
- Web App Manifest integration
- Service Worker registration
- Cached application resources
- Offline access to selected content
- Web Push notification support
- Standalone app experience after installation

---

## 🔔 Web Push Notifications

PhysioCare uses the **Web Push API** and `web-push` package with **VAPID authentication**.

The notification system supports:

- Device subscription management
- Patient-specific notifications
- Broadcast clinic announcements
- Background notification delivery through Service Workers
- Administrative notification management
- Automatic handling of expired or invalid subscriptions

---

## 📊 Excel Report Generation

Administrators can export patient information as professionally formatted `.xlsx` reports generated server-side using **ExcelJS**.

Generated reports can include:

- Clinic-branded report headers
- Patient information
- Formatted column widths
- Alternating row formatting
- Auto-filters
- Frozen header rows
- Download-ready `.xlsx` output

---

## 🤝 Contributing

Contributions, suggestions, and issue reports are welcome.

If you would like to contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Commit your changes.
5. Push the branch.
6. Open a Pull Request.

You can also use the repository's **Issues** section to report bugs or suggest improvements.

---

## 📄 License

This project is licensed under the **[MIT License](LICENSE)**.

---

## 👨‍💻 Author

**Yash Virugama**

- **GitHub:** [@Yash-Virugama](https://github.com/Yash-Virugama)
- **LinkedIn:** [Yash Virugama](https://linkedin.com/in/yashvirugama)
- **Email:** virugamayash25@gmail.com

---

> **PhysioCare** — A modern physiotherapy clinic management platform combining patient care, administrative management, PWA capabilities, and Web Push notifications.
