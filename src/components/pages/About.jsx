import { IonBackButton, IonButtons, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonGrid, IonRow, IonCol } from '@ionic/react';

function About() {
  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/tabs/settings" />
            </IonButtons>
            <IonTitle>O aplikácii</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem>
              <IonLabel className="ion-text-wrap">
                <h1>Poďakovanie</h1>
                <p>Ďakujem všetkým, ktorý akýmkoľvek spôsobom prispeli na vývoj aplikácie Orientačného behu.</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonGrid className="mx-4 py-4">
                <IonRow>
                  <IonCol className="text-gray-500">Developed</IonCol>
                  <IonCol className="text-right">Jurakin</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol className="text-gray-500">Design advisor</IonCol>
                  <IonCol className="text-right">OndrejH</IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>
            <IonItem>
              <IonLabel className="ion-text-wrap">
                <h1>Licencia</h1>
                <p>
                  Aplikácia Orientačný beh je pod licenciou <b>GNU General Public License v3.0</b>.
                </p>
              </IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonPage>
    </>
  );
}

export default About;
