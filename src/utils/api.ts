import { Device } from "@capacitor/device";

import { Storage } from "@/utils/storage";
import i18next from "i18next";
import { getClub } from ".";
import { Notifications } from "./notify";

//======================================//
// do NOT add trailing slash at the end //
//======================================//

export const apiDomain = "members.eob.cz";
export const apiVersion = 3;
export const apiServer = `https://members.eob.cz/api/${import.meta.env.DEV ? "debug/" : ""}${apiVersion}`;

const deviceNamePromise = Device.getInfo().then((info) => info.name || "");

let allowLogout = true;

class Api {
  static async fetch<T>(
    part: string,
    method: "GET" | "POST" | "DELETE" | "PUT",
    { data, auth = false, headers = {}, server }: { data?: object; auth?: boolean; headers?: Record<string, string>; server?: string } = {}
  ): Promise<T> {
    if (!window.navigator.onLine) {
      throw i18next.t("api.noInternet");
    }

    // these headers are required
    // DO NOT TOUCH
    headers = {
      "Content-Type": "application/json; charset=utf-8",
      Accept: "application/json",
      ...headers,
    };

    if (auth) {
      headers.Authorization = "Bearer " + Storage.getStorage().accessToken;
    }

    if (!server) {
      server = `${apiServer}/${getClub().clubname}`;
    }

    // make a request
    const response = await fetch(server + part, {
      method,
      headers,
      body: data && JSON.stringify(data),
      cache: "no-store",
    });

    const length = response.headers.get("Content-Length");

    // try to parse json if got response to be able provide error message
    const content = length === "0" ? {} : await response.json();

    // raise an error based on status code and try to report an error
    if (!response.ok) {
      let message = content?.message ?? i18next.t("api.unknownError");

      if (response.status >= 500) {
        message += "\n\n" + i18next.t("api.serverError");
      }

      // reserved for going to login screen, probably token expired
      if (response.status == 401 && allowLogout) {
        alert(i18next.t("api.signInAgain") + "\n" + message);
        await SystemApi.logout();
        return {} as T;
      }

      throw message;
    }

    // all right, return content
    return content;
  }

  static get = <T>(part: string, options?: Parameters<typeof this.fetch>[2]) => this.fetch<T>(part, "GET", options);
  static post = <T>(part: string, options?: Parameters<typeof this.fetch>[2]) => this.fetch<T>(part, "POST", options);
  static delete = <T>(part: string, options?: Parameters<typeof this.fetch>[2]) => this.fetch<T>(part, "DELETE", options);
}
console.log(Api);

export type Club = {
  clubname: string;
  fullname: string;
  is_release: boolean;
  shortcut: string;
  baseadr: string;
  mainwww: string;
  emailadr: string;
};

export class GeneralApi {
  static clubs = () =>
    Api.get<Club[]>(`/clubs`, {
      server: apiServer,
    });
}

export type UserDetail = {
  user_id: number;
  name: string;
  surname: string;
  sort_name: string;
  reg: string;
  si_chip: number;
  chief_id: number | null;
  chief_pay: number | null;
};

export type UserPolicies = { policy_adm: boolean; policy_adm_small: boolean; policy_news: boolean; policy_regs: boolean; policy_fin: boolean; policy_mng_big: boolean; policy_mng_small: boolean };

export type UserProfile = {
  user_id: number;
  name: string;
  surname: string;
  sort_name: string;
  email: string;
  gender: string;
  birth_date: string;
  birth_number: string;
  nationality: string;
  address: string;
  city: string;
  postal_code: string;
  phone: string;
  phone_home: string | null;
  phone_work: string | null;
  reg: string;
  si_chip: number;
  chief_id: number;
  chief_pay: number;
  licence_ob: string | null;
  licence_lob: string | null;
  licence_mtbo: string | null;
  is_hidden: boolean;
  is_entry_locked: boolean;
};

export type UserNotify = {
  notify_type: [{ name: string; id: 1; value: boolean }, { name: string; id: 2; value: boolean }];
  email: string;
  send_news: true;
  send_races: true;
  days_before: 3;
  days_before_min: 1;
  days_before_max: 30;
  race_types: { name: string; id: number; value: boolean }[];
  rankings: { name: string; id: number; value: boolean }[];
  send_changes: boolean;
  send_changes_data: { name: string; id: number; value: boolean }[];
  send_finances: boolean;
  send_finances_data: { name: string; id: number; value: boolean }[];
  financial_limit: number;
  send_member_minus: boolean;
  send_internal_entry_expired: boolean;
};

export type UserNotifyUpdate = {
  notify_type: number;
  email: string;
  send_news: boolean;
  send_races: boolean;
  days_before: number;
  race_types: number;
  rankings: number;
  send_changes: boolean;
  send_changes_data: number;
  send_finances: boolean;
  send_finances_data: number;
  financial_limit: number;
  send_member_minus: boolean;
  send_internal_entry_expired: boolean;
};

