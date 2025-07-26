import { IonAccordionGroup, IonContent, IonPage } from "@ionic/react";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { Accordion, Anchor, BooleanIcon, Header, ItemGroup } from "@/components/ui/Design";
import License from "@/components/ui/License";
import { apiVersion, appBuildVersion, debug } from "@/manifest.js";
import { Session, Storage } from "@/utils/storage";

const About = memo(({}) => {
  const { t } = useTranslation();
  const storage = Storage.pull();
  const session = Session.pull();

  return (
    <IonPage>
      <Header defaultHref="/tabs/settings" title={t("about.title")} />
      <IonContent>
        <IonAccordionGroup>
          <Accordion title={t("about.contributors")}>
            <p>{t("about.thanks")}</p>
            <div className="flex flex-wrap gap-2">
              <Anchor href="https://github.com/jurakin">Jurakin</Anchor>
              <Anchor href="https://github.com/lukipuki">Lukáš Poláček</Anchor>
              <Anchor href="mailto:ondrej.honsch@gmail.com">Ondrej</Anchor>
            </div>
          </Accordion>
          <Accordion title={t("about.licenseTitle")} subtitle={t("about.licenseBody")}>
            <License />
          </Accordion>
        </IonAccordionGroup>
        <hr />
        <ItemGroup title={t("about.signedIntoClub")}>
          {storage.club.fullname} ({storage.club.shortcut})
        </ItemGroup>
        <ItemGroup title={t("about.signedInUser")}>{storage.userId}</ItemGroup>
        <ItemGroup title={t("about.deviceID")}>{storage.device}</ItemGroup>
        <ItemGroup title={t("about.accessTitle")}>
          <h4>
            <BooleanIcon value={session.policies.adm} />
            <span className="ml-2">{t("about.access.adm")}</span>
          </h4>
          <h4>
            <BooleanIcon value={session.policies.adm_small} />
            <span className="ml-2">{t("about.access.adm_small")}</span>
          </h4>
          <h4>
            <BooleanIcon value={session.policies.regs} />
            <span className="ml-2">{t("about.access.regs")}</span>
          </h4>
          <h4>
            <BooleanIcon value={session.policies.news} />
            <span className="ml-2">{t("about.access.news")}</span>
          </h4>
          <h4>
            <BooleanIcon value={session.policies.fin} />
            <span className="ml-2">{t("about.access.fin")}</span>
          </h4>
          <h4>
            <BooleanIcon value={session.policies.mng_big} />
            <span className="ml-2">{t("about.access.mng_big")}</span>
          </h4>
          <h4>
            <BooleanIcon value={session.policies.mng_small} />
            <span className="ml-2">{t("about.access.mng_small")}</span>
          </h4>
        </ItemGroup>
        <hr />
        <ItemGroup title={t("about.version")}>
          {appBuildVersion}
          {debug && " " + t("about.debug")}
        </ItemGroup>
        <ItemGroup title={t("about.apiVersion")}>{apiVersion}</ItemGroup>
      </IonContent>
    </IonPage>
  );
});
export default About;
