import { Share } from "@capacitor/share";
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonPage, IonRippleEffect, IonSelectOption } from "@ionic/react";
import classNames from "classnames";
import { bus, calendar, home, location, refresh, shareSocial } from "ionicons/icons";
import { memo, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { Anchor, BooleanIcon, Drawer, Header, Input, ItemGroup, ItemLink, PrimaryButton, ReadMore, Refresher, Select, SmallWarning, Spacing, Toggle, TransparentButton } from "@/components/ui/Design";
import { useModal } from "@/components/ui/Modals";
import { EntriesHelper, sort } from "@/utils";
import { RaceApi, RaceEnum } from "@/utils/api";
import { lazyDate, lazyDates } from "@/utils/format";
import { category, group } from "@/utils/icons";
import { Session, Storage } from "@/utils/storage";
import Content from "../controllers/Content";

export default () => <Content Render={RaceDetail} fetchContent={({ race_id }) => Promise.all([RaceApi.detail(race_id), RaceApi.relations(race_id)])} errorText="Nepodarilo sa načítať preteky." />;

const RaceDetail = memo(({ content: [detail, relations], onUpdate }) => {
  const [select, setSelect] = useState(null);
  const router = useHistory();
  const { race_id } = useParams();
  const { actionFeedbackModal, alertModal } = useModal();

  const handleClose = () => setSelect(null);

  const isUserSignedIn = relations.find((child) => child.user_id == Storage.pull().userId).is_signed_in;
  const childrenSignedIn = relations.filter((child) => child.is_signed_in);
  const entries = new EntriesHelper(detail.entries);

  const handleShare = actionFeedbackModal(async () => {
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

    if (entries.isExpired()) {
      return "Prihlasovanie skončilo";
    }

    if (isUserSignedIn) {
      return "Zmeniť / Odhlásiť sa";
    }

    return (
      <p>
        Prihlásiť sa do <span className="text-primary">{lazyDate(entries.currentEntry())}</span> ({entries.currentEntryIndex()}. termín)
      </p>
    );
  };

  const handleSignin = (user_id = null) => {
    if (detail.cancelled) {
      alertModal("Preteky sú zrušené", "Tieto preteky boli zrušené administrátorom.");
      return;
    }

    if (entries.isExpired()) {
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
            <IonButton onClick={onUpdate}>
              <IonIcon slot="icon-only" icon={refresh} />
            </IonButton>
            <IonButton onClick={handleShare}>
              <IonIcon slot="icon-only" icon={shareSocial} />
            </IonButton>
          </IonButtons>
        </Header>
      </IonHeader>
      <IonContent>
        <Refresher onUpdate={onUpdate} />
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
        {Session.pull().policies.mng_big && <ItemLink routerLink={`/tabs/races/${race_id}/notify`}>Napísať notifikáciu</ItemLink>}
        <ItemLink routerLink="#" onClick={() => handleSignin()}>
          {generateSignInLabel()}
        </ItemLink>
        <ItemGroup title="Prihlásení členovia">
          {childrenSignedIn.length === 0 && <small>(nikto z tvojich členov nie je prihlásený)</small>}
          {childrenSignedIn.map((child) => (
            <IonButton fill="clear" key={child.user_id} onClick={() => handleSignin(child.user_id)} className="w-full">
              <div className="w-full text-left leading-normal font-normal normal-case">
                <p>{`${child.sort_name} (${child.si_chip})`}</p>
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
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {sort(detail.everyone, (child) => child.surname).map((child) => (
                    <tr key={child.user_id} className="ion-activatable relative" onClick={() => router.push(`/tabs/users/${child.user_id}`)}>
                      <td>{`${child.name} ${child.surname}`}</td>
                      <td>{child.category}</td>
                      <td>{<BooleanIcon value={child.transport} />}</td>
                      <td>{<BooleanIcon value={child.accommodation} />}</td>
                      <td>{<IonRippleEffect />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <small>Zatiaľ nikto nie je prihlasený.</small>
              <br />
              <TransparentButton onClick={() => handleSignin()}>Prihlásiť sa</TransparentButton>
            </div>
          )}
        </ItemGroup>
        <IonModal isOpen={select !== null} onDidDismiss={handleClose}>
          <Header title="Prihlásiť sa">
            <IonButtons slot="start">
              <IonBackButton defaultHref="#" onClick={handleClose} />
            </IonButtons>
          </Header>
          <IonContent>
            <Refresher onUpdate={onUpdate} />
            {entries.currentEntryIndex() >= 2 && (
              <ItemGroup>
                <SmallWarning title={`Práve prebieha ${entries.currentEntryIndex()}. termín prihlášok. Poplatok za prihlášku môže byť drahší. Pre ďalšie informácie si pozri propozície.`}>
                  {detail.link && <Anchor href={detail.link} />}
                </SmallWarning>
              </ItemGroup>
            )}
            <ItemGroup>
              <Select label="Člen" value={select} onIonChange={(event) => setSelect(event.target.value)} required>
                {relations.map((child) => (
                  <IonSelectOption key={child.user_id} value={child.user_id}>
                    {`${child.name} ${child.surname} (${child.si_chip})`}
                  </IonSelectOption>
                ))}
              </Select>
            </ItemGroup>
            {select !== null && (
              <RaceSignOf
                detail={detail}
                user={relations.find((child) => child.user_id == select)}
                onClose={() => {
                  handleClose();
                  onUpdate();
                }}
              />
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
});

const RaceSignOf = ({ detail, user, onClose }) => {
  const { actionFeedbackModal } = useModal();
  const ref = useRef(null);
  const [sharedTransport, setSharedTransport] = useState(user.transport);

  const handleSignin = actionFeedbackModal(async () => {
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

  const handleSignout = actionFeedbackModal(async () => {
    await RaceApi.signout(detail.race_id, user.user_id);

    onClose();
    return "Odhlásenie prebehlo úspešne.";
  }, "Nepodarilo sa odhlásiť.");

  return (
    <form ref={ref}>
      <ItemGroup>
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
          <PrimaryButton onClick={() => handleSignin()}>{user.is_signed_in ? "Zmeniť" : "Prihlásiť sa"}</PrimaryButton>
          <TransparentButton disabled={!user.is_signed_in} onClick={handleSignout}>
            Odhlásiť sa
          </TransparentButton>
        </Spacing>
      </ItemGroup>
    </form>
  );
};
