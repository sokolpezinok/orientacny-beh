import Store from "../store";
import { FatalModal } from "../modals";

// automatically work with api and show errors

export const privateApi = { // https://members.eob.cz/<club><privateApiFile>
    user: 'api/user.php',
    race: 'api/race.php',
    lists: 'api/lists.php',
};

export const publicApi = { // https://members.eob.cz/<publicApiFile>
    clublist: 'api_clublist.php',
}

export const fetchApi = async (url, data={}, handleErrors=true) => {
    const promise = fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
    }).then(data => { // a non network error handling
        if (data.ok) return data;
        throw new Error(data.status);
    }).then(data => data.json() // json parsing
     ).then(data => { // api error handling
        if (data.status === "ok") return data.data;
        throw new Error(data.message);
    })

    if (handleErrors) promise.catch(error => {
        FatalModal(error);
    });

    return promise;
}

export const fetchPublicApi = async (urlpart, data={}, handleErrors=true) => {
    if (urlpart === undefined) {
        FatalModal("invalid urlpart");
    };

    return fetchApi("https://members.eob.cz/" + urlpart, data, handleErrors)
}

export const fetchPrivateApi = async (urlpart, data={}, handleErrors=true) => {
    if (urlpart === undefined) {
        FatalModal("invalid urlpart");
    };

    return fetchApi(Store.getRawState().club.url + urlpart, data, handleErrors)
}