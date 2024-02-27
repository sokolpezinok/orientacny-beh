import {
  IonBackButton,
  IonButtons,
  IonLabel,
  IonButton,
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

import { useParams, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spinner, FatalError } from "../ui/Media";
import Form from "../ui/Form";
import { RaceApi } from "@/api";
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

  // the user signed in the app is at index zero
  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  const { race_id, user_id } = useParams();
  const history = useHistory();

  const updateContent = async (is_first_call = false) => {
    const data = await RaceApi.detail(race_id).catch((error) => (content ? ErrorModal(error) : setError(error)));
    if (data === undefined) return;

    data.relations = await RaceApi.relations(race_id).catch((error) => (content ? ErrorModal(error) : setError(error)));
    if (data.relations === undefined) return;

    setContent(data);

    // update selected user on the first call
    if (is_first_call && user_id !== undefined) {
      const userIndex = data.relations.findIndex((value) => value.user_id == user_id);

      if (userIndex !== -1) {
        setCurrentUserIndex(userIndex);
      }
    }
  };

  useEffect(() => {
    updateContent(true);
  }, []);

  const handleRefresh = (event) => {
    updateContent();
    event.detail.complete();
  };

  const handleSubmit = async (els) => {
    const wanted_inputs = {
      category: els.category.value,
      transport: els.transport.value.length > 0,
      accommodation: els.accommodation.value.length > 0,
      note: els.note.value,
      note_internal: els.note_internal.value,
    };

    if (wanted_inputs.user_id === "") return AlertModal("Nezabudni vybrať koho prihlasuješ.");
    if (wanted_inputs.category === "") return AlertModal("Nezabudni zadať kategóriu.");

    await RaceApi.signin(race_id, currentUser.user_id, wanted_inputs)
      .catch((error) => ErrorModal(error))
      .then(() => AlertModal("Prihlásenie prebehlo úspešne."))
      .then(() => history.goBack()); // use .goBack() instead of .push(...) to prevent saving this into history and to act like a back button

    updateContent();
  };

  const handleSignout = async () => {
    await RaceApi.signout(race_id, currentUser.user_id)
      .catch((error) => ErrorModal(error))
      .then(() => AlertModal("Odhlásenie prebehlo úspešne."))
      .then(() => history.goBack()); // use .goBack() instead of .push(...) to prevent saving this into history and to act like a back button

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
            <div className="p-4">
              <IonButton fill="solid" type="submit" className="w-full">
                {currentUser.is_signed_in ? "Zmeniť" : "Prihlásiť sa"}
              </IonButton>
              <IonButton fill="clear" type="button" className="w-full" disabled={!currentUser.is_signed_in} onClick={handleSignout}>
                Odhlásiť sa
              </IonButton>
            </div>
          </IonList>
        </Form>
      </div>
    </>
  );
};
