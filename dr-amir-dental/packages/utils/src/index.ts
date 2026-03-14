import type { OpenHours, DayHours } from '@dental/types';

const DAY_NAMES: Array<keyof OpenHours> = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export function formatDate(dateString: string, locale = 'en-PK'): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-PK', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTimeSlot(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function generateReferenceNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = String(Math.floor(1000 + Math.random() * 9000));
  return `DA-${year}${month}${day}-${random}`;
}

export function isClinicOpen(
  openHours: OpenHours,
  holidayDates: string[],
  isHolidayModeOn: boolean,
  emergencyMessage?: string
): { isOpen: boolean; statusText: string } {
  if (isHolidayModeOn) {
    const message = emergencyMessage?.trim();
    return { isOpen: false, statusText: message && message.length > 0 ? message : 'Closed — Holiday' };
  }

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  if (holidayDates.includes(todayStr)) {
    return { isOpen: false, statusText: 'Closed — Holiday' };
  }

  const dayIndex = now.getDay();
  const dayName = DAY_NAMES[dayIndex];
  const todayHours: DayHours = openHours[dayName];

  if (!todayHours.isOpen) {
    const nextOpenDay = findNextOpenDay(openHours, dayIndex);
    return {
      isOpen: false,
      statusText: `Closed — Opens ${nextOpenDay}`,
    };
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = timeToMinutes(todayHours.open);
  const closeMinutes = timeToMinutes(todayHours.close);

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    return {
      isOpen: true,
      statusText: `Open Now — Closes at ${formatTimeSlot(todayHours.close)}`,
    };
  }

  if (currentMinutes < openMinutes) {
    return {
      isOpen: false,
      statusText: `Closed — Opens at ${formatTimeSlot(todayHours.open)}`,
    };
  }

  const nextOpenDay = findNextOpenDay(openHours, dayIndex);
  return {
    isOpen: false,
    statusText: `Closed — Opens ${nextOpenDay}`,
  };
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function findNextOpenDay(openHours: OpenHours, currentDayIndex: number): string {
  for (let i = 1; i <= 7; i++) {
    const nextIndex = (currentDayIndex + i) % 7;
    const dayName = DAY_NAMES[nextIndex];
    if (openHours[dayName].isOpen) {
      if (i === 1) return `Tomorrow at ${formatTimeSlot(openHours[dayName].open)}`;
      return `${capitalize(dayName)} at ${formatTimeSlot(openHours[dayName].open)}`;
    }
  }
  return 'soon';
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function validatePhone(phone: string): boolean {
  const pattern = /^03\d{2}-?\d{7}$/;
  return pattern.test(phone.replace(/\s/g, ''));
}

export function truncateText(text: string, maxLength = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
export * from './logger';
export * from './errorFormatter';
