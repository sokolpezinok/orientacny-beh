import { apiServer } from "@/manifest";
import { Storage } from "@/utils/storage";
import { Device } from "@capacitor/device";
import { isTokenExpired, unixTime } from ".";

const getServer = () => `${apiServer}/${Storage.pull().club.clubname}`;
const getDevice = async () => (await Device.getId()).identifier;

// server api packaged into a class
class Api {
  static async fetch(part, method, { data = null, authorize = false, headers = {}, server = null } = {}) {
    if (!window.navigator.onLine) {
      throw "Vyzerá to tak, že si offline. Skontroluj prosím pripojenie na internet.";
    }

    if (isTokenExpired()) {
      await Storage.push((s) => {
        s.isLoggedIn = false;
      });
    }

    // these headers are required
    // DO NOT TOUCH
    headers = {
      "Content-Type": "application/json; charset=utf-8",
      Accept: "application/json",
      ...headers,
    };

    if (authorize) {
      headers.Authorization = "Bearer " + Storage.pull().accessToken;
    }

    // make a request
    const response = await fetch((server || getServer()) + part, {
      method,
      headers,
      body: data && JSON.stringify(data),
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

      throw message;
    }

    // all right, return content
    return content;
  }

  static get = (part, options) => this.fetch(part, "GET", options);
  static post = (part, options) => this.fetch(part, "POST", options);
}

export class GeneralApi {
  static clubs = () =>
    Api.get(`/clubs`, {
      server: apiServer,
    });
}

export class UserApi {
  static show = (user_id) => Api.get(`/user/${user_id}`);
  static managing = (user_id) =>
    Api.get(`/user/${user_id}/managing`, {
      authorize: true,
    });
  static data = () =>
    Api.get(`/user/`, {
      authorize: true,
    });
  static data_update = (data) =>
    Api.post(`/user/`, {
      authorize: true,
      data,
    });
  static notify = () =>
    Api.get(`/user/notify`, {
      authorize: true,
    });
  static notify_update = (data) =>
    Api.post(`/user/notify`, {
      authorize: true,
      data,
    });
}

export class RaceApi {
  // returns url
  static getRedirect = (race_id) => `${getServer()}/race/${race_id}/redirect`;

  // methods
  static list = () => Api.get(`/races`);
  static detail = (race_id) => Api.get(`/race/${race_id}`);
  static relations = (race_id) =>
    Api.get(`/race/${race_id}/relations`, {
      authorize: true,
    });
  static signin = (race_id, user_id, data) =>
    Api.post(`/race/${race_id}/signin/${user_id}`, {
      authorize: true,
      data,
    });
  static signout = (race_id, user_id) =>
    Api.post(`/race/${race_id}/signout/${user_id}`, {
      authorize: true,
    });
  static notify = (race_id, { title, body, image }) =>
    Api.post(`/race/${race_id}/notify`, {
      authorize: true,
      data: { title, body, image },
    });
}

export class SystemApi {
  static login = async ({ username, password, clubname }) => {
    const { access_token, expiration, policies } = await Api.post(`/system/login`, {
      data: { username, password },
      server: `${apiServer}/${clubname}`,
    });

    if (!access_token) throw "Got invalid access token from server!";
    if (expiration < unixTime()) throw "Invalid expiration time!" + expiration + " < " + Date.now();

    await Storage.push((s) => {
      s.accessToken = access_token;
      s.tokenExpiration = expiration;
      s.policies = policies;
      s.isLoggedIn = true;
    });
  };

  static fcm_token_update = async (token) => {
    return await Api.post(`/system/fcm_token/update`, {
      authorize: true,
      data: { token, device: await getDevice() },
    });
  };

  static fcm_token_delete = async () => {
    return await Api.post(`/system/fcm_token/delete`, {
      authorize: true,
      data: { device: await getDevice() },
    });
  };
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
