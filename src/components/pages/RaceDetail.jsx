import {
  IonBackButton,
  IonButtons,
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
} from "@ionic/react";

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import Store from "@/store";
import { fetchPrivateApi, privateApi } from "@/api";
import { ErrorModal } from "@/modals";

import { Share } from "@capacitor/share";

import { Spinner, FatalError, SadFace } from "../ui/Media";
import HumanDate from "../ui/HumanDate";
import Link from "../ui/Link";

import classNames from "classnames";

import { bus, home, chevronForwardOutline, shareSocial, calendar, logIn, location, checkmark, close } from "ionicons/icons";
import { category, directionsRun, group } from "../ui/CustomIcons";

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

    const data = await fetchPrivateApi(privateApi.race, { action: "detail", race_id, token }, false).catch(response => content ? ErrorModal(response) : setError(response));
    if (data === undefined) return;

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
              <IonIcon className="text-2xl cursor-pointer" onClick={handleShare} icon={shareSocial} />
            </div>
            {content.note.length > 0 ? <p className="!mt-4">{content.note}</p> : null}
            {content.link.length > 0 ? <p className="!text-orange-600 !dark:text-orange-700"><Link href={content.link}>{content.link}</Link></p> : null}
            {Math.min(...content.entries.map(a => new Date(a).getTime())) - Date.now() < 0 ? <p className="!text-rose-500">Cez appku sa už nedá prihlásiť! Kontaktuj organizátorov.</p> : null}
          </IonLabel>
        </IonItem>
        <IonItem>
          <Showcase>
            <ShowcaseItem title="Dátum" icon={calendar}><RaceDatesHelper dates={content.dates.sort()} /></ShowcaseItem>
            <ShowcaseItem title="Prihláška" icon={logIn}>do <HumanDate date={content.entries.sort()[0]} /></ShowcaseItem>
            <ShowcaseItem title="Miesto" icon={location}>{content.place}</ShowcaseItem>
            <ShowcaseItem title="Klub" src={group}>{content.club}</ShowcaseItem>
            <ShowcaseItem title="Preprava" icon={bus}>{content.transport ? "Organizovaná" : "Vlastná"}</ShowcaseItem>
            <ShowcaseItem title="Ubytovanie" icon={home}>{content.accommodation ? "Organizované" : "Vlastné"}</ShowcaseItem>
            <ShowcaseItem title="Druh" src={category}>{content.type}</ShowcaseItem>
            <ShowcaseItem title="Šport" src={directionsRun}>{content.sport}</ShowcaseItem>
          </Showcase>
        </IonItem>
        <IonItem routerLink={`/tabs/races/${race_id}/sign`} disabled={Math.min(...content.entries.map(a => new Date(a).getTime())) - Date.now() < 0}>
          <IonLabel>Prihláška</IonLabel>
          <IonIcon slot="end" icon={chevronForwardOutline} />
        </IonItem>
        <IonAccordionGroup>
          <IonAccordion>
            <IonItem slot="header">Prihlásení ({content.everyone.length})</IonItem>
            <div slot="content" className="bg-orange-50 dark:bg-transparent">
              {content.everyone.length > 0 ? (
                <IonGrid className="relative mx-4 py-4">
                <IonRow className="sticky text-orange-600 dark:text-orange-700">
                  <IonCol>Meno</IonCol>
                  <IonCol>Priezvisko</IonCol>
                  <IonCol>Kategória</IonCol>
                  <IonCol size="auto"><IonIcon icon={bus} /></IonCol>
                  <IonCol size="auto"><IonIcon icon={home} /></IonCol>
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

const RaceDatesHelper = ({dates}) => {
  if (dates.length === 1) return <HumanDate date={dates[0]} />;
  
  // assume there are only two dates in a list
  
  return <>
    <p>od <HumanDate date={dates[0]} /></p>
    <p>do <HumanDate date={dates[1]} /></p>
  </>
}

const Showcase = ({children}) => {
  return <div className="grid gap-4 py-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 w-full">{children}</div>
}

const ShowcaseItem = ({children, title, icon, src}) => {
  return <div className="px-4 py-2 bg-orange-50 dark:bg-orange-950/[.8] rounded-xl flex items-center gap-4">
    <IonIcon src={src} icon={icon} className="text-3xl" color="primary"/>
    <div>
      <div className="flex items-center text-orange-600 dark:text-orange-700 text-xl">{title}</div>
      <div>{children}</div>
    </div>
  </div>;
}

const BoolIcon = ({ value, ...props }) => {
  return <IonIcon className={value ? "text-emerald-500" : "text-rose-500"} icon={value ? checkmark : close} {...props} />;
};