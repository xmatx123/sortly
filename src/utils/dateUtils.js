/**
 * Formats a timestamp or date string into a readable format (e.g., "Oct 27, 2023").
 * Handles both Firebase Timestamp objects and ISO date strings.
 * @param {object|string} dateInput - The Firebase Timestamp object or ISO date string.
 * @returns {string|null} The formatted date string, or null if input is invalid.
 */
export const formatDate = (dateInput) => {
  try {
    let dateObject = null;

    // Check if it's likely a Firebase Timestamp (has toDate method)
    if (dateInput && typeof dateInput.toDate === 'function') {
      dateObject = dateInput.toDate();
    }
    // Check if it's a string (likely an ISO string from localStorage)
    else if (typeof dateInput === 'string') {
      dateObject = new Date(dateInput);
      // Check if the parsed date is valid
      if (isNaN(dateObject.getTime())) {
          console.warn("formatDate received an invalid date string:", dateInput);
          return "Invalid Date";
      }
    }
    // Check if it's already a Date object
    else if (dateInput instanceof Date) {
        dateObject = dateInput;
    }

    // If we couldn't create a valid Date object, return null or an indicator
    if (!dateObject) {
      console.warn("formatDate received an invalid input:", dateInput);
      return "Unknown Date"; // Or return null
    }

    // Format the valid Date object
    return dateObject.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  } catch (error) {
    console.error("Error formatting date:", dateInput, error);
    return "Date Error"; // Indicate an error occurred during formatting
  }
}; 