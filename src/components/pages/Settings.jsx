import { IonPage, IonHeader, IonItem, IonToolbar, IonTitle, IonContent, IonList, IonLabel } from "@ionic/react";
import Store, { syncStorage } from "@/utils/store";

const Settings = () => {
  const handleLogout = async (event) => {
    if (!confirm("Naozaj sa chceš odhlásiť?")) return event.preventDefault();

    Store.update((s) => {
      s.is_logged_in = false;
    });
    await syncStorage();
  };

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
