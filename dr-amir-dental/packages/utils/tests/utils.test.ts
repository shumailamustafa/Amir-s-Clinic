import { describe, it, expect } from 'vitest';
import { formatDate, generateReferenceNumber, validateEmail } from '../src';

describe('utils', () => {
  describe('formatDate', () => {
    it('formats a date string correctly', () => {
      const dateString = '2024-03-15T10:00:00Z';
      expect(formatDate(dateString)).toContain('2024');
    });
  });

  describe('generateReferenceNumber', () => {
    it('generates a string of expected format', () => {
      const ref = generateReferenceNumber();
      expect(ref.startsWith('DA-')).toBe(true);
      expect(ref.length).toBeGreaterThan(10);
    });
  });

  describe('validateEmail', () => {
    it('returns true for valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    it('returns false for invalid emails', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@.com')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
    });
  });
});
