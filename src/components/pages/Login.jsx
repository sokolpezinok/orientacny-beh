import { IonBackButton, IonButtons, IonContent, IonInputPasswordToggle, IonModal, IonPage, IonSelectOption } from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

import { Checkbox, Header, Input, PrimaryButton, Select, Spacing } from "@/components/ui/Design";
import License from "@/components/ui/License";
import { useModal } from "@/components/ui/Modals";
import { debug } from "@/manifest";
import { sort } from "@/utils";
import { GeneralApi, SystemApi } from "@/utils/api";
import { Storage } from "@/utils/storage";
import Content, { StatelessForm } from "../controllers/Content";

export default () => <Content Render={Login} fetchContent={GeneralApi.clubs} errorText="Nepodarilo sa načítať zoznam klubov." />;

const Login = ({ content }) => {
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
    if (!termsAccepted) throw "Súhlas s licenčnými podmienkami je povinný.";

    const data = {
      username: elements.username.value,
      password: elements.password.value,
      clubname: elements.clubname.value,
    };

    if (data.username === "") throw "Nezabudni zadať meno.";
    if (data.password === "") throw "Nezabudni zadať heslo.";
    if (data.clubname === "") throw "Nezabudni vybrať klub.";

    const selectedClub = content.find((child) => child.clubname === data.clubname);

    await SystemApi.login(data);
    await Storage.push((s) => {
      s.club = selectedClub;
      s.preferences.hasAcceptedTerms = true;
      s.isLoggedIn = true;
    });

    router.push("/tabs");

    if (await confirmModal("Zapni si notifikácie", "Nezmeškaj prihlasovanie na preteky a dôležité správy. Svoje rozhodnutie môžeš kedykoľvek zmeniť v upozorneniach.")) {
      router.push("/tabs/settings/notify");
    }
  }, "Nastal problém pri prihlasovaní.");

  return (
    <IonPage>
      <IonContent>
        <div className="flex h-full items-center justify-center">
          <div className="flex w-full max-w-xl flex-col gap-8 p-8 lg:max-w-6xl lg:flex-row">
            <div className="flex items-center gap-8">
              <img className="w-24" src="/favicon.png" />
              <h1 className="lg:text-4xl">Orientačný beh</h1>
            </div>
            <div className="flex-1">
              <StatelessForm onSubmit={handleSubmit}>
                <Input name="username" type="text" label="Meno" required />
                <Input name="password" type="password" label="Heslo" required>
                  <IonInputPasswordToggle slot="end" />
                </Input>
                <Select name="clubname" label="Klub" required>
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
                  Súhlasím s{" "}
                  <a href="#" ref={licenseRef}>
                    licenčnými podmienkami
                  </a>
                </Checkbox>
                <br />
                <PrimaryButton type="submit">Prihlásiť sa</PrimaryButton>
              </StatelessForm>
            </div>
          </div>
        </div>
        <IonModal isOpen={isOpen}>
          <Header title="Licenčné podmienky">
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
};
