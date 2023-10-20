import { Store as PullStateStore } from "pullstate";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";

const Store = new PullStateStore({
  _is_loading: true,

  is_logged_in: false,
  allow_notify: true,
 
  token: null,
  club: null,
});
export default Store;

export const syncStorage = async () => {
  const {_is_loading, ...store} = Store.getRawState(); // delete _is_loading

  await SecureStoragePlugin.set({
    key: "profile",
    value: JSON.stringify(store),
  });
};

export const syncStore = async () => {
  try {
    const profile = await SecureStoragePlugin.get({ key: "profile" });

    // update store
    Store.update((s) => {
      for (let [key, value] of Object.entries(JSON.parse(profile.value))) {
        s[key] = value;
      }
      s._is_loading = false;
    });
  } catch {
    // loading first time
    Store.update((s) => {
      s._is_loading = false;
    });
  }
};
