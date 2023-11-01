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

    return new Promise(async (resolve, reject) => {
        try {
            const fetcher = await fetchWrap();
            const result = await fetcher.json();
        
            if (!fetcher.ok) {
                throw new Error(result.message);
            }
        
            return resolve(result);
        } catch (error) {
            if (handleErrors) {
                FatalModal(error.message);
            }

            return reject(error.message);
        }
    });
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