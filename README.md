# Dr. Amir's Dental Clinic — Comprehensive Documentation

Welcome to the official repository for **Dr. Amir's Dental Clinic**. This project is a modern, full-stack monorepo consisting of a highly animated, patient-facing website and an authenticated admin dashboard for managing clinic operations, appointments, reviews, services, and blog posts.

---

## 1. Project Overview

The system is designed to digitalize clinic management while providing a premium, interactive experience for patients. 

**Key Features (Website):**
- Animated landing page with modern UI (glassmorphism, smooth scroll, entry animations).
- Real-time clinic status (open/closed, working hours).
- Service browsing and dynamic doctor profile.
- Appointment booking system directly integrated with Firebase.
- Blog and Patient Reviews section.

**Key Features (Admin Panel):**
- JWT-authenticated secure dashboard.
- Full CRUD operations for Services, Appointments, Messages, Reviews, and Blog Posts.
- Rich-text editor for blog creation.
- Live preview and real-time data sync with Firestore.

---

## 2. Full Tech Stack Explanation

The project utilizes a **Monorepo Architecture** powered by TurboRepo to maximize code reuse between the website and admin panel.

### Core Ecosystem
- **Package Manager:** `pnpm` (v9+)
- **Monorepo Tool:** `TurboRepo` (for fast, cached, concurrent builds)
- **Framework:** `Next.js 14` (App Router)
- **Language:** `TypeScript` (v5.3)

### Frontend & UI
- **Styling:** `Tailwind CSS 3.4`
- **Animations:** `Framer Motion` (complex page transitions, scroll animations)
- **Icons:** `Lucide React`
- **Component Library:** Custom UI package (`@dental/ui`) internal to the monorepo.

### State & Logic
- **Global State:** `Zustand`
- **Forms & Validation:** `React Hook Form` + `Zod` (strict type-safe schema validation)
- **Data Fetching/Sync:** Real-time Firebase listeners (`onSnapshot`)

### Backend & Database
- **Database:** `Firebase Firestore` (NoSQL Document database)
- **Storage:** `Firebase Storage` & `Cloudinary` (for optimized image hosting/delivery)
- **Authentication:** Custom JWT-based cookie auth for the Admin Panel (`jose` library)

---

## 3. Folder Structure

The project follows a standard TurboRepo workspace structure:

```text
dr-amir-dental/
├── apps/
│   ├── website/              # Patient-facing Next.js application
│   └── admin/                # Secure clinic management dashboard
├── packages/                 # Shared codebase used by both apps
│   ├── firebase/             # Firebase init, db config, and collection endpoints
│   ├── theme/                # Global CSS tokens, Tailwind config, fonts
│   ├── types/                # Shared TypeScript interfaces (Appointment, Service, etc.)
│   ├── ui/                   # Reusable React components (Buttons, Cards, Modals)
│   └── utils/                # Helper functions (date formatting, slugification)
├── .env.example              # Blueprint for environment variables
├── package.json              # Monorepo dependencies and workspace configs
└── turbo.json                # TurboRepo build pipeline definitions
```

---

## 4. Environment Variable Setup

Environment variables are managed consistently across the monorepo. You need to create `.env.local` files to connect the app to your backend services.

### Setup Process:
1. Copy the blueprint file:
   ```bash
   cp .env.example .env.local
   ```
2. For Next.js to read them properly during development inside apps, you should also copy the file to the app directories:
   ```bash
   cp .env.local apps/website/.env.local
   cp .env.local apps/admin/.env.local
   ```

### Required Variables (`.env.local`):

```env
# ========================================
# Firebase Configuration
# ========================================
NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key_here"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"

# ========================================
# Authentication (Admin Panel)
# ========================================
# Login credentials for the doctor/admin
ADMIN_EMAIL="admin@amirclinic.com"
ADMIN_PASSWORD="your-secure-password"

# Generate a random 32-character string for signing JWT tokens
JWT_SECRET="generate-a-very-long-random-secret-key-here"

# ========================================
# Additional Services (Optional but Recommended)
# ========================================
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_key"
CLOUDINARY_API_SECRET="your_secret"

# Used for generating full URLs in emails/sharing
NEXT_PUBLIC_WEBSITE_URL="http://localhost:3000"
NEXT_PUBLIC_ADMIN_URL="http://localhost:3001"
```

---

## 5. Firebase Configuration Guide

To power the real-time database and storage:

1. **Create a Firebase Project:** Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. **Register a Web App:** Click the `</>` icon to register your app. Copy the `firebaseConfig` object and paste the values into your `.env.local` file.
3. **Enable Firestore:**
   - Go to **Build > Firestore Database**.
   - Create the database in test mode (or configure strict security rules for production).
4. **Enable Storage:**
   - Go to **Build > Storage** and initialize it.
5. **Security Rules:** For production, ensure your Firestore rules restrict write access to authenticated admins, while keeping specific reads (services, blog, clinicConfig) public.

---

## 6. Complete Installation & Execution Guide

Follow these exact steps to run the application locally.

### Prerequisites
- Node.js version **20.x** or higher
- `pnpm` installed globally (`npm install -g pnpm`)
- Git

### Step-by-Step Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd "dr-amir-dental"
   ```

2. **Install all dependencies:**
   *(Since this is a TurboRepo using pnpm workspaces, a single install command resolves everything).*
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**
   - Follow the instructions in Section 4 to set up your `.env.local` files using your Firebase credentials.

4. **Start the Development Server:**
   ```bash
   pnpm dev
   ```
   *This command leverages TurboRepo to spin up both applications concurrently.*

5. **Access the Applications:**
   - **Main Website:** [http://localhost:3000](http://localhost:3000)
   - **Admin Panel:** [http://localhost:3001](http://localhost:3001)

---

## 7. Operational Checklist

Before declaring the deployment ready, verify the following:

- [ ] **Database Connection:** Open the website. Does the "About" section load without a Firebase crash?
- [ ] **Null Safety:** If Firestore collections are empty, the site should gracefully show empty states (e.g., empty arrays) rather than throwing `TypeError: Cannot read properties of undefined`.
- [ ] **Admin Login:** Attempt to log into `http://localhost:3001/login` using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` defined in `.env.local`.
- [ ] **Data Sync:** Add a new "Service" via the Admin panel. Verify that it appears instantly (without page refresh) on the live website to confirm Firestore `onSnapshot` subscriptions are working.
- [ ] **File Uploads:** Test uploading a profile picture or blog thumbnail to ensure Cloudinary/Firebase Storage permissions are correct.
- [ ] **Git Tracking Safeguard:** Run `git status` to ensure `.env.local` files are NOT being tracked to prevent secret leaks.

---

*Documentation auto-generated and maintained alongside the codebase.*
