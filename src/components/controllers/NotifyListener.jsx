import { FirebaseMessaging } from "@capacitor-firebase/messaging";
import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useModal } from "@/utils/modals";
import { Notifications, NotifyEvents } from "@/utils/notify";

const NotifyListener = ({}) => {
  // listens for incoming notifications

  const history = useHistory();
  const { smartModal } = useModal();

  const handleNotifyActionPerformed = smartModal(async (event) => {
    alert("action-performed: " + JSON.stringify(event));

    const data = event?.notification?.data || event?.notification?.extra;
    const type = data?.event ?? NotifyEvents.BASIC;

    // use weak comparison, type is proba
    if (type == NotifyEvents.RACE) {
      if (!data.race_id) {
        throw "Chyba v obsahu notifikácie. (race_id missing)";
      }

      history.push(`/tabs/races/${data.race_id}`);
    }
  }, "Nepodarilo sa otvoriť notifikáciu.");

  const handleNotifyReceived = smartModal(async (event) => {
    alert("notify-received: " + JSON.stringify(event));
    await Notifications.notify({
      title: event.notification.title,
      body: event.notification.body,
      largeBody: event.notification.body,
      extra: event.notification.data,
    });
  }, "Nepodarilo sa prijať notifikáciu.");

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      alert("registering push actions");
      FirebaseMessaging.addListener("notificationActionPerformed", handleNotifyActionPerformed);
      FirebaseMessaging.addListener("notificationReceived", handleNotifyReceived);
      LocalNotifications.addListener("localNotificationActionPerformed", handleNotifyActionPerformed);

      return smartModal(async () => {
        await FirebaseMessaging.removeAllListeners();
        await LocalNotifications.removeAllListeners();
      }, "Nastala chyba pri vypínaní notifikácií. Skús aplikáciu reštartovať.");
    }
  }, []);
};
export default NotifyListener;
