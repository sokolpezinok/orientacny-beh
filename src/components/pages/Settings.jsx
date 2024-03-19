import { useModal } from "@/utils/modals";
import { Notifications } from "@/utils/notify";
import Store, { syncStorage } from "@/utils/store";
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from "@ionic/react";

const Settings = () => {
  const { errorModal, confirmModal } = useModal();

  const handleLogout = async (event) => {
    if (!(await confirmModal("Naozaj sa chceš odhlásiť?"))) return event.preventDefault();

    Store.update((s) => {
      s.is_logged_in = false;
    });

    await syncStorage();
  };

  const handleAllowNotify = (event) =>
    (event.target.checked ? Notifications.register() : Notifications.unregister()).catch((error) => {
      errorModal("Nepodarilo sa zmeniť nastavenie.", error);
      event.target.checked = !event.target.checked;
    });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Nastavenia</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem routerLink="/tabs/settings/profile">
            <IonLabel>Profil</IonLabel>
          </IonItem>
          {/* <IonItem>
            <IonToggle labelPlacement="start" checked={Store.getRawState().allow_notify} onIonChange={handleAllowNotify}>
              Povoliť notifikácie
            </IonToggle>
          </IonItem> */}
          <IonItem routerLink="#" onClick={handleLogout}>
            <IonLabel>Odhlásiť sa</IonLabel>
          </IonItem>
          <IonItem routerLink="/tabs/settings/about">
            <IonLabel>O aplikácii</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
