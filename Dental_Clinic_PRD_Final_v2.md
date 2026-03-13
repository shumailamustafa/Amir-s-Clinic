# Dental Clinic Website — Final Product Requirements Document (PRD)
**Version:** 2.0 (Final)
**Project:** Dr. Amir's Dental Clinic Website
**Prepared by:** Shumaila
**Date:** March 2026
**Status:** Ready for Development

---

## Table of Contents
1. Project Overview
2. Design & Theme System (Light + Dark Mode)
3. Website Structure & Functionality (7 Tabs)
4. Admin Panel Requirements
5. Technology Stack
6. SEO & Legal Requirements
7. Content Checklist
8. UI Concept Prompts (Per Tab)
9. Development Priorities & Roadmap

---

## Section 1 — Project Overview

### Goal
Build a fully professional, single-page scrollable dental clinic website for Dr. Amir's clinic. The website must serve two audiences simultaneously:

- **Patients:** Easy access to clinic info, booking appointments, checking open/closed status, reading about services, leaving reviews, and contacting the clinic.
- **Admin/Doctor:** Full control over every piece of content, schedule, and data through a dedicated Admin Panel — no coding required.

### Reference Websites
- Design reference: https://www.markmurphydds.com/
- Blog layout reference: https://www.rivervalleyendo.com/blog

### Core User Journey
> A patient opens the website → sees the clinic is Open → reads about the doctor → picks a service → books an appointment with online payment → receives a confirmation SMS/Email → shows up on time.

---

## Section 2 — Design & Theme System

### 2.1 Layout
- Single-page scrollable website
- 7 navigation tabs — auto-switch on scroll, also manually clickable
- Fully responsive: Mobile, Tablet, Desktop
- Smooth CSS transitions (300ms) between all interactions
- Framer Motion for animations throughout

### 2.2 Light Mode — Primary Theme (Clean Blue & White) ⭐ Recommended

| Element | Value |
|---|---|
| Primary Color | #0D6EFD |
| Background | #FFFFFF |
| Surface / Cards | #E8F4FD |
| Text (Primary) | #1A1A2E |
| Text (Secondary) | #555555 |
| Nav / Header | #FFFFFF |
| Border / Divider | #D0D7E3 |
| Open Status | #27AE60 |
| Closed Status | #C0392B |
| Button Hover | #0B5ED7 |
| Footer Background | #1A1A2E |

### 2.3 Dark Mode — Color Palette

| Element | Value |
|---|---|
| Background | #0F1117 |
| Surface / Cards | #1A1F2E |
| Primary Accent | #4D9FFF |
| Text (Primary) | #E8EAF0 |
| Text (Secondary) | #9AA0B4 |
| Nav / Header | #141824 |
| Border / Divider | #2A2F42 |
| Open Status | #2ECC71 |
| Closed Status | #E74C3C |
| Button Hover | #6AB0FF |
| Footer Background | #0A0D14 |

### 2.4 Dark Mode Implementation Rules
- Toggle button fixed in navbar (sun/moon icon)
- User preference saved in **localStorage** — persists across visits
- CSS variables used for all colors — single toggle switches entire site
- Smooth transition: `transition: background-color 300ms ease, color 300ms ease`
- All animated elements (floating teeth, status box) must adapt to dark mode
- Images use slight opacity reduction (0.85) in dark mode for visual comfort

### 2.5 Typography
- Font: **Inter** (Google Fonts) — clean, modern, medical feel
- Headings: Inter Bold (700)
- Body: Inter Regular (400)
- Accent text: Inter SemiBold (600)

### 2.6 Animations
- Floating teeth/dental tools in background: CSS keyframe animation, subtle, slow (8-12s loop)
- Clinic name entrance: fade-in + slide-up (Framer Motion)
- Tab transitions: smooth horizontal slide
- Service cards: hover lift effect (translateY -4px + shadow)
- Open/Closed badge: pulse animation on the colored dot

---

## Section 3 — Website Structure & Functionality

