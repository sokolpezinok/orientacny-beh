import { IonAccordion, IonAccordionGroup, IonCheckbox, IonItem, IonSelectOption } from "@ionic/react";
import { Redirect } from "react-router-dom";

import { sortAlphabetically } from "@/utils";
import { GeneralApi, UserApi } from "@/utils/api";
import { useModal } from "@/utils/modals";
import { Notifications } from "@/utils/notify";
import { Storage } from "@/utils/storage";
import { useRef } from "react";
import Content from "../controllers/Content";
import { Header, Input, PrimaryButton, Select, Spacing, Text } from "../ui/Design";
import License from "../ui/License";

export default () => <Content Render={Login} Header={() => <Header>Prihlásiť sa</Header>} updateData={() => GeneralApi.clubs()} errorText="Nepodarilo sa načítať zoznam klubov." />;

const Login = ({ content }) => {
  const isLoggedIn = Storage.useState((s) => s.isLoggedIn);
  const hasAcceptedTerms = Storage.useState((s) => s.preferences.hasAcceptedTerms);

  const ref = useRef(null);
  const { smartModal, confirmModal, alertModal } = useModal();

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

    const canNotify = await confirmModal("Zapni si notifikácie", "Nezmeškaj prihlasovanie na preteky a dôležité správy. Svoje rozhodnutie môžeš kedykoľvek zmeniť v nastaveniach.");
    if (canNotify) {
      await Notifications.register();
      await Storage.push((s) => {
        s.preferences.allowNotify = true;
      });
    } else {
      await alertModal("Notifikácie sú vypnuté", "Notifikácie si môžeš kedykoľvek zapnúť v nastaveniach.");
    }
  }, "Nastal problém pri prihlasovaní.");

  return (
    <div className="flex h-full items-center justify-center bg-white dark:bg-gray-900">
      <div className="w-full md:w-1/2">
        <form ref={ref}>
          <img src="/favicon.png" className="m-auto my-6 w-24 shadow-[0_0_20px_10px_#0002] dark:shadow-[0_0_20px_10px_#fff2]" alt="Orienteering Logo" />
          <Text>
            <h1 className="text-center">Orientačný beh</h1>
          </Text>
          <IonItem>
            <Input name="username" type="text" label="Meno *" />
          </IonItem>
          <IonItem>
            <Input name="password" type="password" label="Heslo *" />
          </IonItem>
          <IonItem>
            <Select name="club" label="Klub *">
              {content.map((child, index) => (
                <IonSelectOption key={child.clubname} value={index}>
                  {child.fullname}
                </IonSelectOption>
              ))}
            </Select>
          </IonItem>
          {!hasAcceptedTerms && (
            <>
              <IonItem>
                <IonCheckbox name="license">Súhlasím s licenčnými podmienkami</IonCheckbox>
              </IonItem>
              <IonAccordionGroup>
                <IonAccordion>
                  <IonItem slot="header">Licenčné podmienky</IonItem>
                  <div slot="content" className="bg-orange-50 p-4 dark:bg-transparent">
                    <License />
                  </div>
                </IonAccordion>
              </IonAccordionGroup>
            </>
          )}
          <Spacing>
            <PrimaryButton onClick={handleSubmit}>Prihlásiť sa</PrimaryButton>
          </Spacing>
        </form>
      </div>
    </div>
  );
};
