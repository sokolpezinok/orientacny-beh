import { Storage } from "./storage";

export const parseDates = (dates) => {
  // Converts each entry in the provided array to a Date object
  // and sets the time to the start of the day (midnight).
  return dates.map((date) => new Date(date).setHours(0, 0, 0, 0));
};

export const getFirstEntry = (entries) => {
  return Math.min(...parseDates(entries));
};

/**
 * Checks if first entry in the provided array is expired.
 */
export const isFirstEntryExpired = (entries) => {
  // entry is never expired if no date is present
  // for compatibility reasons with web version
  if (entries.length === 0) {
    return false;
  }

  return getFirstEntry(entries) < new Date().setHours(0, 0, 0, 0);
};

export const getLastEntry = (entries) => {
  return Math.max(...parseDates(entries));
};

/**
 * Checks if last entry in the provided array is expired.
 */
export const isLastEntryExpired = (entries) => {
  // entry is never expired if no date is present
  // for compatibility reasons with web version
  if (entries.length === 0) {
    return false;
  }

  return getLastEntry(entries) < new Date().setHours(0, 0, 0, 0);
};

/**
 * Sorts array alphabetically by function if provided.
 *
 * @param {Array} array
 * @param {function} func
 * @returns {Array}
 */
export const sort = (array, func = null) =>
  array.sort((a, b) => {
    if (func !== null) {
      a = func(a);
      b = func(b);
    }

    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });

export const unixTime = () => Math.floor(Date.now() / 1000);

export const isTokenExpired = () => Storage.pull().tokenExpiration < unixTime();
