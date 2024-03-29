import { IonAccordion, IonAccordionGroup, IonButton, IonCheckbox, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonTitle, IonToolbar } from "@ionic/react";
import { Redirect } from "react-router-dom";

import { GeneralApi, UserApi } from "@/utils/api";
import { useModal } from "@/utils/modals";
// import { Notifications } from "@/utils/notify";
import Store, { syncStorage } from "@/utils/store";
import Content from "../controllers/Content";
import Form from "../controllers/Form";
import License from "../ui/License";

export default () => <Content Render={Welcome} Header={Header} updateData={() => GeneralApi.clubs()} errorText="Nepodarilo sa načítať zoznam klubov." />;

const Header = ({}) => (
  <IonToolbar>
    <IonTitle>Prihlásiť sa</IonTitle>
  </IonToolbar>
);

const Welcome = ({ content }) => {
  const is_logged_in = Store.useState((s) => s.is_logged_in);
  const has_accepted_terms = Store.useState((s) => s.has_accepted_terms);

  const { smartModal } = useModal();

  // sort clubs alphabetically
  content = content.sort((club0, club1) => {
    // normalize club name
    const x = club0.fullname.toLowerCase();
    const y = club1.fullname.toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
  });

  const handleSubmit = smartModal(async (els) => {
    const wanted_inputs = {
      username: els.username.value,
      password: els.password.value,
      club: content[els.club.value],
      license: els.license?.value?.length > 0 || has_accepted_terms,
    };

    if (wanted_inputs.username === "") throw "Nezabudni zadať meno.";
    if (wanted_inputs.password === "") throw "Nezabudni zadať heslo.";
    if (wanted_inputs.club === undefined) throw "Nezabudni vybrať klub.";
    if (!wanted_inputs.license) throw "Súhlas s licenčnými podmienkami je povinný.";

    const data = await UserApi.login(wanted_inputs.username, wanted_inputs.password, wanted_inputs.club.clubname);

    Store.update((s) => {
      s.user = data;
      s.club = wanted_inputs.club;
      s.is_logged_in = true;
      s.has_accepted_terms = true;
    });
    await syncStorage();
    // await Notifications.register();
  });

  if (is_logged_in) return <Redirect to="/tabs/" />;

  return (
    <div className="flex h-full items-center justify-center bg-white dark:bg-gray-900">
      <div className="w-full md:w-1/2">
        <Form onSubmit={handleSubmit}>
          <img src="/favicon.png" className="m-auto my-6 w-24 shadow-[0_0_20px_10px_#0002] dark:shadow-[0_0_20px_10px_#fff2]" alt="Orienteering Logo" />
          <IonItem>
            <IonLabel class="text-center">
              <h1>Orientačný beh</h1>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonInput name="username" label="Meno *" labelPlacement="floating"></IonInput>
          </IonItem>
          <IonItem>
            <IonInput name="password" type="password" label="Heslo *" labelPlacement="floating"></IonInput>
          </IonItem>
          <IonItem>
            <IonSelect name="club" label="Klub *" labelPlacement="floating">
              {content.map((child, index) => (
                <IonSelectOption key={child.clubname} value={index}>
                  {child.fullname}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          {!has_accepted_terms && (
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
          <div className="p-4">
            <IonButton fill="solid" type="submit" className="w-full">
              Prihlásiť sa
            </IonButton>
          </div>
        </Form>
      </div>
    </div>
  );
};
