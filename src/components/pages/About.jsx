import { Accordion, Anchor, Header, Item } from "@/components/ui/Design";
import License from "@/components/ui/License";
import { apiVersion, appBuildVersion } from "@/manifest.js";
import { Storage } from "@/utils/storage";
import { IonAccordionGroup, IonContent, IonPage } from "@ionic/react";

const About = () => {
  return (
    <IonPage>
      <Header backHref="/tabs/settings" title="O aplikácii" />
      <IonContent>
        <IonAccordionGroup>
          <Accordion title="Contributors">
            <p>Ďakujeme všetkým, ktorí akýmkoľvek spôsobom prispeli na vývoj aplikácie Orientačného behu.</p>
            <div className="flex flex-wrap gap-2">
              <Anchor href="https://github.com/jurakin">Jurakin</Anchor>
              <Anchor href="https://github.com/lukipuki">Lukáš Poláček</Anchor>
              <Anchor href="mailto:ondrej.honsch@gmail.com">Ondrej</Anchor>
            </div>
          </Accordion>
          <Accordion title="Licencia" subtitle="Aplikácia Orientačný beh je pod licenciou MIT License">
            <License />
          </Accordion>
        </IonAccordionGroup>
        <Item>
          <h2>Prihlásený klub</h2>
          <p>{`${Storage.pull().club.fullname} (${Storage.pull().club.shortcut})`}</p>
        </Item>
        <Item>
          <h2>Verzia</h2>
          <p>{appBuildVersion}</p>
        </Item>
        <Item>
          <h2>API Verzia</h2>
          <p>{`${apiVersion}`}</p>
        </Item>
      </IonContent>
    </IonPage>
  );
};
export default About;
