import { App, URLOpenListenerEvent } from "@capacitor/app";
import { FC, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useModal } from "@/components/ui/Modals";
import { getClub } from "@/utils";
import { apiDomain } from "@/utils/api";
import i18next from "i18next";

const DeepLinkListener: FC = () => {
  // listen for deeplink open

  const router = useHistory();
  const { actionFeedbackModal } = useModal();

  const handleDeepLink = actionFeedbackModal(async (event: URLOpenListenerEvent) => {
    // expects url in format
    // https://members.eob.cz/api/spt/race/132
    // https://members.eob.cz/api/spt/race/132/redirect
    //
    // ^/api/(\w+)/race/(\d+)

    const path = new URL(event.url);

    if (path.hostname !== apiDomain) throw i18next.t("api.deepLink.unknownServer");

    const search = /^\/api\/(\w+)\/race\/(\d+)/.exec(path.pathname);

    if (search === null) throw i18next.t("api.deepLink.formatError");

    const [_, club, race_id] = search;

    if (club !== getClub().clubname) throw i18next.t("api.deepLink.clubError");

    router.push(`/tabs/races/${race_id}`);
  }, i18next.t("api.deepLink.openError"));

  useEffect(() => {
    App.addListener("appUrlOpen", handleDeepLink);
  }, [handleDeepLink]);
};
export default DeepLinkListener;
