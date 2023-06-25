import { IonPage, IonHeader, IonItem, IonToolbar, IonTitle, IonContent, IonList, IonLabel } from '@ionic/react';

const Settings = () => {
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
          <IonItem routerLink="/logout">
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
