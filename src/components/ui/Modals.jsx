// import { loadingController } from "@ionic/core";
import { useIonAlert, useIonLoading, useIonToast } from "@ionic/react";

const CancelButton = { text: "Cancel", role: false };
const OKButton = { text: "OK", role: true };

const buttonDismissed = (event) => event.detail.role && event.detail.role !== "backdrop";

export const useModal = () => {
  const [presentAlert] = useIonAlert();
  const [presentLoading, dismissLoading] = useIonLoading();
  const [presentToast, dismissToast] = useIonToast();

  // wrapper
  const modal = ({ header, message, ...options }) => {
    return new Promise((onDidDismiss) => {
      return presentAlert({
        header: header && header + "",
        message: message && message + "",
        // z-index of loader must be increased to avoid covering up occasional alerts
        onWillPresent: (event) => (event.target.style.zIndex -= -20000),
        onDidDismiss,
        ...options,
      });
    });
  };

  const toast = ({ message, ...options }) => {
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
  };

  // the modals
  const alertModal = (header, message = null) => modal({ header: header || message, message: header && message, buttons: [OKButton] }).then(buttonDismissed);
  const errorModal = (header, message = null) => modal({ header: header || message, message: header && message, buttons: [OKButton] }).then(buttonDismissed);
  const confirmModal = (header, message = null) => modal({ header: header || message, message: header && message, buttons: [CancelButton, OKButton] }).then(buttonDismissed);

  // smart modal that wraps async function
  const actionFeedbackModal = (func, errorHeader = null, alertHeader = null) => {
    return async (...args) => {
      await presentLoading();

      try {
        const value = await func(...args);
        value && alertModal(alertHeader, value);
      } catch (error) {
        error && errorModal(errorHeader, error);
      }

      await dismissLoading();
    };
  };

  const toastModal = (message) => toast({ message, duration: 3000 });

  return {
    alertModal,
    errorModal,
    confirmModal,
    actionFeedbackModal,
    toastModal,
  };
};
