import { AlertButton, AlertOptions, OverlayEventDetail } from "@ionic/core";
import { ToastOptions, useIonAlert, useIonLoading, useIonToast } from "@ionic/react";
import { useCallback, useMemo, useRef } from "react";

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

  // Ionic's useIonLoading present()/dismiss() has a re-entrancy race: two
  // overlapping calls can each create their own overlay, after which one
  // dismiss() clears the ref to the *other* overlay, orphaning the first one
  // on screen forever. Chaining every call onto a shared queue means only
  // one present()/dismiss() pair is ever in flight, so it can't happen.
  const queue = useRef(Promise.resolve());

  const actionFeedbackModal = useCallback(
    <F extends (...args: any[]) => Promise<string | undefined | null | void>>(func: F, errorHeader: string = "") => {
      return (...args: Parameters<F>) =>
        (queue.current = queue.current.then(async () => {
          await presentLoading();

          try {
            const value = await func(...args);
            value && toastModal(value);
          } catch (error: any) {
            error && errorModal(errorHeader, error);
          }

          await dismissLoading();
        }));
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
