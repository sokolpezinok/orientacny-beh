import { Accordion, Anchor, Header, Item } from "@/components/ui/Design";
import License from "@/components/ui/License";
import { appBuildVersion } from "@/manifest";
import { IonAccordionGroup, IonCol, IonContent, IonGrid, IonHeader, IonPage, IonRow } from "@ionic/react";

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
                    <Anchor href="https://github.com/jurakin">Jurakin</Anchor>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>Dizajn</IonCol>
                  <IonCol className="text-right text-primary">
                    <Anchor href="mailto:ondrej.honsch@gmail.com">Ondrej</Anchor>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>Od klubu</IonCol>
                  <IonCol className="text-right text-primary">
                    <Anchor href="https://www.sokolpezinok.sk/">KOB Sokol Pezinok</Anchor>
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
