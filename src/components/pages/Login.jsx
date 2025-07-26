import { IonBackButton, IonButtons, IonContent, IonInputPasswordToggle, IonModal, IonPage, IonSelectOption } from "@ionic/react";
import { memo, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { Checkbox, Header, Input, PrimaryButton, Select, Spacing } from "@/components/ui/Design";
import License from "@/components/ui/License";
import { useModal } from "@/components/ui/Modals";
import { appName, debug } from "@/manifest";
import { sort } from "@/utils";
import { GeneralApi, SystemApi } from "@/utils/api";
import { Storage } from "@/utils/storage";
import Content, { StatelessForm } from "../controllers/Content";

export default () => <Content Render={Login} fetchContent={GeneralApi.clubs} errorText="Nepodarilo sa načítať zoznam klubov." />;

const Login = memo(({ content }) => {
  const { t } = useTranslation();

  const [termsAccepted, setTermsAccepted] = useState(Storage.pull().preferences.hasAcceptedTerms);
  const [isOpen, setOpen] = useState(false);

  const { actionFeedbackModal, confirmModal } = useModal();
  const router = useHistory();
  const licenseRef = useRef(null);

  useEffect(() => {
    licenseRef.current?.addEventListener("click", (event) => {
      event.stopPropagation();
      setOpen(true);
    });
  }, [licenseRef]);

  // sort clubs by fullname
  content = sort(content, (value) => value.fullname.toLowerCase());

  const handleSubmit = actionFeedbackModal(async (elements) => {
    if (!termsAccepted) throw t("login.acceptTerms");

    const data = {
      username: elements.username.value,
      password: elements.password.value,
      clubname: elements.clubname.value,
    };

    if (data.username === "") throw t("login.fillUsername");
    if (data.password === "") throw t("login.fillPassword");
    if (data.clubname === "") throw t("login.fillClub");

    const selectedClub = content.find((child) => child.clubname === data.clubname);

    await SystemApi.login(data);
    await Storage.push((s) => {
      s.club = selectedClub;
      s.preferences.hasAcceptedTerms = true;
      s.isLoggedIn = true;
    });

    router.push("/tabs");

    if (await confirmModal(t("login.alertSetupNotifyTitle"), t("login.alertSetupNotifyBody"))) {
      router.push("/tabs/settings/notify");
    }
  }, t("login.alertLoginError"));

  return (
    <IonPage>
      <IonContent>
        <div className="flex h-full items-center justify-center">
          <div className="flex w-full max-w-xl flex-col gap-8 p-8 lg:max-w-6xl lg:flex-row">
            <div className="flex items-center gap-8">
              <img className="w-24" src="/favicon.png" />
              <h1 className="lg:text-4xl">{appName}</h1>
            </div>
            <div className="flex-1">
              <StatelessForm onSubmit={handleSubmit}>
                <Input name="username" type="text" label={t("login.username")} required />
                <Input name="password" type="password" label={t("login.password")} required>
                  <IonInputPasswordToggle slot="end" />
                </Input>
                <Select name="clubname" label={t("login.club")} required>
                  {content
                    .filter((child) => child.is_release || debug)
                    .map((child, index) => (
                      <IonSelectOption key={child.clubname} value={child.clubname}>
                        {child.fullname}
                      </IonSelectOption>
                    ))}
                </Select>
                <br />
                <Checkbox checked={termsAccepted} onIonChange={(event) => setTermsAccepted(event.target.checked)} required>
                  {t("login.iAgreeWith")}{" "}
                  <a href="#" ref={licenseRef}>
                    {t("login.withTermsOfService")}
                  </a>
                </Checkbox>
                <br />
                <PrimaryButton type="submit">{t("Prihlásiť sa")}</PrimaryButton>
              </StatelessForm>
            </div>
          </div>
        </div>
        <IonModal isOpen={isOpen}>
          <Header title={t("login.termsOfService")}>
            <IonButtons slot="start">
              <IonBackButton defaultHref="#" onClick={() => setOpen(false)} />
            </IonButtons>
          </Header>
          <IonContent>
            <Spacing innerPadding>
              <License />
            </Spacing>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
});
