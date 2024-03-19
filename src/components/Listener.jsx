import { App } from "@capacitor/app";
// import { Capacitor } from "@capacitor/core";
// import { PushNotifications } from "@capacitor/push-notifications";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useModal } from "@/utils/modals";
import { NotificantionsContent } from "@/utils/notify";

const Listener = ({}) => {
  // listen for opening a deeplink
  // listen for a notification
  const history = useHistory();
  const { smartModal } = useModal();

  const handleDeeplink = smartModal(async (deeplink) => {
    // expects url in format
    // https://members.eob.cz/api/club/spt/race/132
    // https://members.eob.cz/api/club/spt/race/132/redirect
    //
    // ^/api/club/(\w+)/race/(\d+)

    const path = new URL(deeplink);

    if (path.hostname !== appServerDomain) throw "Odkaz sa nezhoduje so serverom.";

    const search = /^\/api\/club\/(\w+)\/race\/(\d+)/.exec(path.pathname);

    if (search === null) throw "Odkaz má neočakávaný formát.";

    const [_, club, race_id] = search;

    if (club !== Store.getRawState().club.clubname) throw "Odkaz nie je z tvojho klubu.";

    history.push(`/tabs/races/${race_id}`);
  });

  const handleNotification = (content) => {
    alert(JSON.stringify(content.notification.data));
    const data = content?.notification?.data;
    const event = data?.event ?? NotificantionsContent.EVENT_BASIC;

    if (event == NotificantionsContent.EVENT_RACE_CHANGED) {
      if (!data.race_id) {
        return fatalModal("Chyba v obsahu notifikácie. (race_id missing)");
      }

      history.push(`/tabs/races/${data.race_id}`);
    }
  };

  useEffect(() => {
    App.addListener("appUrlOpen", (event) => handleDeeplink(event.url));

    // if (Capacitor.isNativePlatform()) {
    //   PushNotifications.addListener("pushNotificationActionPerformed", handleNotification);
    // }
  }, []);
};
export default Listener;
