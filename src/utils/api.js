import { Device } from "@capacitor/device";

import { apiServer, appBuildVersion } from "@/manifest.js";
import { Storage } from "@/utils/storage";
import { Notifications } from "./notify";

const defaultServer = () => `${apiServer}/${Storage.pull().club.clubname}`;
const deviceName = (await Device.getInfo()).name || "";

// server api packaged into a class
class Api {
  static async fetch(part, method, { data = null, auth = false, headers = {}, server = null } = {}) {
    if (!window.navigator.onLine) {
      throw "Vyzerá to tak, že si offline. Skontroluj prosím pripojenie na internet.";
    }

    // these headers are required
    // DO NOT TOUCH
    headers = {
      "Content-Type": "application/json; charset=utf-8",
      Accept: "application/json",
      ...headers,
    };

    if (auth) {
      headers.Authorization = "Bearer " + Storage.pull().accessToken;
    }

    // make a request
    const response = await fetch((server || defaultServer()) + part, {
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
      let message = content?.message ?? "Neznáma chyba, ktorej chýba chybová hláška.";

      if (response.status >= 500) {
        message += "\n\nChyba sa stala na serveri. Prosím, nahláste chybu administrátorom.";
      }

      // reserved for going to login screen, probably token expired
      if (response.status == 401) {
        alert("Prosím, prihlás sa znova.\n" + message);
        await SystemApi.logout();
        return;
      }

      throw message;
    }

    // all right, return content
    return content;
  }

  static get = (part, options) => this.fetch(part, "GET", options);
  static post = (part, options) => this.fetch(part, "POST", options);
  static delete = (part, options) => this.fetch(part, "DELETE", options);
}

export class GeneralApi {
  static clubs = () =>
    Api.get(`/clubs`, {
      server: apiServer,
      // checks: false,
    });
}

export class UserApi {
  static detail = (user_id) => Api.get(`/user/${user_id}`, { auth: true });
  static managing = (user_id) =>
    Api.get(`/user/${user_id}/managing`, {
      auth: true,
    });
  static my_policies = () => Api.get(`/user/policies`, { auth: true });
  static my_managing = () => Api.get(`/user/managing`, { auth: true });
  static profile = () =>
    Api.get(`/user/profile`, {
      auth: true,
    });
  static profile_update = (data) =>
    Api.post(`/user/profile`, {
      auth: true,
      data,
    });
  static user_profile = (user_id) =>
    Api.get(`/user/${user_id}/profile`, {
      auth: true,
    });
  static user_profile_update = (user_id, data) =>
    Api.post(`/user/${user_id}/profile`, {
      auth: true,
      data,
    });
  static notify = () =>
    Api.get(`/user/notify`, {
      auth: true,
    });
  static notify_update = (data) =>
    Api.post(`/user/notify`, {
      auth: true,
      data,
    });
  static list = () =>
    Api.get(`/user/list`, {
      auth: true,
    });
  static user_races = (user_id) =>
    Api.get(`/user/${user_id}/races`, {
      auth: true,
    });
  static user_devices = (user_id) =>
    Api.get(`/user/${user_id}/devices`, {
      auth: true,
    });
  static user_device = (device) => Api.get(`/user/device/${device}`, { auth: true });
  static user_device_delete = (device) => Api.delete(`/user/device/${device}`, { auth: true });
  static user_devices = (user_id) => Api.get(`/user/${user_id}/devices`, { auth: true });
  static devices = () =>
    Api.get(`/user/devices`, {
      auth: true,
    });
  static user_notify = (user_id, { title, body, image }) =>
    Api.post(`/user/${user_id}/notify`, {
      auth: true,
      data: { title, body, image },
    });
  static notify_everyone = () =>
    Api.post(`/user/notify`, {
      auth: true,
      data: { title, body, image },
    });
  static statistics = () => Api.get(`/user/statistics`, { auth: true });
}

export class RaceApi {
  // returns url
  static getRedirect = (race_id) => `${defaultServer()}/race/${race_id}/redirect`;

  // methods
  static list = () => Api.get(`/races`);
  static detail = (race_id) => Api.get(`/race/${race_id}`);
  static relations = (race_id) =>
    Api.get(`/race/${race_id}/relations`, {
      auth: true,
    });
  static signin = (race_id, user_id, data) =>
    Api.post(`/race/${race_id}/signin/${user_id}`, {
      auth: true,
      data,
    });
  static signout = (race_id, user_id) =>
    Api.post(`/race/${race_id}/signout/${user_id}`, {
      auth: true,
    });
  static notify = (race_id, { title, body, image }) =>
    Api.post(`/race/${race_id}/notify`, {
      auth: true,
      data: { title, body, image },
    });
}

export class FinancesApi {
  static overview = () => Api.get(`/finances`, { auth: true });
  static history = () => Api.get(`/finances/history`, { auth: true });
  static detail = (fin_id) => Api.get(`/finances/${fin_id}`, { auth: true });
  static claim_history = (fin_id) => Api.get(`/finances/${fin_id}/claim/history`, { auth: true });
  static claim_message = (fin_id, message) => Api.post(`/finances/${fin_id}/claim/message`, { data: { message }, auth: true });
  static claim_close = (fin_id) => Api.post(`/finances/${fin_id}/claim/close`, { auth: true });
  static payment_update = (fin_id, data) => Api.post(`/finances/${fin_id}`, { auth: true, data });
  static payments_import = (data) => Api.post(`/finances/import`, { auth: true, data });
}

export class SystemApi {
  static login = async ({ username, password, clubname }) => {
    const { access_token, device, user_id } = await Api.post(`/system/login`, {
      data: { username, password, app_version: appBuildVersion, device_name: deviceName },
      server: `${apiServer}/${clubname}`,
    });

    if (!access_token) throw "Got invalid access token from server!";

    await Storage.push((s) => {
      s.accessToken = access_token;
      s.userId = user_id;
      s.device = device;
    });
  };

  static logout = async () => {
    await SystemApi.device_delete().catch((error) => console.warn(error));
    await Notifications.destroy().catch((error) => console.warn(error));
    await Storage.push((s) => {
      s.isLoggedIn = false;
    });
  };

  static fcm_token_update = (token) =>
    Api.post(`/system/device/fcm_token`, {
      auth: true,
      data: { token },
    });

  static fcm_token_delete = (active) =>
    Api.delete(`/system/device/fcm_token`, {
      auth: true,
      data: { active },
    });

  static device_update = () =>
    Api.post(`/system/device`, {
      auth: true,
      data: { device_name: deviceName, app_version: appBuildVersion },
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

  static isTransportSelectable = (number) => number == this.TRANSPORT_AVAILABLE || number == this.TRANSPORT_SHARED;

  static ACCOMMODATION_UNAVAILABLE = 0;
  static ACCOMMODATION_AVAILABLE = 1;
  static ACCOMMODATION_REQUIRED = 2;

  static isAccommodationSelectable = (number) => number == this.ACCOMMODATION_AVAILABLE;
}

export class FinancesEnum {
  static CLAIM_UNOPENED = null;
  static CLAIM_OPENED = 1;
  static CLAIM_CLOSED = 0;

  static STORNO_INACTIVE = null;
  static STORNO_ACTIVE = 1;
}
