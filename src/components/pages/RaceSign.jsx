import { IonButton, IonButtons, IonContent, IonIcon, IonPage, IonSelectOption } from "@ionic/react";
import { refresh } from "ionicons/icons";
import { useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import Content from "@/components/controllers/Content";
import { Drawer, Header, Input, Item, ItemGroup, List, PrimaryButton, Refresher, SecondaryButton, Select, Toggle } from "@/components/ui/Design";
import { RaceApi, RaceEnum } from "@/utils/api";
import { useModal } from "@/utils/modals";

export default () => <Content Render={RaceSign} updateData={({ race_id }) => Promise.all([RaceApi.detail(race_id), RaceApi.relations(race_id)])} errorText="Nepodarilo sa načítať preteky." />;

const RaceSign = ({ content, handleUpdate }) => {
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

  // used for shared transport
  const [sharedTransport, setSharedTransport] = useState(user.transport);

  const handleSubmit = smartModal(async () => {
    const els = ref.current.elements;
    const collected = {
      category: els.category.value,
      transport: els.transport.value === "on",
      transport_shared: els.transport_shared?.value,
      accommodation: els.accommodation.value === "on",
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
    <IonPage>
      <Header backHref={`/tabs/races/${race_id}`} title="Prihláška">
        <IonButtons slot="end">
          <IonButton onClick={handleUpdate}>
            <IonIcon slot="icon-only" icon={refresh} />
          </IonButton>
        </IonButtons>
      </Header>
      <IonContent>
        <Refresher handleUpdate={handleUpdate} />
        <form ref={ref}>
          <Item>
            <h1 className="text-2xl font-bold">{detail.name}</h1>
          </Item>
          <ItemGroup title="Základné údaje">
            <Select label="Pretekár/-ka" name="user_id" value={userIndex} onIonChange={(event) => setUserIndex(event.target.value)} required>
              {relations.map((child, index) => (
                <IonSelectOption key={child.user_id} value={index}>
                  {`${child.name} ${child.surname} (${child.chip_number})`}
                </IonSelectOption>
              ))}
            </Select>
            {detail.categories.length === 0 ? (
              <Input label="Kategória" name="category" value={user.category} required />
            ) : (
              <Select label="Kategória" name="category" value={user.category} required>
                {detail.categories.map((child) => (
                  <IonSelectOption key={child} value={child}>
                    {child}
                  </IonSelectOption>
                ))}
              </Select>
            )}
          </ItemGroup>
          <ItemGroup title="Doprava a ubytovanie">
            <List>
              {detail.transport == RaceEnum.TRANSPORT_SHARED ? (
                <>
                  <Toggle name="transport" checked={sharedTransport} onIonChange={(event) => setSharedTransport(event.target.checked)}>
                    Chcem využiť zdielanú dopravu
                  </Toggle>
                  <Drawer active={sharedTransport} className="pl-4">
                    {/* "" = I will not go */}
                    <Select name="transport_shared" label="Zdielaná doprava" value={sharedTransport ? user.transport_shared || -1 : ""}>
                      <IonSelectOption value={-1}>Potrebujem miesto</IonSelectOption>
                      <IonSelectOption value={0}>Idem iba ja</IonSelectOption>
                      <IonSelectOption value={1}>Zoberiem 1 osobu</IonSelectOption>
                      <IonSelectOption value={2}>Zoberiem 2 osoby</IonSelectOption>
                      <IonSelectOption value={3}>Zoberiem 3 osoby</IonSelectOption>
                      <IonSelectOption value={4}>Zoberiem 4 osoby</IonSelectOption>
                      <IonSelectOption value={5}>Zoberiem 5 osôb</IonSelectOption>
                      <IonSelectOption value={6}>Zoberiem 6 osôb</IonSelectOption>
                      <IonSelectOption value={7}>Zoberiem 7 osôb</IonSelectOption>
                      <IonSelectOption value={8}>Zoberiem 8 osôb</IonSelectOption>
                    </Select>
                  </Drawer>
                </>
              ) : (
                <Toggle name="transport" checked={RaceEnum.isTransportSelectable(detail.transport) ? user.transport : detail.transport} disabled={!RaceEnum.isTransportSelectable(detail.transport)}>
                  Chcem využiť spoločnú dopravu
                </Toggle>
              )}
              <Toggle
                name="accommodation"
                checked={RaceEnum.isAccommodationSelectable(detail.accommodation) ? user.accommodation : detail.accommodation}
                disabled={!RaceEnum.isAccommodationSelectable(detail.accommodation)}
              >
                Chcem využiť spoločné ubytovanie
              </Toggle>
            </List>
          </ItemGroup>
          <ItemGroup title="Poznámky">
            <Input label="Poznámka (do prihlášky)" name="note" value={user.note} />
            <Input label="Poznámka (interná)" name="note_internal" value={user.note_internal} />
          </ItemGroup>
          <List innerPadding>
            <PrimaryButton onClick={handleSubmit}>{user.is_signed_in ? "Zmeniť" : "Prihlásiť sa"}</PrimaryButton>
            <SecondaryButton disabled={!user.is_signed_in} onClick={handleSignout}>
              Odhlásiť sa
            </SecondaryButton>
          </List>
        </form>
      </IonContent>
    </IonPage>
  );
};