### Tab 1 — Home Page

**Purpose:** First impression — communicate trust, status, and CTA immediately.

**Features:**
- Animated clinic name: "Dr. Amir Dental Care" — fade-in + scale entrance
- Short tagline below name (e.g. "Your Smile, Our Priority")
- Floating animated teeth/dental imagery in background (translucent, subtle)
- Animated images on the side of Text of happy patients, or we should show the Animated Teeth or dental related images. Pick Refrence website for this.
- **Open/Closed Status Box** (admin-controlled):
  - Auto-updates based on admin-set timestamps in Firebase
  - OPEN state: Green badge + pulsing dot + "Open Now — Closes at 8:00 PM"
  - CLOSED state: Red badge + "Closed — Opens Tomorrow at 10:00 AM"
- **Hero CTA Button:** "Book an Appointment Now" → scrolls to Tab 4
- Navbar with dark mode toggle (sun/moon icon, top right)

**Admin Controls:**
- Set daily open/close times
- Set special holiday closures
- Edit tagline text
- Edit Name as wel

---

### Tab 2 — About

**Purpose:** Build credibility for doctor and establish clinic identity.

**Two Sub-Tabs:**

#### Sub-Tab A — About the Doctor
- Doctor full name and title (e.g. BDS, RDS)
- Professional profile photo (circular, blue border)
- Education timeline (cards with institution, degree, year)
- Work experience timeline
- Skills with visual progress bars (e.g. Cosmetic Dentistry 95%)
- Achievements & certifications (icon + text badges)
- Languages spoken

#### Sub-Tab B — About the Clinic
- Clinic name and founding year
- Short clinic description paragraph
- Clinic working hours table (Mon–Sat with times, Sunday: Closed)
- Physical address with copy button
- Clinic photos gallery (horizontal scroll, 4-6 photos)
- **Integrated Google Map** — clicking opens full Google Maps with clinic pin

**Admin Controls:**
- Edit all doctor information
- Update profile photo (via Cloudinary)
- Edit clinic hours
- Edit all Clinic Information
- Add/remove gallery photos
- Update map coordinates

---

### Tab 3 — Services

**Purpose:** Showcase expertise, build confidence, inform patients.

**Features:**
- Section heading: "Our Services"
- Grid of service cards (3 columns desktop, 1 column mobile):
  - Each card: dental illustration, service name, one-line description, "View Details" button
- **Services included:**
  - Tooth Implant
  - Root Canal Treatment
  - Scaling & Cleaning
  - Aesthetic Crowns
  - Teeth Whitening
  - Orthodontics / Braces
  - (More addable from Admin Panel)
- Clicking "View Details" opens a **modal popup** containing:
  - Service name & icon
  - Full description
  - Step-by-step procedure
  - Estimated time required
  - Price range (e.g. PKR 5,000 – 8,000)
  - Doctor's specific expertise note
  - Before & After photos (2 images side by side)
- **"Why Choose Us?" strip** between service grid and footer:
  - Painless Procedures
  - Modern Equipment
  - 10+ Years Experience
  - Certified Specialist
  - Flexible Appointments

**Admin Controls:**
- Add / edit / delete services
- Upload service images and before/after photos (Cloudinary)
- Edit prices, procedure steps, time estimates
- Toggle service visibility

---

### Tab 4 — Appointments

**Purpose:** Allow patients to self-book without calling the clinic.

**Features:**
- Monthly calendar widget
  - Available dates: blue highlight
  - Booked/unavailable dates: greyed out
  - Selected date: circled
- Time slot grid (after selecting date):
  - Available slots: white with blue border + selectable
  - Booked slots: grey, not clickable
  - Morning (10am–1pm) and Evening (5pm–8pm) sections
- Patient booking form:
  - Full Name
  - Phone Number (Pakistani format: 03XX-XXXXXXX)
  - Email Address (optional)
  - Service selection dropdown
  - Notes/special requests (optional)
