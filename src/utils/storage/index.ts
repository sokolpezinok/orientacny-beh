import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { Store } from "pullstate";
import { StorageStore } from "./wrapper";

type StorageType = {
  isLoggedIn: boolean;
  preferences: {
    activeNotify: boolean;
    hasAcceptedTerms: boolean;
    locale: string;
  };

  accessToken: string | null;
  userId: number | null;
  device: string | null;

  club?: {
    clubname: string;
    fullname: string;
    is_release: boolean;
    shortcut: string;
    baseadr: string;
    mainwww: string;
    emailadr: string;
  };
};

export const Storage = new StorageStore<StorageType>(
  {
    isLoggedIn: false,

    // user preferences
    preferences: {
      activeNotify: false,
      hasAcceptedTerms: false,
      locale: "sk",
    },

    // access token
    accessToken: null,

    userId: null,
    device: null,

    // club info data
    club: undefined,
  },
  {
    set: async (value) => {
      await SecureStoragePlugin.set({
        key: "default",
        value,
      });
    },
    get: async () => {
      const { value } = await SecureStoragePlugin.get({ key: "default" });
      return value;
    },
  }
);

type SessionType = {
  appLoading: boolean;

  policies: {
    adm: boolean;
    adm_small: boolean;
    news: boolean;
    regs: boolean;
    fin: boolean;
    mng_small: boolean;
    mng_big: boolean;
  };

  managingIds: number[];
};

export const Session = new Store<SessionType>({
  appLoading: true,

  // user permissions
  policies: {
    adm: false,
    adm_small: false,
    news: false,
    regs: false,
    fin: false,
    mng_small: false,
    mng_big: false,
  },

  managingIds: [],
});
