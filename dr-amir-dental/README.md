# Dr. Aamir Mustafa Dental Care — Premium Dental Management System

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-10-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?logo=cloudinary)](https://cloudinary.com/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.0-EF4444?logo=turborepo)](https://turbo.build/)

A state-of-the-art dental clinic management system designed for **Dr. Aamir Mustafa**. This project features a high-performance website for patients and a robust administration panel for clinic management, built with modern web technologies and a focus on premium aesthetics.

---

## 🚀 Technologies Used

### Frontend & Frameworks
- **Next.js (App Router)**: Hybrid static & server rendering for SEO and speed.
- **TypeScript**: Type-safe development across the entire monorepo.
- **Tailwind CSS**: Custom design system with glassmorphism and dark mode support.
- **Framer Motion**: Smooth, high-end animations and transitions.
- **Lucide React**: Clean and consistent iconography.

### Backend & Infrastructure
- **Firebase Firestore**: Real-time database for appointments, blog, and clinic config.
- **Firebase Storage**: Secure file handling.
- **Cloudinary**: High-performance image optimization for medical before/after galleries.
- **Turborepo**: High-performance build system for the monorepo structure.

---

## 🛠️ Project Structure

```text
dr-aamir-mustafa-dental/
├── apps/
│   ├── website/      # Patient-facing portal (SEO optimized)
│   └── admin/        # Clinic staff dashboard (Private)
├── packages/
│   ├── firebase/     # Shared Firebase services & models
│   ├── theme/        # Shared Design System & UI tokens
│   ├── types/        # Shared TypeScript interfaces
│   ├── ui/           # Shared React components library
│   └── utils/        # Common utility functions
└── scripts/          # Build and maintenance scripts
```

---

## ⚙️ Setup Guide

### 1. Prerequisites
- **Node.js**: v18.x or later
- **pnpm**: v9.x or later (Preferred)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/shumailamustafa/Amir-s-Clinic.git
cd Amir-s-Clinic
pnpm install
```

### 3. Environment Variables
Create a `.env.local` file in the root (and in `apps/website` and `apps/admin` if needed) with the following:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset

# Admin Credentials
ADMIN_EMAIL=admin@draamirmustafa.com
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret
```

### 4. Running Locally
Start the development server for all apps concurrently:
```bash
pnpm dev
```
- **Website**: [http://localhost:3000](http://localhost:3000)
- **Admin**: [http://localhost:3001](http://localhost:3001)

---

## ✨ Key Features
- **Dynamic Booking**: Real-time appointment scheduling with admin-controlled slots.
- **Before/After Gallery**: Medical-grade image comparison for dental procedures.
- **Clinic Config**: Manage address, maps, social links, and holiday modes instantly.
- **SEO Optimized**: Advanced metadata and JSON-LD schema for local search ranking.
- **Responsive Design**: Flawless experience across Mobile, Tablet, and Desktop.

---

## 📝 License
Proprietary and Confidential. Built with ❤️ for **Dr. Aamir Mustafa Dental Care**.
