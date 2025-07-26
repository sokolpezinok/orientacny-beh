import { App } from "@capacitor/app";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { useModal } from "@/components/ui/Modals";
import { apiDomain } from "@/manifest.js";
import { Storage } from "@/utils/storage";

const DeeplinkListener = ({}) => {
  const { t } = useTranslation();
  // listen for deeplink open

  const router = useHistory();
  const { actionFeedbackModal } = useModal();

  const handleDeeplink = actionFeedbackModal(async (event) => {
    // expects url in format
    // https://members.eob.cz/api/spt/race/132
    // https://members.eob.cz/api/spt/race/132/redirect
    //
    // ^/api/(\w+)/race/(\d+)

    const path = new URL(event.url);

    if (path.hostname !== apiDomain) throw t("api.deepLink.unknownServer");

    const search = /^\/api\/(\w+)\/race\/(\d+)/.exec(path.pathname);

    if (search === null) throw t("api.deepLink.formatError");

    const [_, club, race_id] = search;

    if (club !== Storage.pull().club.clubname) throw t("api.deepLink.clubError");

    router.push(`/tabs/races/${race_id}`);
  }, t("api.deepLink.openError"));

  useEffect(() => {
    App.addListener("appUrlOpen", handleDeeplink);
  }, []);
};
export default DeeplinkListener;
