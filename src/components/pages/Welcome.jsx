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

import License from "../ui/License";
import Form from "../ui/Form";
import { Button, ButtonsWrapper } from "../ui/Buttons";
import { FatalError } from "../ui/Media";
import { ErrorModal, FatalModal } from "@/modals";
import { register, subscribe, getToken } from "@/notify";
import { apiSupport, isSupported } from "@/manifest";

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
  const has_accepted_terms = Store.useState((s) => s.has_accepted_terms);

  const [content, setClublist] = useState([]);
  const [error, setError] = useState(null);

  const updateClublist = async () => {
    const data = await fetchPublicApi(publicApi.clublist, {}, false).catch((response) => (content ? ErrorModal(response) : setError(response)));
    if (data === undefined) return;

    // sort A-Z
    setClublist(
      data.sort((a, b) => {
        const x = a.fullname.toLowerCase();
        const y = b.fullname.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
      })
    );
  };

  useEffect(() => {
    updateClublist();
  }, []);

  const handleSubmit = async (els) => {
    const wanted_inputs = {
      username: els.username.value,
      password: els.password.value,
      club: content[els.club.value],
      license: els.license?.value?.length > 0 || has_accepted_terms,
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
      s.token = data.token;
      s.club = wanted_inputs.club;
      s.is_logged_in = true;
      s.has_accepted_terms = true;
    });
    await syncStorage().catch((error) => FatalModal(error));

    await register()?.catch((error) => FatalModal(error));
    await subscribe(wanted_inputs.club.shortcut)?.catch((error) => FatalModal(error));

    // alert("Subscribed: " + wanted_inputs.club.shortcut);
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
        <FatalError text="Nepodarilo sa načítať zoznam klubov." error={error} />
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
                    <IonSelectOption disabled={!isSupported(child.api_version, apiSupport)} key={child.fullname} value={index}>
                      {child.fullname}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              {has_accepted_terms ? null : (
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
