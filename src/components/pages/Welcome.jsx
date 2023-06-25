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
  useIonAlert,
  IonList,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Image from "next/image";
import favicon from "@/public/favicon.png";
import Form from "../ui/Form";
import { Button, ButtonsWrapper } from "../ui/Buttons";
import { FatalError } from "../ui/Media";

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
  const history = useHistory();

  const [presentAlert] = useIonAlert();
  const emitAlert = (text) =>
    presentAlert({
      message: text,
      buttons: ["OK"],
    });

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const updateData = useCallback(() => {
    fetch("https://members.eob.cz/spt/api/api_clublist.php")
      .then((data) => data.json())
      .then((data) =>
        data.status == "ok" ? setData(data.data) : setError(data.message)
      )
      .catch((error) => setError(error.message));
  }, []);

  useEffect(() => {
    updateData();
  }, [updateData]);

  const handleSubmit = (els) => {
    const wanted_inputs = {
      username: els.username.value,
      password: els.password.value,
      club: els.club.value,
    };

    if (wanted_inputs.username === "")
      return emitAlert("Nezabudni zadať meno.");
    if (wanted_inputs.password === "")
      return emitAlert("Nezabudni zadať heslo.");
    if (wanted_inputs.club === "") return emitAlert("Nezabudni vybrať klub.");

    history.push("/login", wanted_inputs);
  };

  const handleRefresh = (event) => {
    handleSubmit();
    event.detail.complete();
  };

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
        <div className="w-full md:w-1/3">
          <Form onSubmit={handleSubmit}>
            <IonList>
              <Image
                src={favicon}
                className="m-auto mb-4 w-24 shadow-2xl"
                alt="Orienteering Logo"
              />
              <IonItem>
                <IonLabel class="text-center">
                  <h1>Orientačný beh</h1>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Meno *</IonLabel>
                <IonInput name="username" placeholder="..."></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Heslo *</IonLabel>
                <IonInput name="password" placeholder="..."></IonInput>
              </IonItem>
              <IonItem>
                <IonSelect
                  label="Klub *"
                  labelPlacement="floating"
                  name="club"
                  placeholder="..."
                >
                  <IonSelectOption value="https://members.eob.cz/spt/">
                    SPT - BETA Sokol Pezinok
                  </IonSelectOption>
                  <IonSelectOption value="https://members.eob.cz/spe/">
                    SPE - Sokol Pezinok
                  </IonSelectOption>
                  {data.map((child) => (
                    <IonSelectOption key={child.url} value={child.url}>
                      {child.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
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
