import {
  IonBackButton,
  IonButtons,
  IonLabel,
  IonItem,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonList,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spinner, FatalError } from "../ui/Media";
import Form from "../ui/Form";
import { Button, ButtonsWrapper } from "../ui/Buttons";
import Store from "@/store";
import { fetchPrivateApi, privateApi } from "@/api";
import { AlertModal, ErrorModal } from "@/modals";

const RaceSign = ({}) => {
  const { race_id } = useParams();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={`/tabs/races/${race_id}`} />
          </IonButtons>
          <IonTitle>Prihláška</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <RaceSignContent />
      </IonContent>
    </IonPage>
  );
};

export default RaceSign;

const RaceSignContent = ({}) => {
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);

  const [currentUserIndex, setCurrentUserIndex] = useState(0); // myself

  const { race_id } = useParams();

  const updateContent = async () => {
    const { token } = Store.getRawState();

    const data = await fetchPrivateApi(privateApi.race, { action: "detail", race_id }, false).catch(response => content ? ErrorModal(response) : setError(response));
    if (data === undefined) return;

    data.relations = await fetchPrivateApi(privateApi.race, { action: "relations", race_id, token }, false).catch(response => content ? ErrorModal(response) : setError(response));
    if (data.relations === undefined) return;

    setContent(data);
  };

  useEffect(() => {
    updateContent();
  }, []);

  const handleRefresh = (event) => {
    updateContent();
    event.detail.complete();
  };

  const handleSubmit = async (els) => {
    const { token } = Store.getRawState();

    const wanted_inputs = {
      category: els.category.value,
      transport: els.transport.value.length > 0,
      accommodation: els.accommodation.value.length > 0,
      note: els.note.value,
      note_internal: els.note_internal.value,
    };

    if (wanted_inputs.user_id === "") return AlertModal("Nezabudni vybrať koho prihlasuješ.");
    if (wanted_inputs.category === "") return AlertModal("Nezabudni zadať kategóriu.");

    await fetchPrivateApi(privateApi.race, { action: "signin", race_id, user_id: currentUser.user_id, token, ...wanted_inputs }).then(
      () => AlertModal("Prihlásenie prebehlo úspešne.")
    );

    updateContent();
  };

  const handleSignout = async () => {
    const { token } = Store.getRawState();

    await fetchPrivateApi(privateApi.race, { action: "signout", race_id, user_id: currentUser.user_id, token }).then(
      () => AlertModal("Odhlásenie prebehlo úspešne.")
    );

    updateContent();
  };

  if (content === null && error === null) return <Spinner />;
  if (content === null)
    return (
      <>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        <FatalError text="Nepodarilo sa načítať preteky." error={error} />
      </>
    );

  const currentUser = content.relations[currentUserIndex];

  return (
    <>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent />
      </IonRefresher>
      <div className="w-full">
        <Form onSubmit={handleSubmit}>
          <IonList>
            <IonItem>
              <IonLabel className="ion-text-wrap">
                <h1 className="mt-0 !font-bold">{content.name}</h1>
                {content.note.length === 0 ? null : <p className="!mt-4">{content.note}</p>}
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonSelect label="Pretekár/-ka *" labelPlacement="floating" name="user_id" value={currentUserIndex} onIonChange={(event) => setCurrentUserIndex(event.target.value)}>
                {content.relations.map((child, index) => (
                  <IonSelectOption key={child.user_id} value={index}>
                    {`${child.name} ${child.surname} (${child.chip_number})`}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonItem>
              {content.categories.length === 0 ? (
                <IonInput label="Kategória *" labelPlacement="floating" name="category" value={currentUser.category} />
              ) : (
                <IonSelect label="Kategória *" labelPlacement="floating" name="category" value={currentUser.category}>
                  {content.categories.map((child) => (
                    <IonSelectOption key={child} value={child}>
                      {child}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              )}
            </IonItem>
            <IonItem>
              {/* transport can be: 0 => not avaible; 1 = up to user; 2 = commanded */}
              <IonToggle labelPlacement="start" name="transport" checked={content.transport == 1 ? currentUser.transport : content.transport} disabled={content.transport != 1}>
                Chcem využiť spoločnú dopravu
              </IonToggle>
            </IonItem>
            <IonItem>
              {/* accommodation can be: 0 => not avaible; 1 = up to user; 2 = commanded */}
              <IonToggle labelPlacement="start" name="accommodation" checked={content.accommodation == 1 ? currentUser.accommodation : content.accommodation} disabled={content.accommodation != 1}>
                Chcem využiť spoločné ubytovanie
              </IonToggle>
            </IonItem>
            <IonItem>
              <IonInput label="Poznámka (do prihlášky)" labelPlacement="floating" name="note" placeholder="..." value={currentUser.note} />
            </IonItem>
            <IonItem>
              <IonInput label="Poznámka (interná)" labelPlacement="floating" name="note_internal" placeholder="..." value={currentUser.note_internal}></IonInput>
            </IonItem>
            <IonItem>
              <ButtonsWrapper>
                <Button type="submit" primary={true}>
                  {currentUser.is_signed_in ? "Zmeniť" : "Prihlásiť sa"}
                </Button>
                <Button disabled={!currentUser.is_signed_in} type="button" onClick={handleSignout}>
                  Odhlásiť sa
                </Button>
              </ButtonsWrapper>
            </IonItem>
          </IonList>
        </Form>
      </div>
    </>
  );
};
