import { useIonAlert, useIonLoading, useIonToast } from "@ionic/react";
import { useCallback, useMemo } from "react";

const CancelButton = { text: "Zrušiť", role: false };
const OKButton = { text: "OK", role: true };

const buttonDismissed = (event) => event.detail.role && event.detail.role !== "backdrop";

export const useModal = () => {
  const [presentAlert] = useIonAlert();
  const [presentLoading, dismissLoading] = useIonLoading();
  const [presentToast, dismissToast] = useIonToast();

  const modal = useCallback(
    ({ header, message, ...options }) => {
      return new Promise((onDidDismiss) => {
        return presentAlert({
          header: header && header + "",
          message: message && message + "",
          onWillPresent: (event) => (event.target.style.zIndex -= -20000),
          onDidDismiss,
          ...options,
        });
      });
    },
    [presentAlert]
  );

  const toast = useCallback(
    ({ message, ...options }) => {
      return new Promise((onDidDismiss) => {
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

  const alertModal = useCallback((header, message = null) => modal({ header: header || message, message: header && message, buttons: [OKButton] }).then(buttonDismissed), [modal]);
  const errorModal = useCallback((header, message = null) => modal({ header: header || message, message: header && message, buttons: [OKButton] }).then(buttonDismissed), [modal]);
  const confirmModal = useCallback((header, message = null) => modal({ header: header || message, message: header && message, buttons: [CancelButton, OKButton] }).then(buttonDismissed), [modal]);
  const toastModal = useCallback((message) => toast({ message, duration: 3000 }), [toast]);

  const actionFeedbackModal = useCallback(
    (func, errorHeader = null) => {
      return async (...args) => {
        await presentLoading();

        try {
          const value = await func(...args);
          value && toastModal(value);
        } catch (error) {
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
