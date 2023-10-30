import Store from "@/store";
import { FatalModal } from "@/modals";

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
    const fetchWrap = () => fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        const promise = await fetchWrap();
        const result = await promise.json();

        if (!promise.ok) {
            throw new Error(result.message);
        }

        return result;
    } catch (error) {
        if (!handleErrors) {
            throw new Error(error.message);
        }

        return FatalModal(error.message);
    }
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