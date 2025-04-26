import { IonAccordionGroup, IonContent, IonPage } from "@ionic/react";
import { memo } from "react";

import { Accordion, Anchor, BooleanIcon, Header, ItemGroup } from "@/components/ui/Design";
import License from "@/components/ui/License";
import { apiVersion, appBuildVersion, debug } from "@/manifest.js";
import { Session, Storage } from "@/utils/storage";

const About = memo(({}) => {
  const storage = Storage.pull();
  const session = Session.pull();

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
        <hr />
        <ItemGroup title="Prihlásený klub">
          {storage.club.fullname} ({storage.club.shortcut})
        </ItemGroup>
        <ItemGroup title="Prihlásený používateľ">{storage.userId}</ItemGroup>
        <ItemGroup title="ID zariadenia">{storage.device}</ItemGroup>
        <ItemGroup title="Prístup">
          <h4>
            <BooleanIcon value={session.policies.adm} />
            <span className="ml-2">Admin</span>
          </h4>
          <h4>
            <BooleanIcon value={session.policies.adm_small} />
            <span className="ml-2">Small Admin</span>
          </h4>
          <h4>
            <BooleanIcon value={session.policies.regs} />
            <span className="ml-2">Registrátor</span>
          </h4>
          <h4>
            <BooleanIcon value={session.policies.news} />
            <span className="ml-2">Noninkár</span>
          </h4>
          <h4>
            <BooleanIcon value={session.policies.fin} />
            <span className="ml-2">Finančník</span>
          </h4>
          <h4>
            <BooleanIcon value={session.policies.mng_big} />
            <span className="ml-2">Tréner</span>
          </h4>
          <h4>
            <BooleanIcon value={session.policies.mng_small} />
            <span className="ml-2">Rodič</span>
          </h4>
        </ItemGroup>
        <hr />
        <ItemGroup title="Verzia">
          {appBuildVersion}
          {debug && " (debug)"}
        </ItemGroup>
        <ItemGroup title="Verzia API">{apiVersion}</ItemGroup>
      </IonContent>
    </IonPage>
  );
});
export default About;
