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
import { Spinner, FatalError } from "../ui/Media";
import { ErrorModal } from "../../modals";
import BoolIcon from "../ui/BoolIcon";
import HumanDate from "../ui/HumanDate";

import Store from "../../store";

import { busOutline, homeOutline, chevronForwardOutline } from "ionicons/icons";

import { fetchPrivateApi, privateApi } from "@/api";
import classNames from "classnames";

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

  const updateContent = async () => {
    const { token } = Store.getRawState();

    const data = await fetchPrivateApi(privateApi.race, { action: "detail", race_id, token }, false).catch((data) => (content ? ErrorModal(data) : setError(data.message)));
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
            <h1 className={classNames("mt-0 !font-bold", content.is_cancelled ? "line-through" : null)}>{content.name}</h1>
            {content.note.length === 0 ? null : <p className="!mt-4">{content.note}</p>}
          </IonLabel>
        </IonItem>
        <IonItem routerLink={`/tabs/races/${race_id}/sign`}>
          <IonLabel>Prihláška</IonLabel>
          <IonIcon slot="end" icon={chevronForwardOutline} />
        </IonItem>
        <IonAccordionGroup>
          <IonAccordion>
            <IonItem slot="header">Detaily</IonItem>
            <div slot="content">
              <IonGrid className="mx-4 py-4">
                <IonRow>
                  <IonCol size="auto" className="text-gray-500 dark:text-gray-400">
                    Dátum
                  </IonCol>
                  <IonCol className="text-right">
                    <HumanDate date={content.dates[0]} />
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="auto" className="text-gray-500 dark:text-gray-400">
                    Prihlásiť sa do
                  </IonCol>
                  <IonCol className="text-right">
                    <HumanDate date={content.entries[0]} />
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="auto" className="text-gray-500 dark:text-gray-400">
                    Miesto
                  </IonCol>
                  <IonCol className="text-right">{content.place}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="auto" className="text-gray-500 dark:text-gray-400">
                    Druh
                  </IonCol>
                  <IonCol className="text-right">{content.type}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="auto" className="text-gray-500 dark:text-gray-400">
                    Šport
                  </IonCol>
                  <IonCol className="text-right">{content.sport}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="auto" className="text-gray-500 dark:text-gray-400">
                    Klub
                  </IonCol>
                  <IonCol className="text-right">{content.club}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="auto" className="text-gray-500 dark:text-gray-400">
                    Možnosť prepravy
                  </IonCol>
                  <IonCol className="text-right">
                    <BoolIcon value={content.transport} />
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="auto" className="text-gray-500 dark:text-gray-400">
                    Možnosť ubytovania
                  </IonCol>
                  <IonCol className="text-right">
                    <BoolIcon value={content.accommodation} />
                  </IonCol>
                </IonRow>
              </IonGrid>
            </div>
          </IonAccordion>
          <IonAccordion>
            <IonItem slot="header">Prihlásení ({content.everyone.length})</IonItem>
            <div slot="content">
              <IonGrid className="relative mx-4 py-4">
                <IonRow className="sticky text-gray-500 dark:text-gray-400">
                  <IonCol>Meno</IonCol>
                  <IonCol>Priezvisko</IonCol>
                  <IonCol>Kategória</IonCol>
                  <IonCol size="auto">
                    <IonIcon icon={busOutline} />
                  </IonCol>
                  <IonCol size="auto">
                    <IonIcon icon={homeOutline} />
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
            </div>
          </IonAccordion>
        </IonAccordionGroup>
      </IonList>
    </>
  );
};
