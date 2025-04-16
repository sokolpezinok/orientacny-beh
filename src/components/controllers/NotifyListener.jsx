import { FirebaseMessaging } from "@capacitor-firebase/messaging";
import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useModal } from "@/components/ui/Modals";
import { SystemApi } from "@/utils/api";
import { Notifications, NotifyEvents } from "@/utils/notify";

const NotifyListener = ({}) => {
  // listens for push notifications

  const router = useHistory();
  const { actionFeedbackModal } = useModal();

  const handleNotifyActionPerformed = actionFeedbackModal(async (event) => {
    const data = event?.notification?.data || event?.notification?.extra;
    const type = data?.event ?? NotifyEvents.BASIC;
    const value = data?.value;

    if (type !== NotifyEvents.RACE) {
      return;
    }

    if (!value) {
      throw "Chyba v obsahu notifikácie. (value missing)";
    }

    router.push(`/tabs/races/${value}`);
  }, "Nepodarilo sa otvoriť notifikáciu.");

  const handleNotifyReceived = actionFeedbackModal(async (event) => {
    await Notifications.notify({
      title: event.notification.title,
      body: event.notification.body,
      largeBody: event.notification.body,
      extra: event.notification.data,
    });
  }, "Nepodarilo sa prijať notifikáciu.");

  const handleTokenReceived = actionFeedbackModal(async (event) => {
    await SystemApi.fcm_token_update(event.token);
  }, "Nepodarilo sa aktualizovať registračný token notifikácií.");

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      FirebaseMessaging.addListener("notificationActionPerformed", handleNotifyActionPerformed);
      FirebaseMessaging.addListener("notificationReceived", handleNotifyReceived);
      FirebaseMessaging.addListener("tokenReceived", handleTokenReceived);
      LocalNotifications.addListener("localNotificationActionPerformed", handleNotifyActionPerformed);

      return actionFeedbackModal(async () => {
        await FirebaseMessaging.removeAllListeners();
        await LocalNotifications.removeAllListeners();
      }, "Nastala chyba pri vypínaní notifikácií. Skús aplikáciu reštartovať.");
    }
  }, []);
};
export default NotifyListener;
