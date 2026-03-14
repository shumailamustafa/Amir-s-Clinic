// ============================================
// Dr. Amir Dental Clinic — Shared Type Definitions
// ============================================

// ---------- Enums ----------

export type PaymentMethod = 'cash' | 'online';

export type PaymentStatus =
  | 'pending'
  | 'screenshot_submitted'
  | 'confirmed'
  | 'rejected';

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export type BlogStatus = 'draft' | 'published' | 'scheduled';

export type MessageStatus = 'unread' | 'read' | 'replied';

// ---------- Open Hours ----------

export interface DayHours {
  open: string;
  close: string;
  isOpen: boolean;
}

export interface OpenHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

// ---------- Social Links ----------

export interface SocialLinks {
  instagram: string;
  facebook: string;
  linkedin: string;
  youtube: string;
}

// ---------- Map Coordinates ----------

export interface MapCoordinates {
  lat: number;
  lng: number;
}

// ---------- Clinic Config ----------

export interface ClinicConfig {
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapCoordinates: MapCoordinates;
  socialLinks: SocialLinks;
  openHours: OpenHours;
  holidayDates: string[];
  holidayMode: boolean;
  emergencyMessage?: string;
  galleryImages?: string[];
  appointmentSlots?: string[];
  maxDaysAhead?: number;
}

// ---------- Service ----------

export interface BeforeAfterImage {
  before: string;
  after: string;
}

export interface Service {
  id: string;
  name: string;
  iconName?: string;
  description: string;
  procedureSteps: string[];
  estimatedTime: string;
  priceMin: number;
  priceMax: number;
  imageUrl: string;
  beforeAfterImages: BeforeAfterImage[];
  isVisible: boolean;
  order: number;
  createdAt: string;
}

// ---------- Appointment ----------

export interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  email: string;
  serviceId: string;
  date: string;
  timeSlot: string;
  referenceNumber: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentScreenshotUrl: string;
  status: AppointmentStatus;
  notes: string;
  createdAt: string;
}

// ---------- Review ----------

export interface Review {
  id: string;
  patientName: string;
  phone: string;
  rating: number;
  reviewText: string;
  referenceNumber: string;
  status: ReviewStatus;
  adminReply: string;
  createdAt: string;
}

// ---------- Blog Post ----------

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImageUrl: string;
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  status: BlogStatus;
  scheduledAt: string;
  publishedAt: string;
  createdAt: string;
}

// ---------- Message ----------

export interface Message {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
}

// ---------- Doctor Profile ----------

export interface Education {
  institution: string;
  degree: string;
  year: string;
}

export interface Experience {
  place: string;
  role: string;
  duration: string;
}

export interface Skill {
  name: string;
  percentage: number;
}

export interface Achievement {
  title: string;
  icon: string;
}

export interface DoctorProfile {
  name: string;
  title: string;
  bio: string;
  profileImageUrl: string;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  achievements: Achievement[];
  languages: string[];
}
