import { AlertButton, AlertOptions, OverlayEventDetail } from "@ionic/core";
import { ToastOptions, useIonAlert, useIonLoading, useIonToast } from "@ionic/react";
import { useCallback, useMemo } from "react";

const CancelButton: AlertButton = { text: "Zrušiť", role: "cancel" };
const OKButton: AlertButton = { text: "OK", role: "ok" };

const buttonDismissed = <T,>(event: CustomEvent<OverlayEventDetail<T>>) => event.detail.role === "ok";

export const useModal = () => {
  const [presentAlert] = useIonAlert();
  const [presentLoading, dismissLoading] = useIonLoading();
  const [presentToast] = useIonToast();

  const modal = useCallback(
    ({ header, message, ...options }: AlertOptions) => {
      return new Promise<CustomEvent<OverlayEventDetail<any>>>((onDidDismiss) => {
        return presentAlert({
          header: header && header + "",
          message: message && message + "",
          onWillPresent: (event) => ((event.target as any).style.zIndex -= -20000),
          onDidDismiss,
          ...options,
        });
      });
    },
    [presentAlert]
  );

  const toast = useCallback(
    ({ message, ...options }: ToastOptions) => {
      return new Promise<CustomEvent<OverlayEventDetail<any>>>((onDidDismiss) => {
        return presentToast({
          message,
          swipeGesture: "vertical",
          positionAnchor: "ion-tab-bar",
          position: "bottom",
          onDidDismiss,
          ...options,
        });
      });
    },
    [presentToast]
  );

  const alertModal = useCallback(
    (message: string, header?: string) => modal({ header: header || message, message: (header && message) || "", buttons: [OKButton] }).then((event) => buttonDismissed(event)),
    [modal]
  );
  const errorModal = useCallback(
    (message: string, header?: string) => modal({ header: header || message, message: (header && message) || "", buttons: [OKButton] }).then((event) => buttonDismissed(event)),
    [modal]
  );
  const confirmModal = useCallback(
    (message: string, header?: string) => modal({ header: header || message, message: (header && message) || "", buttons: [CancelButton, OKButton] }).then((event) => buttonDismissed(event)),
    [modal]
  );
  const toastModal = useCallback((message: string) => toast({ message, duration: 3000 }), [toast]);

  const actionFeedbackModal = useCallback(
    <F extends (...args: any[]) => Promise<string | undefined | null | void>>(func: F, errorHeader: string = "") => {
      return async (...args: Parameters<F>) => {
        await presentLoading();

        try {
          const value = await func(...args);
          value && toastModal(value);
        } catch (error: any) {
          error && errorModal(errorHeader, error);
        }

        await dismissLoading();
      };
    },
    [presentLoading, dismissLoading, toastModal, errorModal]
  );

  return useMemo(
    () => ({
      alertModal,
      errorModal,
      confirmModal,
      actionFeedbackModal,
      toastModal,
    }),
    [alertModal, errorModal, confirmModal, actionFeedbackModal, toastModal]
  );
};
