/**
 * Capitalizes the first letter of a string.
 * @param {string} s The string to capitalize.
 * @returns {string} The capitalized string, or the original string if input is invalid.
 */
export const capitalize = (s) => {
  if (typeof s !== 'string' || s.length === 0) {
    return s; // Return original value if not a non-empty string
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
}; 