import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { Store } from "pullstate";

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

    userId: null,

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
  static profile = "default";

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

  static async load_clean() {
    await SecureStoragePlugin.clear();

    this.push((s) => {
      s.isLoading = false;
    });
  }

  static async load_from_storage() {
    const profile = await SecureStoragePlugin.get({ key: this.profile });
    const data = JSON.parse(profile.value);

    this.store.update((s) => {
      // push values to store
      for (const [key, value] of Object.entries(data)) {
        s[key] = value;
      }

      s.isLoading = false;
    });
  }

  static async load() {
    try {
      await this.load_from_storage();
    } catch (error) {
      alert("An error occurred while accessing storage, clearing storage. " + error);
      await this.load_clean();
    }
  }

  static {
    // load profile into pull state store
    this.load();
  }
}
