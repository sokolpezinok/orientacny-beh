import { IonBackButton, IonButtons, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonAccordionGroup, IonAccordion } from "@ionic/react";
import License from "../ui/License";
import { appBuildName, collaborators } from "@/version";
import Link from "../ui/Link";

const About = () => {
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
                <h1>Verzia</h1>
                <p>{appBuildName}</p>
              </IonLabel>
            </IonItem>
            <IonAccordionGroup>
              <IonAccordion>
                <IonItem slot="header">
                  <IonLabel className="ion-text-wrap">
                    <h1>Poďakovanie</h1>
                    <p>Ďakujem všetkým, ktorý akýmkoľvek spôsobom prispeli na vývoj aplikácie Orientačného behu.</p>
                  </IonLabel>
                </IonItem>
                <div slot="content">
                  <IonGrid className="mx-4 py-4">
                    {
                      collaborators.map((item) => (
                        <IonRow>
                          <IonCol className="text-gray-500">{item.name}</IonCol>
                          <IonCol className="text-right"><Link href={item.link}>{item.value}</Link></IonCol>
                        </IonRow>
                      ))
                    }
                  </IonGrid>
                </div>
              </IonAccordion>
              <IonAccordion>
                <IonItem slot="header">
                  <IonLabel className="ion-text-wrap">
                    <h1>Licencia</h1>
                    <p>
                      Aplikácia Orientačný beh je pod licenciou <b>MIT License</b>.
                    </p>
                  </IonLabel>
                </IonItem>
                <IonItem slot="content">
                  <License />
                </IonItem>
              </IonAccordion>
            </IonAccordionGroup>
          </IonList>
        </IonContent>
      </IonPage>
    </>
  );
}
export default About;