import { apiServer } from "@/manifest";
import { Storage } from "@/utils/storage";

const getToken = () => Storage.pull().token;
const getServer = () => `${apiServer}/${Storage.pull().club.clubname}`;

// server api packaged into a class
class Api {
  static async fetch(part, method, { data = null, auth = false, headers = {}, server = null, token = null } = {}) {
    if (!window.navigator.onLine) {
      throw "Vyzerá to tak, že si offline. Skontroluj prosím pripojenie na internet.";
    }

    server = server || getServer();
    token = token || getToken();

    // add required headers and authorization when needed
    headers = Object.assign(
      {
        // these headers are required, do NOT touch
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
      },
      auth && {
        Authorization: "Bearer " + token,
      },
      headers
    );

    // make a request
    const response = await fetch(server + part, {
      method,
      headers,
      body: data && JSON.stringify(data),
    });

    const length = response.headers.get("Content-Length");

    // try to parse json if got response to be able provide error message
    const content = length === null || length === "0" ? {} : await response.json();

    // raise an error based on status code and try to report an error
    if (!response.ok) throw content?.message ?? "Unknown error that could not be reported.";

    // all right, return content
    return content;
  }

  static get = (part, options) => this.fetch(part, "GET", options);
  static post = (part, options) => this.fetch(part, "POST", options);
}

export class GeneralApi extends Api {
  static clubs = () =>
    this.get(`/clubs`, {
      server: apiServer,
    });
}

export class UserApi extends Api {
  static login = ({ username, password, clubname }) =>
    this.post(`/user/login`, {
      data: { username, password },
      server: `${apiServer}/${clubname}`,
    });
  static show = (user_id) => this.get(`/user/${user_id}`);
  static managing = (user_id) =>
    this.get(`/user/${user_id}/managing`, {
      auth: true,
    });
  static data = () =>
    this.get(`/user/`, {
      auth: true,
    });
  static data_update = (data) =>
    this.post(`/user/`, {
      auth: true,
      data,
    });
  static notify = () =>
    this.get(`/user/notify`, {
      auth: true,
    });
  static notify_update = (data) =>
    this.post(`/user/notify`, {
      auth: true,
      data,
    });
}

export class RaceApi extends Api {
  // returns url
  static getRedirect = (race_id) => `${getServer()}/race/${race_id}/redirect`;

  // methods
  static list = () => this.get(`/races`);
  static detail = (race_id) => this.get(`/race/${race_id}`);
  static relations = (race_id) =>
    this.get(`/race/${race_id}/relations`, {
      auth: true,
    });
  static signin = (race_id, user_id, data) =>
    this.post(`/race/${race_id}/signin/${user_id}`, {
      auth: true,
      data,
    });
  static signout = (race_id, user_id) =>
    this.post(`/race/${race_id}/signout/${user_id}`, {
      auth: true,
    });
  static notify = (race_id, { title, body, image }) =>
    this.post(`/race/${race_id}/notify`, {
      auth: true,
      data: { title, body, image },
    });
}

export class PolicyEnums {
  static BIG_MANAGER = 4;
  static SMALL_MANAGER = 2;
}

export class RaceEnums {
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
