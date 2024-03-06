import { appServerApi } from "@/manifest";
import Store from "@/utils/store";

const getToken = () => Store.getRawState().user.token;
const getServer = () => `${appServerApi}/club/${Store.getRawState().club.clubname}`

// server api packaged into a class
class Api {
    static async fetch(part, {data={}, auth=false, headers={}, method="POST", server=null, token=null} = {}) {
        server = server || getServer();
        token = token || getToken();

        // add required headers and authorization when needed
        headers = Object.assign({
            "Content-Type": "application/json",
            "Accept": "application/json",
        }, auth && {
            "Authorization": "Bearer " + token,
        }, headers);

        return new Promise(async (resolve, reject) => {
            try {
                const fetcher = await fetch(server + part, {
                    method,
                    headers,
                    body: JSON.stringify(data),
                });
                const content = await fetcher.json();
                fetcher.ok ? resolve(content) : reject(content?.message ?? "Unknown status code error.");
            } catch (error) {
                return reject(error?.message ?? "Unknown fetch/json parse error.");
            }
        });
    }
}

export class GeneralApi extends Api {
    static clubs = () => this.fetch(`/clubs`, {
        server: appServerApi
    });
}

export class UserApi extends Api {
    static login = (username, password, clubname) => this.fetch(`/user/login`, {
        data: {username, password},
        server: `${appServerApi}/club/${clubname}`
    });
    static show = (user_id) => this.fetch(`/user/${user_id}`);
    static managing = (user_id) => this.fetch(`/user/${user_id}/managing`, {
        auth: true,
    });
    static data = () => this.fetch(`/user/`, {
        auth: true,
    });
    static update = (data) => this.fetch(`/user/update`, {
        auth: true,
        data,
    });
}

export class RaceApi extends Api {
    // returns url
    static get_redirect = (race_id) => `${getServer()}/race/${race_id}/redirect`;
    
    // methods
    static list = () => this.fetch(`/races`);
    static detail = (race_id) => this.fetch(`/race/${race_id}`);
    static relations = (race_id) => this.fetch(`/race/${race_id}/relations`, {
        auth: true,
    });
    static signin = (race_id, user_id, {category, note, note_internal, transport, accommodation}) => this.fetch(`/race/${race_id}/signin/${user_id}`, {
        auth: true,
        data: {category, note, note_internal, transport, accommodation}
    });
    static signout = (race_id, user_id) => this.fetch(`/race/${race_id}/signout/${user_id}`, {
        auth: true,
    });
}