export type UserDevice = {
  device: string;
  device_name: string;
  fcm_token_timestamp: string;
  fcm_status: boolean;
  app_last_opened: string;
};

export type UserStatistic = {
  user_id: number;
  name: string;
  surname: string;
  sort_name: string;
  device_count: number;
  fcm_count: number;
};

export class UserApi {
  static detail = (user_id: number) => Api.get<UserDetail>(`/user/${user_id}`, { auth: true });
  static managing = (user_id: number) =>
    Api.get<UserDetail[]>(`/user/${user_id}/managing`, {
      auth: true,
    });
  static my_policies = () =>
    Api.get<UserPolicies>(`/user/policies`, {
      auth: true,
    });
  static my_managing = () => Api.get<UserDetail[]>(`/user/managing`, { auth: true });
  static profile = () =>
    Api.get<UserProfile>(`/user/profile`, {
      auth: true,
    });
  static profile_update = <T extends Partial<UserProfile>>(data: T) =>
    Api.post<{ pushed: (keyof T)[] }>(`/user/profile`, {
      auth: true,
      data,
    });
  static user_profile = (user_id: number) =>
    Api.get<UserProfile>(`/user/${user_id}/profile`, {
      auth: true,
    });
  static user_profile_update = <T extends Partial<UserProfile>>(user_id: number, data: T) =>
    Api.post<{ pushed: (keyof T)[] }>(`/user/${user_id}/profile`, {
      auth: true,
      data,
    });
  static notify = () =>
    Api.get<UserNotify>(`/user/notify`, {
      auth: true,
    });
  static notify_update = <T extends Partial<UserNotifyUpdate>>(data: T) =>
    Api.post<{ pushed: (keyof T)[] }>(`/user/notify`, {
      auth: true,
      data,
    });
  static list = () =>
    Api.get<UserDetail[]>(`/user/list`, {
      auth: true,
    });
  static user_races = (user_id: number) =>
    Api.get<{ race_id: number; name: string; category: string }[]>(`/user/${user_id}/races`, {
      auth: true,
    });
  static user_devices = (user_id: number) =>
    Api.get<UserDevice[]>(`/user/${user_id}/devices`, {
      auth: true,
    });
  static user_device = (device: string) => Api.get<UserDevice>(`/user/device/${device}`, { auth: true });
  static user_device_delete = (device: string) => Api.delete(`/user/device/${device}`, { auth: true });
  static devices = () =>
    Api.get<UserDevice[]>(`/user/devices`, {
      auth: true,
    });
  static user_notify = (user_id: number, data: { title: string; body: string; image?: string; device?: string }) =>
    Api.post(`/user/${user_id}/notify`, {
      auth: true,
      data,
    });
  static notify_everyone = ({ title, body, image }: { title: string; body: string; image?: string }) =>
    Api.post(`/user/notify`, {
      auth: true,
      data: { title, body, image },
    });
  static statistics = () => Api.get<UserStatistic[]>(`/user/statistics`, { auth: true });
}

export type Race = {
  race_id: number;
  dates: string[];
  entries: string[];
  name: string;
  cancelled: boolean;
  club: string;
  link: string;
  place: string;
  type: string;
  sport: null;
  rankings: string[];
  rank21: "0";
  note: string;
  transport: 0 | 1 | 2 | 3;
  accommodation: 0 | 1 | 2;
  categories: string[];
  everyone: { user_id: number; name: string; surname: string; category: string; transport: boolean; accommodation: boolean }[];
};

export type RaceSignedUser = {
  user_id: number;
  name: string;
  surname: string;
  sort_name: string;
  reg: string;
  race_id: number;
  category: string;
  note: string;
  note_internal: string;
  transport: number;
  transport_shared: number;
  accommodation: number;
  is_signed_in: boolean;
  si_chip: number;
};

export class RaceApi {
  // returns url
  static getRedirect = (race_id: number) => {
    return `${apiServer}/${getClub().clubname}/race/${race_id}/redirect`;
  };

  // methods
  static list = () => Api.get<Race[]>(`/races`);
  static detail = (race_id: number) => Api.get<Race>(`/race/${race_id}`);
  static relations = (race_id: number) =>
    Api.get<RaceSignedUser[]>(`/race/${race_id}/relations`, {
      auth: true,
    });
  static signin = (race_id: number, user_id: number, data: { category: string; note: string; note_internal: string; transport: boolean; accommodation: boolean; transport_shared: number }) =>
    Api.post(`/race/${race_id}/signin/${user_id}`, {
      auth: true,
      data,
    });
  static signout = (race_id: number, user_id: number) =>
    Api.post(`/race/${race_id}/signout/${user_id}`, {
      auth: true,
    });
  static notify = (race_id: number, data: { title: string; body: string; image?: string }) =>
    Api.post(`/race/${race_id}/notify`, {
      auth: true,
      data,
    });
}

