import { Store as PullStateStore } from 'pullstate';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

const Store = new PullStateStore({
  club: undefined,
  token: undefined,
});
export default Store;

export const syncStorage = async () => {
  const store = Store.getRawState();

  await SecureStoragePlugin.set({ key: 'club', value: store.club });
  await SecureStoragePlugin.set({ key: 'token', value: store.token });
};

export const syncStore = async () => {
  try {
    const token = await SecureStoragePlugin.get({ key: 'token' });
    const club = await SecureStoragePlugin.get({ key: 'club' });
    // update store
    Store.update(s => {
      s.token = token.value;
      s.club = club.value;
    });
  } catch {
    // there is no club or token defined
    Store.update(s => {
      s.token = null;
      s.club = null;
    });
  }
};
