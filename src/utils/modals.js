import { useIonAlert } from "@ionic/react";
import { createContext, useContext } from "react";

const ModalContext = createContext(null);

const ModalContextProvider = ({ children }) => {
    const [presentAlert] = useIonAlert();

    return <ModalContext.Provider value={presentAlert}>{children}</ModalContext.Provider>;
}
export default ModalContextProvider;

export const useModal = () => {
    const presentAlert = useContext(ModalContext);

    // buttons
    const CancelButton = { text: "Cancel", role: false };
    const OKButton = { text: "OK", role: true };

    // wrappers
    const modalWrapper = ({ header, message, ...options }) => new Promise(resolve => presentAlert({
        header: header && header + "",
        message: message && message + "",
        onDidDismiss: resolve,
        ...options,
    }));
    const buttonDismissed = event => event.detail.role && event.detail.role !== "backdrop";

    // the modals
    const alertModal = (header, message = null) => modalWrapper({ header: header || message, message: header && message, buttons: [OKButton] }).then(buttonDismissed);
    const errorModal = (header, message = null) => modalWrapper({ header: header || message, message: header && message, buttons: [OKButton] }).then(buttonDismissed);
    const confirmModal = (header, message = null) => modalWrapper({ header: header || message, message: header && message, buttons: [CancelButton, OKButton] }).then(buttonDismissed);

    // smart modal that wraps async function
    const smartModal = (func, errorHeader = null, alertHeader = null) => (...args) => func(...args)
        .then(value => value && alertModal(alertHeader, value))
        .catch(value => value && errorModal(errorHeader, value));

    // smart modal that wraps sync function
    const smartModalSync = (func, errorHeader = null, alertHeader = null) => (...args) => {
        try {
            const value = func(...args);
            return value && alertModal(value, alertHeader);
        } catch (value) {
            return value && errorModal(value, errorHeader);
        }
    }

    // return modals
    return {
        alertModal,
        errorModal,
        confirmModal,
        smartModal,
        smartModalSync,
    }
}