- **Payment options:**
  - Cash (pay at clinic) — book without payment
  - Online Payment via **JazzCash** or **EasyPaisa** — advance payment confirms slot
- "Confirm Appointment" button
- After booking: confirmation screen with reference number
- **Automated notifications:**
  - SMS confirmation immediately after booking
  - Email confirmation (if email provided)
  - 24-hour reminder SMS before appointment
- **Reschedule / Cancel:** Patient enters reference number to manage booking
  - Cancellation policy shown: "Advance payments are non-refundable if cancelled within 24 hours of appointment"

**Admin Controls:**
- Set available days and time slots
- Block holidays, personal days, lunch breaks
- View all upcoming appointments in a dashboard calendar
- Mark appointments as completed / no-show
- Set slot duration (e.g. 30 min or 45 min per patient)
- Enable/disable online payment
- View payment status per appointment

---

### Tab 5 — Patient Reviews & Complaints

**Purpose:** Build social proof and give doctor feedback channel.

**Features:**
- Top section: average star rating display (e.g. "4.8 / 5.0") with total count
- Grid of approved review cards:
  - Patient first name (last name hidden for privacy)
  - Star rating (gold stars)
  - Review date
  - Review text
  - Blue left-border accent
- "Leave a Review" form:
  - Interactive star selector (click to rate)
  - Review text area
  - Patient name
  - Phone number (required for spam protection — not shown publicly)
  - OR appointment reference number
- Reviews go to Admin Panel for approval before appearing publicly
- **Spam protection:** Phone number or valid reference number required to submit

**Admin Controls:**
- View all submitted reviews (pending, approved, rejected)
- Approve or reject each review
- Reply to reviews (reply shown publicly below review)
- Toggle: show reviews publicly or keep internal only

---

### Tab 6 — Blog

**Purpose:** Establish authority, improve SEO, educate patients.

**Features:**
- Page heading: "Health Tips & News"
- Category filter pills: All | Oral Hygiene | Procedures Explained | Clinic News
- Blog post grid (3 cards per row, desktop):
  - Featured image
  - Category tag (colored pill)
  - Post title (bold)
  - Short excerpt (2 lines)
  - Date published
  - "Read More" link
- Clicking a post opens full article page with:
  - Full featured image
  - Title, author (Dr. Amir), date
  - Full article content
  - Related posts section at bottom
- Reference layout: https://www.rivervalleyendo.com/blog

**Admin Controls:**
- Create / edit / delete blog posts (rich text editor)
- Upload featured images (Cloudinary)
- Set category per post
- Set SEO meta title and meta description per post
- Schedule posts for future publishing
- Toggle post visibility (draft / published)

---

### Tab 7 — Contact & Send a Message

**Purpose:** Give patients multiple easy ways to reach the doctor.

**Features:**
- Left column — Contact Info:
  - Clinic phone number (with click-to-call)
  - Email address
  - WhatsApp number (click to open chat)
  - Physical address
  - Social media links with icons:
    - Instagram
    - Facebook
    - TikTok
    - LinkedIn
    - YouTube (if applicable)
- Right column — "Send a Message" form:
  - Full Name
  - Phone Number
  - Email Address
  - Message text area
  - Google reCAPTCHA v3 (spam protection)
  - "Send Message" button
- Submitted messages appear in Admin Panel inbox
- Admin can reply via email or phone from panel
- **Floating WhatsApp button** — fixed bottom-right corner, visible on ALL pages
  - Green circle with WhatsApp icon
  - Subtle bounce animation
  - Opens WhatsApp chat directly with pre-filled message: "Hello Dr. Amir, I have a question..."

**Admin Controls:**
- Update all contact info from panel
- Update social media links
- Read and manage all contact messages
- Mark messages as read / replied

---

## Section 4 — Admin Panel Requirements

### 4.1 Access
- Totaly Seperate Website for admin
- Local Login for now

### 4.2 Admin Dashboard (Home Screen)
Stats displayed at a glance:
- Today's appointments count
- Pending appointments count
- Unread messages count
- New reviews awaiting approval
- Clinic status (Open/Closed) with quick toggle