export type FinanceOverview = {
  user_id: number;
  sort_name: string;
  total: number;
};

export type FinancePayment = {
  fin_id: number;
  editor_user_id: number;
  editor_sort_name: string;
  user_id: number;
  user_sort_name: string;
  race_name: string;
  race_cancelled: boolean;
  race_date: string;
  note: string;
  amount: number;
  date: string;
  storno: 1 | null;
  storno_user_id: number | null;
  storno_date: string | null;
  storno_note: string | null;
  storno_sort_name: string | null;
  claim: 0 | 1 | null;
};

export type FinanceClaim = {
  claim_id: number;
  user_id: number;
  payment_id: number;
  text: string;
  date: string;
  sort_name: string;
};

export type FinancePaymentUpdate = {
  editor_user_id: number;
  user_id: number;
  race_id: number;
  amount: number;
  date: string;
  note: string;
  storno: boolean;
  storno_by: number;
  storno_date: string;
  storno_note: string;
  claim: boolean;
};

export class FinancesApi {
  static overview = () => Api.get<FinanceOverview[]>(`/finances`, { auth: true });
  static history = () => Api.get<FinancePayment[]>(`/finances/history`, { auth: true });
  static detail = (fin_id: number) => Api.get<FinancePayment>(`/finances/${fin_id}`, { auth: true });
  static claim_history = (fin_id: number) => Api.get<FinanceClaim[]>(`/finances/${fin_id}/claim/history`, { auth: true });
  static claim_message = (fin_id: number, message: string) => Api.post(`/finances/${fin_id}/claim/message`, { data: { message }, auth: true });
  static claim_close = (fin_id: number) => Api.post(`/finances/${fin_id}/claim/close`, { auth: true });
  static payment_update = (fin_id: number, data: FinancePaymentUpdate) => Api.post(`/finances/${fin_id}`, { auth: true, data });
  static payment_delete = (fin_id: number) => Api.delete(`/finances/${fin_id}`, { auth: true });
}

export class SystemApi {
  static login = async ({ username, password, clubname }: { username: string; password: string; clubname: string }) => {
    const { access_token, device, user_id } = await Api.post<{ access_token: string; device: string; user_id: number; expiration: number }>(`/system/login`, {
      data: { username, password, app_version: import.meta.env.VITE_APP_VERSION, device_name: await deviceNamePromise },
      server: `${apiServer}/${clubname}`,
    });

    if (!access_token) throw "Got invalid access token from server!";

    await Storage.updateStorage((s) => {
      s.accessToken = access_token;
      s.userId = user_id;
      s.device = device;
    });
  };

  static logout = async () => {
    // If a 401 error occurs during the logout process,
    // the fetch request might try to trigger another logout sequence.
    // This is unnecessary because we're already in the middle of logging out.
    allowLogout = false;
    await SystemApi.device_delete().catch((error) => console.warn(error));
    await Notifications.destroy().catch((error) => console.warn(error));
    allowLogout = true;
    await Storage.updateStorage((s) => {
      s.isLoggedIn = false;
    });
  };

  static fcm_token_update = (token: string) =>
    Api.post(`/system/device/fcm_token`, {
      auth: true,
      data: { token },
    });

  static fcm_token_delete = () =>
    Api.delete(`/system/device/fcm_token`, {
      auth: true,
    });

  static device_update = async () =>
    Api.post(`/system/device`, {
      auth: true,
      data: { device_name: await deviceNamePromise, app_version: import.meta.env.VITE_APP_VERSION },
    });

  static device_delete = () =>
    Api.delete(`/system/device`, {
      auth: true,
    });
}

export class PolicyEnum {
  static BIG_MANAGER = 4;
  static SMALL_MANAGER = 2;
}

export class RaceEnum {
  static TRANSPORT_UNAVAILABLE = 0;
  static TRANSPORT_AVAILABLE = 1;
  static TRANSPORT_REQUIRED = 2;
  static TRANSPORT_SHARED = 3;

  static isTransportSelectable = (number: number) => number == this.TRANSPORT_AVAILABLE || number == this.TRANSPORT_SHARED;

  static ACCOMMODATION_UNAVAILABLE = 0;
  static ACCOMMODATION_AVAILABLE = 1;
  static ACCOMMODATION_REQUIRED = 2;

  static isAccommodationSelectable = (number: number) => number == this.ACCOMMODATION_AVAILABLE;
}

export class FinancesEnum {
  static CLAIM_UNOPENED = null;
  static CLAIM_OPENED = 1;
  static CLAIM_CLOSED = 0;

  static STORNO_INACTIVE = null;
  static STORNO_ACTIVE = 1;
}
