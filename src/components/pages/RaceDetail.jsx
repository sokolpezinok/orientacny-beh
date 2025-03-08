import { Share } from "@capacitor/share";
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonPage, IonSelectOption } from "@ionic/react";
import classNames from "classnames";
import { bus, calendar, home, location, refresh, shareSocial } from "ionicons/icons";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { Anchor, BooleanIcon, Drawer, Header, Input, Item, ItemGroup, ItemLink, PrimaryButton, ReadMore, Refresher, SadFace, Select, Spacing, Toggle, TransparentButton } from "@/components/ui/Design";
import { useModal } from "@/components/ui/Modals";
import { getFirstEntry, getLastEntry, isFirstEntryExpired, isLastEntryExpired, sort } from "@/utils";
import { RaceApi, RaceEnum } from "@/utils/api";
import { lazyDate, lazyDates } from "@/utils/format";
import { category, group } from "@/utils/icons";
import { Storage } from "@/utils/storage";
import Content from "../controllers/Content";

export default () => <Content Render={RaceDetail} updateData={({ race_id }) => Promise.all([RaceApi.detail(race_id), RaceApi.relations(race_id)])} errorText="Nepodarilo sa načítať preteky." />;

const RaceDetail = ({ content: [detail, relations], handleUpdate }) => {
  const { race_id } = useParams();
  const { smartModal, alertModal } = useModal();

  const [select, setSelect] = useState(null);

  const handleClose = () => setSelect(null);

  const childrenSignedIn = relations.filter((child) => child.is_signed_in);

  const handleShare = smartModal(async () => {
    const { value } = await Share.canShare();
    if (!value) throw "Zdielanie nie je dostupné.";

    // catch share cancel
    await Share.share({
      title: detail.name,
      text: `${detail.name}\n${detail.note}`,
      url: RaceApi.getRedirect(race_id),
      dialogTitle: detail.name,
    }).catch(() => null);
  }, "Nepodarilo sa zdielať.");

  const generateSignInLabel = () => {
    if (detail.cancelled) {
      return "Preteky sú zrušené";
    }

    if (isLastEntryExpired(detail.entries)) {
      return "Prihlasovanie skončilo";
    }

    const iAmSignedIn = relations.find((child) => child.user_id == Storage.pull().userId).is_signed_in;
    const firstExpired = isFirstEntryExpired(detail.entries);
    const currentEntry = <span className="text-primary">{lazyDate(firstExpired ? getLastEntry(detail.entries) : getFirstEntry(detail.entries))}</span>;

    if (firstExpired && !iAmSignedIn) {
      return (
        <>
          <p>Vypršal prvý termín prihlásenia, budú účtované poplatky.</p>
          <p>Posledný termín: {currentEntry}</p>
        </>
      );
    }

    return (
      <>
        {iAmSignedIn ? "Zmeniť / Odhlásiť sa" : "Prihlásiť sa"} do {currentEntry}
      </>
    );
  };

  const handleSignin = (user_id = null) => {
    if (detail.cancelled) {
      alertModal("Preteky sú zrušené", "Tieto preteky boli zrušené administrátorom.");
      return;
    }

    if (isLastEntryExpired(detail.entries)) {
      alertModal("Prihlásenie skončilo", "Vypršal posledný možný termín na prihlásenie.");
      return;
    }

    setSelect(user_id || Storage.pull().userId);
  };

  return (
    <IonPage>
      <IonHeader>
        <Header defaultHref="/tabs/races" title="Podrobnosti">
          <IonButtons slot="primary">
            <IonButton onClick={handleUpdate}>
              <IonIcon slot="icon-only" icon={refresh} />
            </IonButton>
            <IonButton onClick={handleShare}>
              <IonIcon slot="icon-only" icon={shareSocial} />
            </IonButton>
          </IonButtons>
        </Header>
      </IonHeader>
      <IonContent>
        <Refresher handleUpdate={handleUpdate} />
        <ItemGroup>
          <Spacing>
            <h2 className={classNames("text-2xl font-bold", detail.cancelled && "line-through")}>{detail.name}</h2>
            {detail.note && (
              <ReadMore>
                <p>{detail.note}</p>
              </ReadMore>
            )}
            {detail.link && <Anchor href={detail.link} />}
            <div className="grid grid-cols-[auto_1fr] gap-4 md:grid-cols-[auto_1fr_auto_1fr]">
              <IonIcon icon={calendar} className="self-center text-2xl" color="primary" />
              {lazyDates(detail.dates)}
              <IonIcon icon={location} className="self-center text-2xl" color="primary" />
              {detail.place}
              <IonIcon src={group} className="self-center text-2xl" color="primary" />
              {detail.club}
              <IonIcon src={category} className="self-center text-2xl" color="primary" />
              {detail.type}
              <IonIcon icon={bus} className="self-center text-2xl" color="primary" />
              {detail.transport ? "Organizovaná doprava" : "Vlastná doprava"}
              <IonIcon icon={home} className="self-center text-2xl" color="primary" />
              {detail.accommodation ? "Organizované ubytovanie" : "Vlastné ubytovanie"}
            </div>
          </Spacing>
        </ItemGroup>
        {Storage.pull().policies.policy_mng_big && <ItemLink routerLink={`/tabs/races/${race_id}/notify`}>Napísať notifikáciu</ItemLink>}
        <ItemLink routerLink="#" onClick={() => handleSignin()}>
          {generateSignInLabel()}
        </ItemLink>
        <ItemGroup title="Prihlásení členovia">
          {childrenSignedIn.length === 0 && <span>(nikto z tvojich členov nie je prihlásený)</span>}
          {childrenSignedIn.map((child) => (
            <IonButton fill="clear" key={child.user_id} onClick={() => handleSignin(child.user_id)} className="w-full">
              <div className="w-full text-left leading-normal font-normal normal-case">
                <p>{`${child.sort_name} (${child.chip_number})`}</p>
                <span>{child.category || "-"}</span>
              </div>
            </IonButton>
          ))}
        </ItemGroup>
        <ItemGroup title="Všetci prihlásení">
          {detail.everyone.length > 0 ? (
            <div className="-mx-4 -mb-4">
              <table className="table">
                <thead>
                  <tr>
                    <th className="w-1/2">Meno</th>
                    <th className="w-1/2">Kategória</th>
                    <th>{<IonIcon icon={bus} />}</th>
                    <th>{<IonIcon icon={home} />}</th>
                    {/* <th /> */}
                  </tr>
                </thead>
                <tbody>
                  {sort(detail.everyone, (child) => child.surname).map((child) => (
                    <tr key={child.user_id} className="ion-activatable relative">
                      <td>{`${child.name} ${child.surname}`}</td>
                      <td>{child.category}</td>
                      <td>{<BooleanIcon value={child.transport} />}</td>
                      <td>{<BooleanIcon value={child.accommodation} />}</td>
                      {/* <td>{<IonRippleEffect />}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <SadFace title="Zatiaľ sa nikto neprihlásil." subtitle="Môžeš sa prihlásiť ako prvý/-á :)">
              <br />
              <TransparentButton onClick={() => handleSignin()}>Prihlásiť sa</TransparentButton>
            </SadFace>
          )}
        </ItemGroup>
        <IonModal isOpen={select !== null} onDidDismiss={handleClose}>
          <Header title="Prihlásiť sa">
            <IonButtons slot="start">
              <IonBackButton defaultHref="#" onClick={handleClose} />
            </IonButtons>
          </Header>
          <IonContent>
            <Refresher handleUpdate={handleUpdate} />
            <Item>
              <Select label="Člen" value={select} onIonChange={(event) => setSelect(event.target.value)} required>
                {relations.map((child) => (
                  <IonSelectOption key={child.user_id} value={child.user_id}>
                    {`${child.name} ${child.surname} (${child.chip_number})`}
                  </IonSelectOption>
                ))}
              </Select>
            </Item>
            {select !== null && (
              <RaceSignOf
                detail={detail}
                user={relations.find((child) => child.user_id == select)}
                onClose={() => {
                  handleClose();
                  handleUpdate();
                }}
              />
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

const RaceSignOf = ({ detail, user, onClose }) => {
  const { smartModal } = useModal();
  const ref = useRef(null);
  const [sharedTransport, setSharedTransport] = useState(user.transport);

  const handleSignin = smartModal(async () => {
    const els = ref.current.elements;
    const collected = {
      category: els.category.value.trim(),
      transport: els.transport.value === "on",
      transport_shared: els.transport_shared?.value,
      accommodation: els.accommodation.value === "on",
      note: els.note.value.trim(),
      note_internal: els.note_internal.value.trim(),
    };

    if (collected.category === "") throw "Nezabudni zadať kategóriu.";

    await RaceApi.signin(detail.race_id, user.user_id, collected);

    onClose();
    return "Prihlásenie prebehlo úspešne.";
  }, "Nepodarilo sa prihlásiť.");

  const handleSignout = smartModal(async () => {
    await RaceApi.signout(detail.race_id, user.user_id);

    onClose();
    return "Odhlásenie prebehlo úspešne.";
  }, "Nepodarilo sa odhlásiť.");

  return (
    <form ref={ref}>
      <ItemGroup title="Základné údaje">
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
        <br />
        <Toggle
          name="accommodation"
          checked={RaceEnum.isAccommodationSelectable(detail.accommodation) ? user.accommodation : detail.accommodation}
          disabled={!RaceEnum.isAccommodationSelectable(detail.accommodation)}
        >
          Chcem využiť spoločné ubytovanie
        </Toggle>
      </ItemGroup>
      <ItemGroup title="Poznámky">
        <Input label="Poznámka (do prihlášky)" name="note" value={user.note} />
        <Input label="Poznámka (interná)" name="note_internal" value={user.note_internal} />
      </ItemGroup>
      <ItemGroup>
        <Spacing>
          <PrimaryButton onClick={handleSignin}>{user.is_signed_in ? "Zmeniť" : "Prihlásiť sa"}</PrimaryButton>
          <TransparentButton disabled={!user.is_signed_in} onClick={handleSignout}>
            Odhlásiť sa
          </TransparentButton>
        </Spacing>
      </ItemGroup>
    </form>
  );
};