### 4.3 Admin Panel Sections
1. **Dashboard** — overview stats
2. **Clinic Status** — set open/close times, holiday mode
3. **Appointments** — calendar view, list view, manage all bookings
4. **Services** — add/edit/delete services, images, prices
5. **About** — edit doctor info, clinic info, photos
6. **Reviews** — approve/reject/reply to reviews
7. **Blog** — create/manage blog posts
8. **Messages** — inbox for contact form submissions
9. **Settings** — update contact info, social links, payment settings

---

## Section 5 — Technology Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend Framework | React.js (Vite) | Fast SPA, component-based, great for scroll+animations |
| Styling | Tailwind CSS | Rapid utility-first styling, dark mode with `dark:` prefix |
| Animations | Framer Motion | Professional page transitions, entrance animations |
| Database | Firebase Firestore | Real-time sync — open/close, appointments, messages |
| Authentication | Firebase Auth | Secure admin login, optional 2FA |
| Image Storage | Cloudinary | Doctor photos, service images, blog images |
| Payments | JazzCash + EasyPaisa API | Most widely used payment methods in Pakistan |
| Hosting | Firebase Hosting / Vercel | Free tier, fast CDN, easy CI/CD deploy |
| Maps | Google Maps Embed API | Clinic location with clickable pin |
| Email Notifications | EmailJS or Firebase Functions + Nodemailer | Booking confirmation emails |
| Analytics | Google Analytics 4 | Track visitors, popular pages, booking conversions |
| SEO | React Helmet Async | Dynamic meta tags per page/section |

### 5.1 Why NOT These Technologies
- **React Native** — This is for mobile apps, NOT websites
- **Flutter Web** — Poor SEO, not recommended for content websites
- **Plain HTML/CSS** — Harder to maintain, no component reuse for admin panel
- **WordPress** — Mentioned as alternative but harder to customize for real-time features

---

## Section 6 — SEO & Legal


### 6.2 SEO Requirements
- Page title format: "Dr. Amir Dental Care — [Section Name] | Hyderabad"
- Meta description per section (max 160 characters)
- Local Business Schema markup (JSON-LD) for Google
- Open Graph tags for social media sharing
- Sitemap.xml generated automatically
- All images have alt text
- Mobile-first indexing compliant

### 6.3 Legal Pages Required
- **Privacy Policy page** — explains what patient data is collected and how it is used
- **Terms of Service** — appointment cancellation policy, refund policy
- Cancellation Policy text (shown in Appointments tab):
  > "Advance payments are non-refundable if the appointment is cancelled within 24 hours of the scheduled time. Rescheduling is free if done 24+ hours in advance."

### 6.4 Accessibility
- Minimum contrast ratio 4.5:1 (WCAG AA)
- All buttons have aria-labels
- Keyboard navigable
- Alt text on all images

---

## Section 7 — Content Checklist

The following content must be provided by the doctor/admin before development is complete:

### Doctor Information
- [ ] Full name and professional title (BDS, RDS, etc.)
- [ ] Professional headshot photo (high resolution)
- [ ] Education history (institution, degree, year)
- [ ] Work experience history (clinic/hospital, role, years)
- [ ] Skills list with self-rating
- [ ] Achievements and certifications list
- [ ] Languages spoken

### Clinic Information
- [ ] Official clinic name
- [ ] Physical address (complete with city, area)
- [ ] Google Maps Plus Code or exact coordinates
- [ ] Working hours (each day of week)
- [ ] Clinic phone number
- [ ] WhatsApp number
- [ ] Email address
- [ ] Clinic interior/exterior photos (minimum 4, high resolution)
- [ ] Social media handles (Instagram, Facebook, TikTok, LinkedIn)

### Services
- [ ] Complete list of services offered
- [ ] Description, procedure steps, time, and price for each service
- [ ] Service illustration or photo for each
- [ ] Before & After photos for applicable services (optional but recommended)

