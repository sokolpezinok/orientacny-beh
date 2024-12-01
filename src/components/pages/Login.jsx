import { IonBackButton, IonButton, IonButtons, IonContent, IonIcon, IonModal, IonPage, IonSelectOption, IonTitle, IonToolbar } from "@ionic/react";
import { eye, eyeOff } from "ionicons/icons";
import { useRef, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";

import { Checkbox, Input, List, PrimaryButton, SecondaryButton, Select, SmallWarning } from "@/components/ui/Design";
import License from "@/components/ui/License";
import { isTokenExpired, sort } from "@/utils";
import { GeneralApi, SystemApi } from "@/utils/api";
import { useModal } from "@/utils/modals";
import { Storage } from "@/utils/storage";
import Content from "../controllers/Content";

export default () => <Content Render={Login} updateData={GeneralApi.clubs} errorText="Nepodarilo sa načítať zoznam klubov." />;

const Login = ({ content }) => {
  const isLoggedIn = Storage.useState((s) => s.isLoggedIn);
  const hasAcceptedTerms = Storage.pull().preferences.hasAcceptedTerms;

  const [showPassword, setShowPassword] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const ref = useRef(null);
  const { smartModal, confirmModal } = useModal();
  const history = useHistory();

  if (isLoggedIn) return <Redirect to="/tabs/" />;

  // sort clubs by fullname
  content = sort(content, (value) => value.fullname.toLowerCase());

  const handleSubmit = smartModal(async () => {
    const els = ref.current.elements;
    const collected = {
      username: els.username.value,
      password: els.password.value,
      club: content[els.club.value],
      // license is not always present, use optional chaining operator
      license: els?.license?.value === "on" || hasAcceptedTerms,
    };

    if (collected.username === "") throw "Nezabudni zadať meno.";
    if (collected.password === "") throw "Nezabudni zadať heslo.";
    if (collected.club === undefined) throw "Nezabudni vybrať klub.";
    if (!collected.license) throw "Súhlas s licenčnými podmienkami je povinný.";

    await SystemApi.login({ username: collected.username, password: collected.password, clubname: collected.club.clubname });

    await Storage.push((s) => {
      s.club = collected.club;
      s.preferences.hasAcceptedTerms = true;
    });

    if (await confirmModal("Zapni si notifikácie", "Nezmeškaj prihlasovanie na preteky a dôležité správy. Svoje rozhodnutie môžeš kedykoľvek zmeniť v upozorneniach.")) {
      history.push("/tabs/settings/notify");
    }
  }, "Nastal problém pri prihlasovaní.");

  return (
    <IonPage>
      <IonContent>
        <div className="flex h-full items-center justify-center">
          <div className="flex w-full max-w-xl flex-col gap-8 p-8 lg:max-w-6xl lg:flex-row">
            <div className="flex items-center gap-8">
              <img className="w-24" src="/favicon.png" />
              <h1 className="text-3xl font-bold lg:text-4xl">Orientačný beh</h1>
            </div>
            <form ref={ref} className="flex-1">
              <List>
                {isTokenExpired() && Storage.pull().tokenExpiration !== 0 && <SmallWarning>Prístup do aplikácie vypršal. Prosím, prihlás sa znova.</SmallWarning>}
                <Input name="username" type="text" label="Meno" required />
                <div className="-mr-4 flex items-center">
                  <Input name="password" type={showPassword ? "text" : "password"} label="Heslo" required />
                  <IonButton fill="clear" slot="end" onClick={() => setShowPassword(!showPassword)}>
                    <IonIcon slot="icon-only" icon={showPassword ? eyeOff : eye} />
                  </IonButton>
                </div>
                <Select name="club" label="Klub" required>
                  {content.map((child, index) => (
                    <IonSelectOption key={child.clubname} value={index}>
                      {child.fullname}
                    </IonSelectOption>
                  ))}
                </Select>
                {!hasAcceptedTerms && (
                  <>
                    <hr />
                    <SecondaryButton onClick={() => setModalOpen(true)}>Licenčné podmienky</SecondaryButton>
                    <Checkbox name="license" required>
                      Súhlasím s licenčnými podmienkami
                    </Checkbox>
                  </>
                )}
                <hr />
                <PrimaryButton onClick={handleSubmit}>Prihlásiť sa</PrimaryButton>
              </List>
              <IonModal isOpen={modalOpen}>
                <IonToolbar>
                  <IonButtons slot="start">
                    <IonBackButton defaultHref="#" onClick={() => setModalOpen(false)} />
                  </IonButtons>
                  <IonTitle>Licenčné podmienky</IonTitle>
                </IonToolbar>
                <IonContent>
                  <List innerPadding>
                    <License />
                  </List>
                </IonContent>
              </IonModal>
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
