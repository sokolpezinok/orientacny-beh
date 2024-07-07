import { appBuildVersion } from "@/manifest";
import { IonAccordion, IonAccordionGroup, IonCol, IonContent, IonGrid, IonHeader, IonList, IonPage, IonRow } from "@ionic/react";
import { BasicLink, Header, Text } from "../ui/Design";
import License from "../ui/License";

const About = () => {
  return (
    <>
      <IonPage>
        <IonHeader>
          <Header backHref="/tabs/settings">O aplikácii</Header>
        </IonHeader>
        <IonContent>
          <IonList>
            <Text>
              <h1>Verzia</h1>
              <p>{appBuildVersion}</p>
            </Text>
            <IonAccordionGroup>
              <IonAccordion>
                <Text slot="header">
                  <h1>Poďakovanie</h1>
                  <p>Ďakujeme všetkým, ktorí akýmkoľvek spôsobom prispeli na vývoj aplikácie Orientačného behu.</p>
                </Text>
                <div slot="content" className="bg-orange-50 dark:bg-transparent">
                  <IonGrid className="mx-4 py-4">
                    <IonRow>
                      <IonCol>Vývojár</IonCol>
                      <IonCol className="text-right text-orange-600 dark:text-orange-700">
                        <BasicLink href="https://github.com/jurakin">Jurakin</BasicLink>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>Dizajn</IonCol>
                      <IonCol className="text-right text-orange-600 dark:text-orange-700">
                        <BasicLink href="mailto:ondrej.honsch@gmail.com">Ondrej</BasicLink>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>Od klubu</IonCol>
                      <IonCol className="text-right text-orange-600 dark:text-orange-700">
                        <BasicLink href="https://www.sokolpezinok.sk/">KOB Sokol Pezinok</BasicLink>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </div>
              </IonAccordion>
              <IonAccordion>
                <Text slot="header">
                  <h1>Licencia</h1>
                  <p>
                    Aplikácia Orientačný beh je pod licenciou <b>MIT License</b>.
                  </p>
                </Text>
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
