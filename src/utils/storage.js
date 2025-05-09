import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { Store } from "pullstate";
import { UserApi } from "./api";

export class Storage {
  static store = new Store({
    isLoggedIn: false,

    // user preferences
    preferences: {
      activeNotify: false,
      hasAcceptedTerms: false,
    },

    // access token
    accessToken: null,

    userId: null,
    device: null,

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
    const profile = this.pull();

    await SecureStoragePlugin.set({
      key: this.profile,
      value: JSON.stringify(profile),
    });
  }

  static load_clean() {
    return SecureStoragePlugin.clear();
  }

  static async load_from_storage() {
    const profile = await SecureStoragePlugin.get({ key: this.profile });
    const { isLoggedIn, ...data } = JSON.parse(profile.value);

    this.store.update((s) => {
      // push values to store
      for (const [key, value] of Object.entries(data)) {
        s[key] = value;
      }
    });

    // only after everything is setup
    this.store.update((s) => {
      s.isLoggedIn = isLoggedIn;
    });
  }

  static async load() {
    try {
      await this.load_from_storage();
    } catch (error) {
      console.error(error);
      try {
        await this.load_clean();
      } catch (error) {
        console.error(error);
        alert("Ospravedlňujeme sa, došlo k neočakávanej chybe. Skús vymazať úložisko aplikácie alebo kontaktuj administrátora.\n" + error);
      }
    }

    Session.push((s) => {
      s.appLoading = false;
    });
  }
}

export class Session {
  static store = new Store({
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

  static pull() {
    return this.store.getRawState();
  }

  static useState(func) {
    return this.store.useState(func);
  }

  static push(func) {
    return this.store.update(func);
  }

  static async fetch_user_data() {
    try {
      const [policies, managing] = await Promise.all([UserApi.my_policies(), UserApi.my_managing()]);

      Session.push((s) => {
        s.policies = {
          adm: policies.policy_adm,
          adm_small: policies.policy_adm_small,
          news: policies.policy_news,
          regs: policies.policy_regs,
          fin: policies.policy_fin,
          mng_big: policies.policy_mng_big,
          mng_small: policies.policy_mng_small,
        };
        s.managingIds = managing.map((child) => child.user_id);
      });
    } catch (error) {
      alert("Nepodarilo sa načítať dáta zo serveru - niektoré údaje nemusia byť správne.\n" + error);
    }
  }
}
