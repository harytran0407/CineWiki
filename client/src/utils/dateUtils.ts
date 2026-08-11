/**
 * Safely calculates the number of days until the next birthday for a given birthday string (YYYY-MM-DD).
 * Parses dates without timezone shifts.
 */
export const calculateDaysToBirthday = (birthdayStr?: string): number | null => {
  if (!birthdayStr) return null;
  const parts = birthdayStr.split('-');
  if (parts.length < 3) return null;

  const birthMonth = parseInt(parts[1], 10) - 1; // 0-indexed month
  const birthDay = parseInt(parts[2], 10);

  if (isNaN(birthMonth) || isNaN(birthDay)) return null;

  const today = new Date();
  const currentYear = today.getFullYear();

  // Create birthday date object for current year in local time
  let nextBday = new Date(currentYear, birthMonth, birthDay);

  // Set today to start of day for accurate day diff comparison
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  if (nextBday < startOfToday) {
    nextBday.setFullYear(currentYear + 1);
  }

  const diffTime = nextBday.getTime() - startOfToday.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
