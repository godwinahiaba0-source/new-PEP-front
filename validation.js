/**
 * Global Form Validation Utilities
 */
const Validator = {
  // Validates standard mobile money numbers (Ghana 10-digit format or international)
  isValidPhone(phone) {
    if (!phone) return false;
    const cleanPhone = phone.trim().replace(/[\s-]/g, '');
    return /^0[0-9]{9}$/.test(cleanPhone) || /^\+?[1-9]\d{1,14}$/.test(cleanPhone);
  },

  // Checks numerical thresholds (e.g. minimum deposit or withdrawal)
  isValidAmount(amount, min = 1) {
    const num = parseFloat(amount);
    return !isNaN(num) && isFinite(num) && num >= min;
  },

  // Ensures non-empty strings (passwords, usernames, transaction IDs)
  isNotEmpty(value) {
    return value !== null && value !== undefined && value.toString().trim().length > 0;
  },

  // Validates password length (e.g. minimum 6 characters)
  isValidPassword(password, minLength = 6) {
    return this.isNotEmpty(password) && password.length >= minLength;
  }
};