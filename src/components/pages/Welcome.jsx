import {
  IonPage,
  IonHeader,
  IonItem,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonInput,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonCheckbox,
  IonAccordionGroup,
  IonAccordion,
} from "@ionic/react";
import { Redirect } from "react-router-dom";
import Store, { syncStorage } from "@/store";
import { useEffect, useState } from "react";
import { fetchPublicApi, fetchApi, publicApi, privateApi } from "@/api";

import Image from "next/image";
import favicon from "@/public/favicon.png";

import License from "../ui/License";
import Form from "../ui/Form";
import { Button, ButtonsWrapper } from "../ui/Buttons";
import { FatalError } from "../ui/Media";
import { ErrorModal, FatalModal } from "@/modals";

const Welcome = ({}) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Prihlásiť sa</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <WelcomeContent />
      </IonContent>
    </IonPage>
  );
};

export default Welcome;

const WelcomeContent = ({}) => {
  const is_logged_in = Store.useState((s) => s.is_logged_in);

  const [clublist, setClublist] = useState([]);
  const [error, setError] = useState(null);

  const updateClublist = async () => {
    const data = await fetchPublicApi(publicApi.clublist, {}, false).catch((data) => (content ? ErrorModal(data) : setError(data.message)));
    if (data === undefined) return;

    setClublist(data);
  };

  useEffect(() => {
    updateClublist();
  }, []);

  const handleSubmit = async (els) => {
    const wanted_inputs = {
      username: els.username.value,
      password: els.password.value,
      club: clublist[els.club.value],
      license: els.license.value.length > 0,
    };

    if (wanted_inputs.username === "") return ErrorModal("Nezabudni zadať meno.");
    if (wanted_inputs.password === "") return ErrorModal("Nezabudni zadať heslo.");
    if (wanted_inputs.club === undefined) return ErrorModal("Nezabudni vybrať klub.");
    if (!wanted_inputs.license) return ErrorModal("Súhlas s licenčnými podmienkami je povinný.");

    const data = await fetchApi(wanted_inputs.club.url + privateApi.user, {
      action: "login",
      username: wanted_inputs.username,
      password: wanted_inputs.password,
    });

    if (data === undefined) return;

    Store.update((s) => {
      s.token = data;
      s.club = wanted_inputs.club;
      s.is_logged_in = true;
    });
    syncStorage().catch((error) => FatalModal(error));
  };

  const handleRefresh = (event) => {
    handleSubmit();
    event.detail.complete();
  };

  if (is_logged_in) return <Redirect to="/tabs/" />;

  if (error !== null)
    return (
      <>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        <FatalError text="Nepodarilo sa načítať kluby." error={error} />
      </>
    );

  return (
    <>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent />
      </IonRefresher>
      <div className="flex h-full items-center justify-center bg-white dark:bg-gray-900">
        <div className="w-full md:w-1/2">
          <Form onSubmit={handleSubmit}>
            <IonList>
              <Image src={favicon} className="m-auto mb-4 w-24 shadow-2xl" alt="Orienteering Logo" />
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
                  {clublist.map((child, index) => (
                    <IonSelectOption key={child.short} value={index}>
                      {child.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonCheckbox name="license">Súhlasím s licenčnými podmienkami</IonCheckbox>
              </IonItem>
              <IonAccordionGroup>
                <IonAccordion>
                  <IonItem slot="header">Licenčné podmienky</IonItem>
                  <IonItem slot="content">
                    <License />
                  </IonItem>
                </IonAccordion>
              </IonAccordionGroup>
              <IonItem>
                <ButtonsWrapper>
                  <Button primary={true} type="submit">
                    Prihlásiť sa
                  </Button>
                </ButtonsWrapper>
              </IonItem>
            </IonList>
          </Form>
        </div>
      </div>
    </>
  );
};
