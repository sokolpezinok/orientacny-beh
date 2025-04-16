import { IonAccordionGroup, IonContent, IonPage } from "@ionic/react";

import { Accordion, Anchor, Header, ItemGroup } from "@/components/ui/Design";
import License from "@/components/ui/License";
import { apiVersion, appBuildVersion, debug } from "@/manifest.js";
import { Storage } from "@/utils/storage";

const About = () => {
  return (
    <IonPage>
      <Header defaultHref="/tabs/settings" title="O aplikácii" />
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
        <ItemGroup title="Prihlásený klub">
          {Storage.pull().club.fullname} (${Storage.pull().club.shortcut})
        </ItemGroup>
        <ItemGroup title="Prihlásený používateľ">{Storage.pull().userId}</ItemGroup>
        <ItemGroup title="Verzia">
          {appBuildVersion}
          {debug && " (debug)"}
        </ItemGroup>
        <ItemGroup title="Verzia API">{apiVersion}</ItemGroup>
        <ItemGroup title="Device ID">{Storage.pull().device}</ItemGroup>
      </IonContent>
    </IonPage>
  );
};
export default About;
