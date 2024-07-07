import { IonItem, IonList, IonSelectOption } from "@ionic/react";
import { useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { RaceApi, RaceEnums } from "@/utils/api";
import { useModal } from "@/utils/modals";
import Content from "../controllers/Content";
import { Header, Input, PrimaryButton, SecondaryButton, Select, Spacing, Text, Title, Toggle } from "../ui/Design";

export default () => (
  <Content
    Render={RaceSign}
    Header={() => {
      const { race_id } = useParams();
      return <Header backHref={`/tabs/races/${race_id}`}>Prihláška</Header>;
    }}
    updateData={({ race_id }) => Promise.all([RaceApi.detail(race_id), RaceApi.relations(race_id)])}
    errorText="Nepodarilo sa načítať preteky."
  />
);

const RaceSign = ({ content }) => {
  const [detail, relations] = content;

  const { race_id, user_id } = useParams();
  const history = useHistory();
  const { smartModal } = useModal();
  const ref = useRef(null);

  const userIndexFromUrl = relations.findIndex((value) => value.user_id == user_id);

  // the user signed in the app is at index zero
  // default index is based on the url if found
  const [userIndex, setUserIndex] = useState(userIndexFromUrl === -1 ? 0 : userIndexFromUrl);
  const user = relations[userIndex];

  const handleSubmit = smartModal(async () => {
    const els = ref.current.elements;
    const collected = {
      category: els.category.value,
      transport: els.transport.value.length > 0,
      accommodation: els.accommodation.value.length > 0,
      note: els.note.value,
      note_internal: els.note_internal.value,
    };

    if (collected.category === "") throw "Nezabudni zadať kategóriu.";

    await RaceApi.signin(race_id, user.user_id, collected);

    // handleUpdate();
    // use .goBack() instead of .push(...) to prevent saving this into history and to act like a back button
    history.goBack();
    return "Prihlásenie prebehlo úspešne.";
  }, "Nepodarilo sa prihlásiť.");

  const handleSignout = smartModal(async () => {
    await RaceApi.signout(race_id, user.user_id);

    // handleUpdate();
    // use .goBack() instead of .push(...) to prevent saving this into history and to act like a back button
    history.goBack();
    return "Odhlásenie prebehlo úspešne.";
  }, "Nepodarilo sa odhlásiť.");

  return (
    <form ref={ref}>
      <IonList>
        <Text>
          <Title>{detail.name}</Title>
        </Text>
        <IonItem>
          <Select label="Pretekár/-ka *" name="user_id" value={userIndex} onIonChange={(event) => setUserIndex(event.target.value)}>
            {relations.map((child, index) => (
              <IonSelectOption key={child.user_id} value={index}>
                {`${child.name} ${child.surname} (${child.chip_number})`}
              </IonSelectOption>
            ))}
          </Select>
        </IonItem>
        {detail.categories.length === 0 ? (
          <IonItem>
            <Input label="Kategória *" name="category" value={user.category} />
          </IonItem>
        ) : (
          <IonItem>
            <Select label="Kategória *" name="category" value={user.category}>
              {detail.categories.map((child) => (
                <IonSelectOption key={child} value={child}>
                  {child}
                </IonSelectOption>
              ))}
            </Select>
          </IonItem>
        )}

        <IonItem>
          <Toggle name="transport" checked={detail.transport == RaceEnums.TRANSPORT_AVAILABLE ? user.transport : detail.transport} disabled={detail.transport != RaceEnums.TRANSPORT_AVAILABLE}>
            Chcem využiť spoločnú dopravu
          </Toggle>
        </IonItem>
        <IonItem>
          <Toggle
            name="accommodation"
            checked={detail.accommodation == RaceEnums.ACCOMMODATION_AVAILABLE ? user.accommodation : detail.accommodation}
            disabled={detail.accommodation != RaceEnums.ACCOMMODATION_AVAILABLE}
          >
            Chcem využiť spoločné ubytovanie
          </Toggle>
        </IonItem>
        <IonItem>
          <Input label="Poznámka (do prihlášky)" name="note" value={user.note} />
        </IonItem>
        <IonItem>
          <Input label="Poznámka (interná)" labelPlacement="floating" name="note_internal" placeholder="..." value={user.note_internal} />
        </IonItem>
        <Spacing>
          <PrimaryButton onClick={handleSubmit}>{user.is_signed_in ? "Zmeniť" : "Prihlásiť sa"}</PrimaryButton>
          <SecondaryButton disabled={!user.is_signed_in} onClick={handleSignout}>
            Odhlásiť sa
          </SecondaryButton>
        </Spacing>
      </IonList>
    </form>
  );
};