### Domain & Branding
- [ ] Domain name decided and registered (e.g. amirdentalcare.pk)
- [ ] Logo designed or existing logo file provided (PNG with transparent background)
- [ ] Favicon (32x32 px icon)

### Payment Setup
- [ ] Local Payment We show the Number to send the ammount and submit the screen shot of payment, that SS will be verified by admin and payment will be confirmed. then his slot was confrimed any when any payment will be done. and SS should be uploded admin recive the email for the payment confirmation. and when admin confirm the payment then slot will be confirmed and that particular user will recive the email for the confirmation of payment and slot.

---

## Section 8 — UI Concept Prompts (For AI Image Generation)

Use these prompts in **Leonardo.ai**, **Microsoft Designer**, or **Midjourney** to generate concept UI mockups.

### Prompt — Tab 1: Home Page (Light Mode)
```
Design a professional dental clinic website homepage UI mockup. Clean Blue and White theme. Primary color #0D6EFD, white background. Top navigation bar with 7 tabs: Home, About, Services, Appointments, Reviews, Blog, Contact. Dark mode toggle (sun icon) top right. Center hero section: large animated clinic name "Dr. Amir Dental Care" in bold blue, small tagline below. Glowing green pulsing badge "Open Now — Closes at 8:00 PM". Large blue CTA button "Book an Appointment Now". Background has soft floating translucent teeth and dental tool illustrations. Modern minimal medical aesthetic. Desktop web UI mockup, flat design, high fidelity.
```

### Prompt — Tab 1: Home Page (Dark Mode)
```
Design a professional dental clinic website homepage UI mockup. Dark mode. Background #0F1117, card surfaces #1A1F2E, primary accent #4D9FFF, text #E8EAF0. Top navigation bar with 7 tabs. Moon icon (dark mode active) top right. Center hero: large glowing clinic name in accent blue, tagline below. Green pulsing "Open Now" badge. Blue CTA button. Background has soft floating translucent teeth illustrations in dark tones. Modern minimal medical aesthetic. Desktop web UI mockup, flat design, high fidelity.
```

### Prompt — Tab 2: About Page — Doctor Sub-Tab
```
Design a dental clinic About Doctor page UI concept. Clean Blue and White theme, #0D6EFD primary. Two sub-tabs at top: "About Doctor" (active) and "About Clinic". Left side: large circular doctor profile photo with blue ring border, doctor name bold, title "BDS, RDS" in grey. Right side: vertical education timeline with institution cards, skills section with horizontal progress bars (Cosmetic Dentistry 95%, Implants 90%), achievement badge icons row. Clean card-based layout, white cards with soft blue shadows. Desktop web UI mockup, flat design.
```

### Prompt — Tab 2: About Page — Clinic Sub-Tab
```
Design a dental clinic About Clinic page UI concept. Clean Blue and White theme. Sub-tab "About Clinic" is active. Top: clinic name as bold heading, short description paragraph. Middle: horizontal photo gallery row (4 clinic interior photos). Below gallery: working hours table (Mon-Sat with times) on the left, physical address with copy icon on the right. Bottom: full-width embedded Google Maps view with a red pin on clinic location. White background, #0D6EFD blue accents, soft card shadows. Desktop web UI mockup, flat design.
```

### Prompt — Tab 3: Services Page
```
Design a dental clinic Services page UI concept. Clean Blue and White theme. Page heading "Our Services" bold. Below: 3x2 grid of service cards. Each card: dental vector illustration top, service name bold, one-line description, blue "View Details" button. One card shows an open modal popup overlay: service name, procedure steps list, time badge "45 min", price range "PKR 5,000-8,000", before/after photos side by side. Below grid: horizontal strip "Why Choose Us" with 5 icon+text badges: Painless, Modern Equipment, 10+ Years, Certified, Flexible. White cards, blue accents, subtle shadows. Desktop UI mockup, flat design.
```

