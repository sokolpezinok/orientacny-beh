import { App } from "@capacitor/app";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useModal } from "@/components/ui/Modals";
import { apiDomain } from "@/manifest.js";
import { Storage } from "@/utils/storage";

const DeeplinkListener = ({}) => {
  // listen for deeplink open

  const history = useHistory();
  const { smartModal } = useModal();

  const handleDeeplink = smartModal(async (event) => {
    // expects url in format
    // https://members.eob.cz/api/spt/race/132
    // https://members.eob.cz/api/spt/race/132/redirect
    //
    // ^/api/(\w+)/race/(\d+)

    const path = new URL(event.url);

    if (path.hostname !== apiDomain) throw "Odkaz sa nezhoduje so serverom.";

    const search = /^\/api\/(\w+)\/race\/(\d+)/.exec(path.pathname);

    if (search === null) throw "Odkaz má neočakávaný formát.";

    const [_, club, race_id] = search;

    if (club !== Storage.pull().club.clubname) throw "Odkaz nie je z tvojho klubu.";

    history.push(`/tabs/races/${race_id}`);
  }, "Nepodarilo sa otvoriť odkaz.");

  useEffect(() => {
    App.addListener("appUrlOpen", handleDeeplink);
  }, []);
};
export default DeeplinkListener;
