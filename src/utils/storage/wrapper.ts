import i18next from "i18next";
import { Store, TUpdateFunction } from "pullstate";

export class StorageStore<T extends object> extends Store<{ hydrated: boolean; storage?: T }> {
  private initial: T;
  public get: () => Promise<string | null>;
  public set: (value: string) => Promise<void>;

  constructor(initial: T, { get, set }: { get: () => Promise<string | null>; set: (value: string) => Promise<void> }) {
    super({ hydrated: false, storage: undefined });

    this.initial = initial;
    this.get = get;
    this.set = set;
  }

  async hydrate() {
    if (this.getRawState().hydrated) {
      return;
    }

    const value = await this.get();

    let storage: T = this.initial;

    // try to hydrate store
    if (value) {
      try {
        storage = JSON.parse(value) as T;
      } catch {}
    }

    // use replace to avoid weird ts errors
    this.replace({
      storage,
      hydrated: true,
    });

    // subscribe after hydration
    this.subscribe(
      (s) => s.storage,
      (value) => {
        this.set(JSON.stringify(value));
      }
    );
  }

  useStorage<R>(selector: (s: T) => R): R {
    return this.useState((s) => {
      if (!s.hydrated || !s.storage) {
        throw new Error(i18next.t("general.storageNotHydratedError"));
      }

      return selector(s.storage);
    });
  }

  updateStorage(selector: TUpdateFunction<T>) {
    return this.update((s, original) => {
      if (!s.hydrated || !s.storage || !original.hydrated || !original.storage) {
        throw new Error(i18next.t("general.storageNotHydratedError"));
      }

      return selector(s.storage, original.storage);
    });
  }

  getStorage(): T {
    const s = this.getRawState();

    if (!s.hydrated || !s.storage) {
      throw new Error(i18next.t("general.storageNotHydratedError"));
    }

    return s.storage;
  }

  subscribeStorage<R>(selector: (s: T) => R, listener: (watched: R, allState: T, previousWatched: R) => void) {
    return this.subscribe(
      (s) => {
        if (!s.hydrated || !s.storage) {
          throw new Error(i18next.t("general.storageNotHydratedError"));
        }

        return selector(s.storage);
      },
      (watched, allState, previousWatched) => listener(watched, allState.storage!, previousWatched)
    );
  }
}
