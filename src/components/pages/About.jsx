import { appBuildVersion } from "@/manifest";
import { IonAccordionGroup, IonCol, IonContent, IonGrid, IonHeader, IonPage, IonRow } from "@ionic/react";
import { Accordion, BasicLink, Header, Item } from "../ui/Design";
import License from "../ui/License";

const About = () => {
  return (
    <>
      <IonPage>
        <IonHeader>
          <Header backHref="/tabs/settings">O aplikácii</Header>
        </IonHeader>
        <IonContent>
          <Item>
            <h2>Verzia</h2>
            <p>{appBuildVersion}</p>
          </Item>
          <IonAccordionGroup>
            <Accordion title="Poďakovanie" subtitle="Ďakujeme všetkým, ktorí akýmkoľvek spôsobom prispeli na vývoj aplikácie Orientačného behu.">
              <IonGrid>
                <IonRow>
                  <IonCol>Vývojár</IonCol>
                  <IonCol className="text-right text-primary">
                    <BasicLink href="https://github.com/jurakin">Jurakin</BasicLink>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>Dizajn</IonCol>
                  <IonCol className="text-right text-primary">
                    <BasicLink href="mailto:ondrej.honsch@gmail.com">Ondrej</BasicLink>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>Od klubu</IonCol>
                  <IonCol className="text-right text-primary">
                    <BasicLink href="https://www.sokolpezinok.sk/">KOB Sokol Pezinok</BasicLink>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </Accordion>
            <Accordion title="Licencia" subtitle="Aplikácia Orientačný beh je pod licenciou MIT License">
              <License />
            </Accordion>
          </IonAccordionGroup>
        </IonContent>
      </IonPage>
    </>
  );
};
export default About;
