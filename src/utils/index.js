export const parseDates = (dates) => {
  // converts into date and removes time part.
  return dates.map((date) => new Date(date).setHours(0, 0, 0, 0));
};

export class EntriesHelper {
  constructor(entries) {
    this.entries = entries.map((child) => new Date(child).setHours(0, 0, 0, 0)).sort((a, b) => a - b);
    this.today = new Date().setHours(0, 0, 0, 0);
  }

  isExpired = () => this.entries.length !== 0 && this.entries.at(-1) < this.today;
  currentEntryIndex = () => this.entries.findIndex((child) => child >= this.today) + 1;
  currentEntry = () => this.entries.find((child) => child >= this.today);
}

export const normalize = (string) =>
  string
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

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

// export const isTokenExpired = () => Storage.pull().tokenExpiration < unixTime();
