// Medix HMS - Validation Utilities

export const isValidEmail = (email) => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

export const isValidPhone = (phone) => {
  if (!phone) return false;
  // Indian phone number checks: 10 digits with optional +91 and spaces
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return /^(\+91)?[6-9]\d{9}$/.test(cleaned);
};

export const isNonEmpty = (value) => {
  if (value === null || value === undefined) return false;
  return String(value).trim().length > 0;
};

export const isPositiveNumber = (value) => {
  const num = Number(value);
  return !isNaN(num) && num >= 0;
};
