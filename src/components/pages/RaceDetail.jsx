import {
  IonBackButton,
  IonButtons,
  IonRippleEffect,
  IonItem,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonList,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonAccordionGroup,
  IonAccordion,
  IonButton,
} from "@ionic/react";

import { useParams, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";

import Store from "@/store";
import { fetchPrivateApi, privateApi } from "@/api";
import { AlertModal, ErrorModal } from "@/modals";

import { Share } from "@capacitor/share";

import { Spinner, FatalError, SadFace } from "../ui/Media";
import HumanDate from "../ui/HumanDate";
import Link from "../ui/Link";

import classNames from "classnames";

import { bus, home, chevronForwardOutline, shareSocial, calendar, logIn, location, checkmark, close, refresh } from "ionicons/icons";
import { category, directionsRun, group } from "../ui/CustomIcons";
import BoolIcon from "../ui/BoolIcon";

const RaceDetail = ({}) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/races" />
          </IonButtons>
          <IonTitle>Detail</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <RaceDetailContent />
      </IonContent>
    </IonPage>
  );
};
export default RaceDetail;

const RaceDetailContent = ({}) => {
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);

  const { race_id } = useParams();

  const history = useHistory();

  const handleShare = async () => {
    const shareSupport = await Share.canShare();

    if (!shareSupport.value) return ErrorModal("Share is not avaible in browser.");

    await Share.share({
      title: content.name,
      text: `${content.name} ${content.note}`,
      url: `${Store.getRawState().club.server_url}race_info_show.php?id_zav=${race_id}`,
      dialogTitle: content.name,
    });
  };

  const updateContent = async () => {
    const { token } = Store.getRawState();

    const data = await fetchPrivateApi(privateApi.race, { action: "detail", race_id, token }, false).catch((response) => (content ? ErrorModal(response) : setError(response)));
    if (data === undefined) return;

    data.relations = await fetchPrivateApi(privateApi.race, { action: "relations", race_id, token }, false).catch((response) => (content ? ErrorModal(response) : setError(response)));
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

  if (content === null && error === null) return <Spinner />;
  if (content === null)
    return (
      <>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        <FatalError text="Nepodarilo sa načítať detail." error={error} />
      </>
    );

  const isEntryAllowed = Math.min(...content.entries.map((a) => new Date(a).getTime())) - Date.now() >= 0;

  return (
    <>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent />
      </IonRefresher>
      <IonList>
        <IonItem>
          <IonLabel className="ion-text-wrap">
            <div className="flex w-full justify-between">
              <h1 className={classNames("mt-0 !font-bold", content.is_cancelled ? "line-through" : null)}>{content.name}</h1>
              <IonIcon className="cursor-pointer text-2xl" onClick={handleShare} icon={shareSocial} />
            </div>
            {content.note.length > 0 ? <p className="!mt-4">{content.note}</p> : null}
            {content.link.length > 0 ? (
              <p className="!dark:text-orange-700 !text-orange-600">
                <Link href={content.link}>{content.link}</Link>
              </p>
            ) : null}
            {!isEntryAllowed ? <p className="!text-rose-500">Cez appku sa už nedá prihlásiť! Kontaktuj organizátorov.</p> : null}
          </IonLabel>
        </IonItem>
        <IonItem>
          <Showcase>
            <ShowcaseItem title="Dátum" icon={calendar}>
              <RaceDatesHelper dates={content.dates.sort()} />
            </ShowcaseItem>
            <ShowcaseItem title="Prihláška" icon={logIn} onClick={() => history.push(`/tabs/races/${race_id}/sign`)}>
              do <HumanDate date={content.entries.sort()[0]} />
            </ShowcaseItem>
            <ShowcaseItem title="Miesto" icon={location}>
              {content.place}
            </ShowcaseItem>
            <ShowcaseItem title="Klub" src={group}>
              {content.club}
            </ShowcaseItem>
            <ShowcaseItem title="Preprava" icon={bus}>
              {content.transport ? "Organizovaná" : "Vlastná"}
            </ShowcaseItem>
            <ShowcaseItem title="Ubytovanie" icon={home}>
              {content.accommodation ? "Organizované" : "Vlastné"}
            </ShowcaseItem>
            <ShowcaseItem title="Druh" src={category}>
              {content.type}
            </ShowcaseItem>
            <ShowcaseItem title="Šport" src={directionsRun}>
              {content.sport}
            </ShowcaseItem>
          </Showcase>
        </IonItem>
        <IonItem routerLink={`/tabs/races/${race_id}/sign`} disabled={!isEntryAllowed}>
          <IonLabel>Prihláška</IonLabel>
          <IonIcon slot="end" icon={chevronForwardOutline} />
        </IonItem>
        <IonAccordionGroup>
          <IonAccordion>
            <IonItem slot="header">Moji členovia</IonItem>
            <div slot="content" className="bg-orange-50 p-4 dark:bg-transparent">
              <IonButton fill="clear" className="mb-4 w-full" onClick={updateContent}>
                <IonIcon slot="start" icon={refresh} />
                Aktualizovať zoznam
              </IonButton>
              <div className="flex flex-col gap-y-4">
                {content.relations.map((item) => (
                  <IonLabel
                    key={item.user_id}
                    className="cursor-pointer"
                    onClick={() => (isEntryAllowed ? history.push(`/tabs/races/${race_id}/sign/${item.user_id}`) : AlertModal("Cez appku sa už nedá prihlásiť!"))}
                  >
                    <h2>
                      {item.name} {item.surname} ({item.chip_number})
                      <span className="ml-2">
                        <BoolIcon value={item.is_signed_in} />
                      </span>
                    </h2>
                    <p>{item.category}</p>
                  </IonLabel>
                ))}
              </div>
            </div>
          </IonAccordion>
          <IonAccordion>
            <IonItem slot="header">Prihlásení ({content.everyone.length})</IonItem>
            <div slot="content" className="bg-orange-50 p-4 dark:bg-transparent">
              <IonButton fill="clear" className="mb-4 w-full" onClick={updateContent}>
                <IonIcon slot="start" icon={refresh} />
                Aktualizovať zoznam
              </IonButton>
              {content.everyone.length > 0 ? (
                <IonGrid className="relative p-0">
                  <IonRow className="sticky text-orange-600 dark:text-orange-700">
                    <IonCol>Meno</IonCol>
                    <IonCol>Priezvisko</IonCol>
                    <IonCol>Kategória</IonCol>
                    <IonCol size="auto">
                      <IonIcon icon={bus} />
                    </IonCol>
                    <IonCol size="auto">
                      <IonIcon icon={home} />
                    </IonCol>
                  </IonRow>
                  {content.everyone.map((child, index) => (
                    <IonRow key={index}>
                      <IonCol>{child.name}</IonCol>
                      <IonCol>{child.surname}</IonCol>
                      <IonCol>{child.category}</IonCol>
                      {/* <IonCol>{child.note}</IonCol> */}
                      {/* <IonCol>{child.note_internal}</IonCol> */}
                      <IonCol size="auto">
                        <BoolIcon value={child.transport} />
                      </IonCol>
                      <IonCol size="auto">
                        <BoolIcon value={child.accommodation} />
                      </IonCol>
                    </IonRow>
                  ))}
                </IonGrid>
              ) : (
                <div className="p-4">
                  <SadFace text="Zatiaľ sa nikto neprihlásil." subtext="Môžeš sa prihlásiť ako prvý/-á :)" />
                </div>
              )}
            </div>
          </IonAccordion>
        </IonAccordionGroup>
      </IonList>
    </>
  );
};

const RaceDatesHelper = ({ dates }) => {
  if (dates.length === 1) return <HumanDate date={dates[0]} />;

  // assume there are only two dates in a list

  return (
    <>
      <p>
        od <HumanDate date={dates[0]} />
      </p>
      <p>
        do <HumanDate date={dates[1]} />
      </p>
    </>
  );
};

const Showcase = ({ children }) => {
  return <div className="grid w-full grid-cols-2 gap-4 py-4 sm:grid-cols-3 md:grid-cols-4">{children}</div>;
};

const ShowcaseItem = ({ children, title, icon, src, onClick }) => {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-orange-100 px-4 py-2 dark:bg-orange-950/[.5]" onClick={onClick}>
      <IonIcon src={src} icon={icon} className="hidden text-3xl xs:block" color="primary" />
      <div>
        <div className="flex items-center text-xl text-orange-600 dark:text-orange-700">{title}</div>
        <div>{children}</div>
      </div>
    </div>
  );
};
