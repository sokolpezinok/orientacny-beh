import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonPage, IonRippleEffect, IonSelectOption } from "@ionic/react";
import classNames from "classnames";
import { bus, calendar, home, location } from "ionicons/icons";
import { memo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const [select, setSelect] = useState(null);
  const router = useHistory();
  const { race_id } = useParams();
  const { alertModal } = useModal();

  const handleClose = () => setSelect(null);

  const isUserSignedIn = relations.find((child) => child.user_id == Storage.pull().userId).is_signed_in;
  const childrenSignedIn = relations.filter((child) => child.is_signed_in);
  const entries = new EntriesHelper(detail.entries);

  const generateSignInLabel = () => {
    if (detail.cancelled) {
      return t("races.detail.alertRaceCancelledTitle");
    }

    if (entries.isExpired()) {
      return t("races.detail.alertDeadlineExpiredTitle");
    }

    if (isUserSignedIn) {
      return t("races.detail.signInOrUpdate");
    }

    return (
      <p>
        {t("races.detail.signInDeadline")} <span className="text-primary">{lazyDate(entries.currentEntry())}</span> ({entries.currentEntryIndex()}. termín)
      </p>
    );
  };

  const handleSignin = (user_id = null) => {
    if (detail.cancelled) {
      alertModal(t("races.detail.alertRaceCancelledTitle"), t("races.detail.alertRaceCancelledBody"));
      return;
    }

    if (entries.isExpired()) {
      alertModal(t("races.detail.alertDeadlineExpiredTitle"), t("races.detail.alertDeadlineExpiredBody"));
      return;
    }

    setSelect(user_id || Storage.pull().userId);
  };

  return (
    <IonPage>
      <IonHeader>
        <Header defaultHref="/tabs/races" title={t("races.detail.title")} />
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
              {detail.transport ? t("races.detail.transportOrganized") : t("races.detail.transportOwn")}
              <IonIcon icon={home} className="self-center text-2xl" color="primary" />
              {detail.accommodation ? t("races.detail.accommodationOrganized") : t("races.detail.accommodationOwn")}
            </div>
          </Spacing>
        </ItemGroup>
        {Session.pull().policies.mng_big && <ItemLink routerLink={`/tabs/races/${race_id}/notify`}>{t("races.detail.writeNotify")}</ItemLink>}
        <ItemLink routerLink="#" onClick={() => handleSignin()}>
          {generateSignInLabel()}
        </ItemLink>
        <ItemGroup title={t("races.detail.yourMembersSignedIn")}>
          {childrenSignedIn.length === 0 && <small>{t("races.detail.noYourMemberIsSignedIn")}</small>}
          {childrenSignedIn.map((child) => (
            <IonButton fill="clear" key={child.user_id} onClick={() => handleSignin(child.user_id)} className="w-full">
              <div className="w-full text-left leading-normal font-normal normal-case">
                <p>{`${child.sort_name} (${child.si_chip})`}</p>
                <span>{child.category || "-"}</span>
              </div>
            </IonButton>
          ))}
        </ItemGroup>
        <ItemGroup title={t("races.detail.allMembersSignedIn")}>
          {detail.everyone.length > 0 ? (
            <div className="-mx-4 -mb-4">
              <table className="table">
                <thead>
                  <tr>
                    <th className="w-1/2">{t("races.detail.name")}</th>
                    <th className="w-1/2">{t("races.detail.category")}</th>
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
              <small>{t("races.detail.noMemberIsSignedIn")}</small>
              <br />
              <TransparentButton onClick={() => handleSignin()}>{t("basic.signIn")}</TransparentButton>
            </div>
          )}
        </ItemGroup>
        <IonModal isOpen={select !== null} onDidDismiss={handleClose}>
          <Header title={t("basic.signIn")}>
            <IonButtons slot="start">
              <IonBackButton defaultHref="#" onClick={handleClose} />
            </IonButtons>
          </Header>
          <IonContent>
            <Refresher onUpdate={onUpdate} />
            {entries.currentEntryIndex() >= 2 && (
              <ItemGroup>
                <SmallWarning title={t("races.detail.currentEntryCanBeMoreExpensive", { entry: entries.currentEntryIndex() })}>{detail.link && <Anchor href={detail.link} />}</SmallWarning>
              </ItemGroup>
            )}
            <ItemGroup>
              <Select label={t("basic.member")} value={select} onIonChange={(event) => setSelect(event.target.value)} required>
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
  const { t } = useTranslation();
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

    if (collected.category === "") throw t("races.signin.fillCategory");

    await RaceApi.signin(detail.race_id, user.user_id, collected);

    onClose();
    return t("races.signin.signInSuccess");
  }, t("races.signin.signInError"));

  const handleSignout = actionFeedbackModal(async () => {
    await RaceApi.signout(detail.race_id, user.user_id);

    onClose();
    return t("races.signin.signOutSuccess");
  }, t("races.signin.signOutError"));

  return (
    <form ref={ref}>
      <ItemGroup>
        {detail.categories.length === 0 ? (
          <Input label={t("races.signin.category")} name="category" value={user.category} required />
        ) : (
          <Select label={t("races.signin.category")} name="category" value={user.category} required>
            {detail.categories.map((child) => (
              <IonSelectOption key={child} value={child}>
                {child}
              </IonSelectOption>
            ))}
          </Select>
        )}
      </ItemGroup>
      <ItemGroup title={t("races.signin.transportAndAccommodation")}>
        {detail.transport == RaceEnum.TRANSPORT_SHARED ? (
          <>
            <Toggle name="transport" checked={sharedTransport} onIonChange={(event) => setSharedTransport(event.target.checked)}>
              {t("races.signin.wantUseSharedTransport")}
            </Toggle>
            <Drawer active={sharedTransport} className="pl-4">
              {/* "" = I will not go */}
              <Select name="transport_shared" label={t("races.signin.sharedTransport")} value={sharedTransport ? user.transport_shared || -1 : ""}>
                <IonSelectOption value={-1}>{t("races.signin.needPlace")}</IonSelectOption>
                <IonSelectOption value={0}>{t("races.signin.takePeople", { count: 0 })}</IonSelectOption>
                <IonSelectOption value={1}>{t("races.signin.takePeople", { count: 1 })}</IonSelectOption>
                <IonSelectOption value={2}>{t("races.signin.takePeople", { count: 2 })}</IonSelectOption>
                <IonSelectOption value={3}>{t("races.signin.takePeople", { count: 3 })}</IonSelectOption>
                <IonSelectOption value={4}>{t("races.signin.takePeople", { count: 4 })}</IonSelectOption>
                <IonSelectOption value={5}>{t("races.signin.takePeople", { count: 5 })}</IonSelectOption>
                <IonSelectOption value={6}>{t("races.signin.takePeople", { count: 6 })}</IonSelectOption>
                <IonSelectOption value={7}>{t("races.signin.takePeople", { count: 7 })}</IonSelectOption>
                <IonSelectOption value={8}>{t("races.signin.takePeople", { count: 8 })}</IonSelectOption>
              </Select>
            </Drawer>
          </>
        ) : (
          <Toggle name="transport" checked={RaceEnum.isTransportSelectable(detail.transport) ? user.transport : detail.transport} disabled={!RaceEnum.isTransportSelectable(detail.transport)}>
            {t("races.signin.wantUseSharedTransport")}
          </Toggle>
        )}
        <br />
        <Toggle
          name="accommodation"
          checked={RaceEnum.isAccommodationSelectable(detail.accommodation) ? user.accommodation : detail.accommodation}
          disabled={!RaceEnum.isAccommodationSelectable(detail.accommodation)}
        >
          {t("races.signin.wantUseSharedAccommodation")}
        </Toggle>
      </ItemGroup>
      <ItemGroup title={t("races.signin.notes")}>
        <Input label={t("races.signin.noteApplication")} name="note" value={user.note} />
        <Input label={t("races.signin.noteInternal")} name="note_internal" value={user.note_internal} />
      </ItemGroup>
      <ItemGroup>
        <Spacing>
          <PrimaryButton onClick={() => handleSignin()}>{user.is_signed_in ? t("basic.change") : t("basic.signIn")}</PrimaryButton>
          <TransparentButton disabled={!user.is_signed_in} onClick={handleSignout}>
            {t("basic.signOut")}
          </TransparentButton>
        </Spacing>
      </ItemGroup>
    </form>
  );
};
