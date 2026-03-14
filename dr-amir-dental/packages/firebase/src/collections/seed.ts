import { getDb } from '../config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { ClinicConfig } from '@dental/types';

const COLLECTION = 'clinicConfig';
const DOC_ID = 'main';

export async function seedClinicConfig() {
  const ref = doc(getDb(), COLLECTION, DOC_ID);
  const snap = await getDoc(ref);
  
  if (!snap.exists()) {
    console.log('Clinic config not found, seeding defaults...');
    const defaultConfig: ClinicConfig = {
      name: 'Dr. Amir Dental Care',
      tagline: 'Trusted Dentistry for a Lifetime of Smiles',
      phone: '0300-1234567',
      whatsapp: '923001234567',
      email: 'info@dramirdental.com',
      address: 'Clinic Address, City',
      mapCoordinates: { lat: 24.8607, lng: 67.0011 },
      socialLinks: {
        instagram: '',
        facebook: '',
        tiktok: '',
        linkedin: '',
        youtube: ''
      },
      openHours: {
        monday: { open: '10:00', close: '20:00', isOpen: true },
        tuesday: { open: '10:00', close: '20:00', isOpen: true },
        wednesday: { open: '10:00', close: '20:00', isOpen: true },
        thursday: { open: '10:00', close: '20:00', isOpen: true },
        friday: { open: '10:00', close: '20:00', isOpen: true },
        saturday: { open: '10:00', close: '16:00', isOpen: true },
        sunday: { open: '10:00', close: '20:00', isOpen: false }
      },
      holidayDates: [],
      holidayMode: false,
      emergencyMessage: 'Emergency Closure - Please contact us for details'
    };
    await setDoc(ref, defaultConfig);
    console.log('Clinic config seeded successfully.');
  } else {
    console.log('Clinic config already exists.');
  }
}
