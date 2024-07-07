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
    token: null,

    // policy of the user
    policies: {
      policy_adm: false,
      policy_news: false,
      policy_regs: false,
      policy_fin: false,
      policy_mng: false,
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

  static async load() {
    const keys = await SecureStoragePlugin.keys();

    if (keys.value.includes(this.profile)) {
      const profile = await SecureStoragePlugin.get({ key: this.profile });

      this.store.update(s => {
        // push values to store
        Object.entries(JSON.parse(profile.value)).forEach(([key, val]) => {
          s[key] = val;
        });

        s.isLoading = false;
      });

    } else {
      // profile does not exists yet, create a profile via push
      this.push(s => {
        s.isLoading = false;
      });
    }
  }

  static {
    // load profile into pull state store
    this.load();
  }
}