import { Session, Storage } from "./storage";

export const parseDates = (dates: string[]) => {
  // converts into date and removes time part.
  return dates.map((date) => new Date(date).setUTCHours(0, 0, 0, 0));
};

export class EntriesHelper {
  entries: number[];
  today: number;

  constructor(entries: string[]) {
    this.entries = entries.map((child) => new Date(child).setUTCHours(0, 0, 0, 0)).sort((a, b) => a - b);
    this.today = new Date().setUTCHours(0, 0, 0, 0);
  }

  isExpired = () => {
    if (!this.entries.length) {
      return false;
    }

    if (this.entries[0] === 0) {
      return false;
    }

    return this.entries[this.entries.length - 1] < this.today;
  };

  currentEntryIndex = () => this.entries.findIndex((child) => child >= this.today) + 1;
  currentEntry = () => this.entries.find((child) => child >= this.today);
}

export const normalize = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

export const sort = <T>(array: T[], func: ((value: T) => any) | null = null) =>
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

export const doesManageUser = (user_id: number) => Session.getRawState().policies.mng_small && Session.getRawState().managingIds.includes(user_id);

export const getClub = () => {
  const club = Storage.getStorage().club;

  if (!club) {
    throw new Error("Club not found!");
  }

  return club;
};
