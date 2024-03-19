import { IonBackButton, IonButton, IonButtons, IonInput, IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonTitle, IonToggle, IonToolbar } from "@ionic/react";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { RaceApi } from "@/utils/api";
import { useModal } from "@/utils/modals";
import Content from "../ui/Content";
import Form from "../ui/Form";

export default () => (
  <Content Render={RaceSign} Header={Header} updateData={({ race_id }) => Promise.all([RaceApi.detail(race_id), RaceApi.relations(race_id)])} errorText="Nepodarilo sa načítať preteky." />
);

const Header = ({}) => {
  const { race_id } = useParams();

  return (
    <IonToolbar>
      <IonButtons slot="start">
        <IonBackButton defaultHref={`/tabs/races/${race_id}`} />
      </IonButtons>
      <IonTitle>Prihláška</IonTitle>
    </IonToolbar>
  );
};

const RaceSign = ({ content }) => {
  const [detail, relations] = content;

  const { race_id, user_id } = useParams();
  const history = useHistory();
  const { smartModal } = useModal();

  const userIndexFromUrl = relations.findIndex((value) => value.user_id == user_id);

  // the user signed in the app is at index zero
  // default index is based on the url if found
  const [userIndex, setUserIndex] = useState(userIndexFromUrl === -1 ? 0 : userIndexFromUrl);
  const user = relations[userIndex];

  const handleSubmit = smartModal(async (els) => {
    const wanted_inputs = {
      category: els.category.value,
      transport: els.transport.value.length > 0,
      accommodation: els.accommodation.value.length > 0,
      note: els.note.value,
      note_internal: els.note_internal.value,
    };

    if (wanted_inputs.category === "") throw "Nezabudni zadať kategóriu.";

    await RaceApi.signin(race_id, user.user_id, wanted_inputs);

    // handleUpdate();
    // use .goBack() instead of .push(...) to prevent saving this into history and to act like a back button
    history.goBack();
    return "Prihlásenie prebehlo úspešne.";
  });

  const handleSignout = smartModal(async () => {
    await RaceApi.signout(race_id, user.user_id);

    // handleUpdate();
    // use .goBack() instead of .push(...) to prevent saving this into history and to act like a back button
    history.goBack();
    return "Odhlásenie prebehlo úspešne.";
  });

  return (
    <Form onSubmit={handleSubmit}>
      <IonList>
        <IonItem>
          <IonLabel className="ion-text-wrap">
            <h1 className="mt-0 !font-bold">{detail.name}</h1>
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonSelect label="Pretekár/-ka *" labelPlacement="floating" name="user_id" value={userIndex} onIonChange={(event) => setUserIndex(event.target.value)}>
            {relations.map((child, index) => (
              <IonSelectOption key={child.user_id} value={index}>
                {`${child.name} ${child.surname} (${child.chip_number})`}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonItem>
          {detail.categories.length === 0 ? (
            <IonInput label="Kategória *" labelPlacement="floating" name="category" value={user.category} />
          ) : (
            <IonSelect label="Kategória *" labelPlacement="floating" name="category" value={user.category}>
              {detail.categories.map((child) => (
                <IonSelectOption key={child} value={child}>
                  {child}
                </IonSelectOption>
              ))}
            </IonSelect>
          )}
        </IonItem>
        <IonItem>
          {/* transport can be: 0 => not avaible; 1 = up to user; 2 = commanded */}
          <IonToggle labelPlacement="start" name="transport" checked={detail.transport == 1 ? user.transport : detail.transport} disabled={detail.transport != 1}>
            Chcem využiť spoločnú dopravu
          </IonToggle>
        </IonItem>
        <IonItem>
          {/* accommodation can be: 0 => not avaible; 1 = up to user; 2 = commanded */}
          <IonToggle labelPlacement="start" name="accommodation" checked={detail.accommodation == 1 ? user.accommodation : detail.accommodation} disabled={detail.accommodation != 1}>
            Chcem využiť spoločné ubytovanie
          </IonToggle>
        </IonItem>
        <IonItem>
          <IonInput label="Poznámka (do prihlášky)" labelPlacement="floating" name="note" placeholder="..." value={user.note} />
        </IonItem>
        <IonItem>
          <IonInput label="Poznámka (interná)" labelPlacement="floating" name="note_internal" placeholder="..." value={user.note_internal}></IonInput>
        </IonItem>
        <div className="p-4">
          <IonButton fill="solid" type="submit" className="w-full">
            {user.is_signed_in ? "Zmeniť" : "Prihlásiť sa"}
          </IonButton>
          <IonButton fill="clear" type="button" className="w-full" disabled={!user.is_signed_in} onClick={handleSignout}>
            Odhlásiť sa
          </IonButton>
        </div>
      </IonList>
    </Form>
  );
};
