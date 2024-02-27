import { IonBackButton, IonButtons, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonAccordionGroup, IonAccordion } from "@ionic/react";
import License from "../ui/License";
import { appBuildVersion } from "@/manifest";
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
                <p>{appBuildVersion}</p>
              </IonLabel>
            </IonItem>
            <IonAccordionGroup>
              <IonAccordion>
                <IonItem slot="header">
                  <IonLabel className="ion-text-wrap">
                    <h1>Poďakovanie</h1>
                    <p>Ďakujeme všetkým, ktorí akýmkoľvek spôsobom prispeli na vývoj aplikácie Orientačného behu.</p>
                  </IonLabel>
                </IonItem>
                <div slot="content" className="bg-orange-50 dark:bg-transparent">
                  <IonGrid className="mx-4 py-4">
                    <IonRow>
                      <IonCol>Vývojár</IonCol>
                      <IonCol className="text-right text-orange-600 dark:text-orange-700">
                        <Link href="https://github.com/jurakin">Jurakin</Link>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>Dizajn</IonCol>
                      <IonCol className="text-right text-orange-600 dark:text-orange-700">
                        <Link href="mailto:ondrej.honsch@gmail.com">Ondrej</Link>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>Od klubu</IonCol>
                      <IonCol className="text-right text-orange-600 dark:text-orange-700">
                        <Link href="https://www.sokolpezinok.sk/">KOB Sokol Pezinok</Link>
                      </IonCol>
                    </IonRow>
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
                <div slot="content" className="bg-orange-50 p-4 dark:bg-transparent">
                  <License />
                </div>
              </IonAccordion>
            </IonAccordionGroup>
          </IonList>
        </IonContent>
      </IonPage>
    </>
  );
};
export default About;
