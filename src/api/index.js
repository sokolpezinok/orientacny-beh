// import { FatalModal } from "@/modals";
import { appServerApi } from "@/manifest";
import Store from "@/store";

// server api packaged into a class
class Api {
    static async fetch(part, {data={}, auth=false, headers={}, method="POST", server=null, token=null} = {}) {
        server = server || `${appServerApi}/club/${Store.getRawState().club.clubname}`;
        token = token || Store.getRawState().user.token;

        // add required headers and authorization when needed
        headers = Object.assign({
            "Content-Type": "application/json",
            "Accept": "application/json",
        }, auth && {
            "Authorization": "Bearer " + token,
        }, headers);

        const wrapper = () => fetch(server + part, {
            method,
            headers,
            body: JSON.stringify(data),
        });

        return new Promise(async (resolve, reject) => {
            try {
                const fetcher = await wrapper();
                
                // reject for status code
                if (!fetcher.ok) {
                    return reject(fetcher.message);
                }
                
                return resolve(await fetcher.json());
            } catch (error) {
                return reject(error.message);
            }
        });
    }
}

export class GeneralApi extends Api {
    static clubs() {
        return this.fetch(`/clubs`, {
            server: appServerApi
        });
    }
}

export class UserApi extends Api {
    static login(username, password, clubname) {
        return this.fetch(`/user/login`, {
            data: {username, password},
            server: `${appServerApi}/club/${clubname}`
        });
    }
    static show(user_id) {
        return this.fetch(`/user/${user_id}`);
    }
    static managing(user_id) {
        return this.fetch(`/user/${user_id}/managing`, {
            auth: true,
        });
    }
    static data() {
        return this.fetch(`/user/`, {
            auth: true,
        });
    }
    static update(data) {
        return this.fetch(`/user/update`, {
            auth: true,
            data,
        })
    }
}

export class RaceApi extends Api {
    static list() {
        return this.fetch(`/races`);
    }
    static detail(race_id) {
        return this.fetch(`/race/${race_id}`);
    }
    static relations(race_id) {
        return this.fetch(`/race/${race_id}/relations`, {
            auth: true,
        });
    }
    static signin(race_id, user_id, {category, note, note_internal, transport, accommodation}) {
        return this.fetch(`/race/${race_id}/signin/${user_id}`, {
            auth: true,
            data: {
                category, note, note_internal, transport, accommodation
            }
        });
    }
    static signout(race_id, user_id) {
        return this.fetch(`/race/${race_id}/signout/${user_id}`, {
            auth: true,
        });
    }
}