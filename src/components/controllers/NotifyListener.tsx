import { FirebaseMessaging, NotificationActionPerformedEvent, NotificationReceivedEvent } from "@capacitor-firebase/messaging";
import { Capacitor } from "@capacitor/core";
import { ActionPerformed, LocalNotifications } from "@capacitor/local-notifications";
import { FC, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useModal } from "@/components/ui/Modals";
import { SystemApi } from "@/utils/api";
import { Notifications, NotifyEvents } from "@/utils/notify";
import i18next from "i18next";

const NotifyListener: FC = () => {
  // listens for push notifications

  const router = useHistory();
  const { actionFeedbackModal } = useModal();

  const handleNotifyActionPerformed = actionFeedbackModal(async (event: NotificationActionPerformedEvent | ActionPerformed) => {
    const data: { event?: NotifyEvents; value?: string } = (event?.notification as any)?.data || (event?.notification as any)?.extra;
    const type = data?.event ?? NotifyEvents.BASIC;
    const value = data?.value;

    if (type !== NotifyEvents.RACE) {
      return;
    }

    if (!value) {
      throw i18next.t("api.notify.formatError");
    }

    router.push(`/tabs/races/${value}`);
  }, i18next.t("api.notify.openError"));

  const handleNotifyReceived = actionFeedbackModal(async (event: NotificationReceivedEvent) => {
    await Notifications.notify({
      title: event.notification.title || "",
      body: event.notification.body || "",
      largeBody: event.notification.body,
      extra: event.notification.data,
    });
  }, i18next.t("api.notify.receiveError"));

  const handleTokenReceived = actionFeedbackModal(async (event) => {
    await SystemApi.fcm_token_update(event.token);
  }, i18next.t("api.notify.tokenUpdateError"));

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      FirebaseMessaging.addListener("notificationActionPerformed", handleNotifyActionPerformed);
      FirebaseMessaging.addListener("notificationReceived", handleNotifyReceived);
      FirebaseMessaging.addListener("tokenReceived", handleTokenReceived);
      LocalNotifications.addListener("localNotificationActionPerformed", handleNotifyActionPerformed);

      return () => {
        actionFeedbackModal(async () => {
          await FirebaseMessaging.removeAllListeners();
          await LocalNotifications.removeAllListeners();
        }, i18next.t("api.notify.removeListenerError"))();
      };
    }
  }, [actionFeedbackModal, handleNotifyActionPerformed, handleNotifyReceived, handleTokenReceived]);
};
export default NotifyListener;