### Prompt — Tab 4: Appointments Page
```
Design a dental clinic appointment booking page UI concept. Clean Blue and White theme. Left half: monthly calendar widget, available dates blue-highlighted, booked dates grey, selected date in blue circle. Right half: time slot grid with "Morning" and "Evening" sections, available slots white-blue-bordered, booked slots grey. Below: patient form fields — Name, Phone, Service dropdown, Notes. Payment section: two option cards "Cash at Clinic" and "Online Payment — JazzCash / EasyPaisa" with logos. Large blue "Confirm Appointment" button. Clean minimal layout, #0D6EFD blue, white background. Desktop UI mockup, flat design.
```

### Prompt — Tab 5: Reviews Page
```
Design a dental clinic patient reviews page UI concept. Clean Blue and White theme. Top center: large "4.8" rating number, 5 gold stars, "Based on 124 reviews" text. Below: 3-column grid of review cards, each with patient first name, gold star row, review date, review text paragraph, subtle blue left-border accent line. Bottom section: "Leave a Review" form — interactive star selector (5 clickable stars), text area, name field, phone field, blue "Submit Review" button. White background, gold stars, blue accents. Desktop UI mockup, flat design.
```

### Prompt — Tab 6: Blog Page
```
Design a dental clinic blog listing page UI concept. Clean Blue and White theme. Heading "Health Tips & News" bold. Below heading: horizontal category pill filters — All (active, blue filled), Oral Hygiene, Procedures, Clinic News (outlined). Main content: 3-column blog card grid. Each card: featured image top, blue category tag pill, bold post title, 2-line excerpt text, date and "Read More" blue text link. Clean white cards with soft shadows, blue accents #0D6EFD. Desktop UI mockup, flat design.
```

### Prompt — Tab 7: Contact Page
```
Design a dental clinic contact page UI concept. Clean Blue and White theme. Left column: "Contact Us" heading. Below: contact info rows — phone (click to call icon), email, WhatsApp, address. Social media icons row: Instagram, Facebook, TikTok, LinkedIn with blue circular backgrounds. Right column: "Send a Message" form — Name, Phone, Email, Message textarea, blue "Send Message" button. Bottom right corner: floating green circular WhatsApp button with subtle bounce. White background, #0D6EFD blue, clean layout. Desktop UI mockup, flat design.
```

### Dark Mode Suffix (Add to ANY prompt above)
```
Convert to dark mode: Background #0F1117, card surfaces #1A1F2E, primary accent #4D9FFF, text color #E8EAF0, borders #2A2F42, green status #2ECC71, red status #E74C3C.
```

---

## Section 9 — Development Priorities & Roadmap

### Phase 1 — Foundation (Week 1-2)
- Project setup: React + Vite + Tailwind + Firebase
- Routing structure and navigation skeleton
- Dark/Light mode system (CSS variables + localStorage)
- Firebase project setup (Firestore, Auth, Hosting)
- Cloudinary account setup
- Admin panel authentication

### Phase 2 — Core Pages (Week 3-4)
- Home page (animated hero, open/close status)
- About page (doctor + clinic sub-tabs, Google Map)
- Services page (grid + modal popup)
- Admin panel: Services management

### Phase 3 — Appointments (Week 5-6)
- Calendar and time slot system
- Firebase real-time slot management
- Booking form + confirmation screen
- JazzCash / EasyPaisa payment integration
- SMS/Email notification setup

### Phase 4 — Community & Content (Week 7-8)
- Reviews system (submit + approval workflow)
- Blog system (listing + full article + categories)
- Contact form + Admin inbox
- WhatsApp floating button

### Phase 5 — Polish & Launch (Week 9-10)
- SEO implementation (React Helmet, schema markup)
- Privacy Policy and Terms of Service pages
- Performance optimization (lazy loading, image compression)
- Mobile responsiveness audit
- Cross-browser testing
- Domain setup and Firebase Hosting deploy
- Admin training session for doctor

---

*End of PRD — Version 2.0 Final*
*This document is ready to be given to an AI or developer for implementation planning.*
