import { IonBackButton, IonButton, IonButtons, IonContent, IonIcon, IonModal, IonSelectOption, IonTitle, IonToolbar } from "@ionic/react";
import { Redirect, useHistory } from "react-router-dom";

import { sortAlphabetically } from "@/utils";
import { GeneralApi, UserApi } from "@/utils/api";
import { useModal } from "@/utils/modals";
import { Storage } from "@/utils/storage";
import { eye, eyeOff } from "ionicons/icons";
import { useRef, useState } from "react";
import Content from "../controllers/Content";
import { Checkbox, Header, Input, List, PrimaryButton, SecondaryButton, Select } from "../ui/Design";
import License from "../ui/License";

export default () => <Content Render={Login} Header={() => <Header>Prihlásiť sa</Header>} updateData={GeneralApi.clubs} errorText="Nepodarilo sa načítať zoznam klubov." />;

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
  content = sortAlphabetically(content, (value) => value.fullname.toLowerCase());

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

    const { token, policies } = await UserApi.login({ username: collected.username, password: collected.password, clubname: collected.club.clubname });

    await Storage.push((s) => {
      s.token = token;
      s.policies = policies;
      s.club = collected.club;

      s.isLoggedIn = true;
      s.preferences.hasAcceptedTerms = true;
    });

    if (await confirmModal("Zapni si notifikácie", "Nezmeškaj prihlasovanie na preteky a dôležité správy. Svoje rozhodnutie môžeš kedykoľvek zmeniť v upozorneniach.")) {
      history.push("/tabs/settings/notify");
    }
  }, "Nastal problém pri prihlasovaní.");

  return (
    <div className="flex h-full items-center justify-center">
      <div className="w-full max-w-xl p-4">
        <form ref={ref}>
          <img src="/favicon.png" className="m-auto my-6 w-24 shadow-[0_0_20px_10px_#0002] dark:shadow-[0_0_20px_10px_#fff2]" alt="Orienteering Logo" />
          <h1 className="text-center text-2xl font-bold">Orientačný beh</h1>
          <List>
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
                <Checkbox name="license" required>
                  Súhlasím s licenčnými podmienkami
                </Checkbox>
                <SecondaryButton onClick={() => setModalOpen(true)}>Licenčné podmienky</SecondaryButton>
              </>
            )}
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
  );
};
