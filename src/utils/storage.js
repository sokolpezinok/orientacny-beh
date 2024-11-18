import { Store } from "pullstate";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";

export class Storage {
  static store = new Store({
    isLoading: true,
    isLoggedIn: false,

    // user preferences
    preferences: {
      allowNotify: false,
      hasAcceptedTerms: false,
    },

    // access token
    accessToken: null,
    tokenExpiration: 0,

    // policy of the user
    policies: {
      policy_adm: false,
      policy_news: false,
      policy_regs: false,
      policy_fin: false,
      policy_mng_small: false,
      policy_mng_big: false,
    },

    // club info data
    club: {
      clubname: null,
      is_release: null,
      fullname: null,
      shortcut: null,
      baseadr: null,
      mainwww: null,
      emailadr: null,
    },
  });

  // a name that is used for secure storage
  static profile = "profile";
  static timeout = 3000;

  static pull() {
    return this.store.getRawState();
  }

  static useState(func) {
    return this.store.useState(func);
  }

  static async push(func) {
    this.store.update(func);
    await this.save();
  }

  static async save() {
    const { isLoading, ...profile } = this.pull();

    await SecureStoragePlugin.set({
      key: this.profile,
      value: JSON.stringify(profile),
    });
  }

  static load_empty() {
    this.push((s) => {
      s.isLoading = false;
    });
  }

  static async load() {
    const { value: keys } = await SecureStoragePlugin.keys();

    if (!keys.includes(this.profile)) {
      return this.load_empty();
    }

    const profile = await Promise.race([new Promise((resolve) => setTimeout(resolve, this.timeout)), SecureStoragePlugin.get({ key: this.profile })]);

    if (!profile) {
      return this.load_empty();
    }

    const data = JSON.parse(profile.value);

    this.store.update((s) => {
      // push values to store
      Object.entries(data).forEach(([key, value]) => {
        s[key] = value;
      });

      s.isLoading = false;
    });
  }

  static {
    // load profile into pull state store
    this.load();
  }
}
