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
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Spinner, FatalError } from '../ui/Media';
import BoolIcon from '../ui/BoolIcon';
import HumanDate from '../ui/HumanDate';

import { busOutline, homeOutline, chevronForwardOutline } from 'ionicons/icons';

import Store from '@/store';

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
  const club = Store.useState(s => s.club);
  const token = Store.useState(s => s.token);

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const { race_id } = useParams();

  const updateData = useCallback(() => {
    if (club === null || token === null) return;
    fetch(club + 'api/race.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ action: 'detail', race_id: race_id, token }),
    })
      .then(data => data.json())
      .then(data => (data.status === 'ok' ? setData(data.data) : setError(data.message)))
      .catch(error => setError(error.message));
  }, [race_id, club, token]);

  useEffect(() => {
    updateData();
  }, [club, token, updateData]);

  const handleRefresh = event => {
    updateData();
    event.detail.complete();
  };

  if (data === null && error === null) return <Spinner />;
  if (data === null)
    return (
      <>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        <FatalError text="Nepodarilo sa načítať preteky." error={error} />
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
            <h1 className="mt-0 !font-bold">{data.name}</h1>
            <p className="!mt-4">{data.note}</p>
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
                    <HumanDate date={data.dates[0]} />
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="auto" className="text-gray-500 dark:text-gray-400">
                    Prihlásiť sa do
                  </IonCol>
                  <IonCol className="text-right">
                    <HumanDate date={data.entries[0]} />
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="auto" className="text-gray-500 dark:text-gray-400">
                    Miesto
                  </IonCol>
                  <IonCol className="text-right">{data.place}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="auto" className="text-gray-500 dark:text-gray-400">
                    Druh
                  </IonCol>
                  <IonCol className="text-right">{data.type}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="auto" className="text-gray-500 dark:text-gray-400">
                    Šport
                  </IonCol>
                  <IonCol className="text-right">{data.sport}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="auto" className="text-gray-500 dark:text-gray-400">
                    Klub
                  </IonCol>
                  <IonCol className="text-right">{data.club}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="auto" className="text-gray-500 dark:text-gray-400">
                    Preprava
                  </IonCol>
                  <IonCol className="text-right">
                    <BoolIcon bool={data.transport} />
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="auto" className="text-gray-500 dark:text-gray-400">
                    Ubytovanie
                  </IonCol>
                  <IonCol className="text-right">
                    <BoolIcon bool={data.accommodation} />
                  </IonCol>
                </IonRow>
              </IonGrid>
            </div>
          </IonAccordion>
          <IonAccordion>
            <IonItem slot="header">Prihlásení</IonItem>
            <div slot="content">
              <IonGrid className="mx-4 py-4">
                <IonRow>
                  <IonCol className="text-gray-500 dark:text-gray-400">Meno</IonCol>
                  <IonCol className="text-gray-500 dark:text-gray-400">Priezvisko</IonCol>
                  <IonCol className="text-gray-500 dark:text-gray-400" size="auto">
                    Kategória
                  </IonCol>
                  <IonCol className="text-gray-500 dark:text-gray-400" size="auto">
                    <IonIcon icon={busOutline} />
                  </IonCol>
                  <IonCol className="text-gray-500 dark:text-gray-400" size="auto">
                    <IonIcon icon={homeOutline} />
                  </IonCol>
                </IonRow>
                {data.everyone.map(child => (
                  <IonRow key={child.surname}>
                    <IonCol>{child.name}</IonCol>
                    <IonCol>{child.surname}</IonCol>
                    <IonCol size="auto">{child.category}</IonCol>
                    {/* <IonCol>{child.note}</IonCol>
              <IonCol>{child.note_internal}</IonCol> */}
                    <IonCol size="auto">
                      <BoolIcon bool={child.transport} />
                    </IonCol>
                    <IonCol size="auto">
                      <BoolIcon bool={child.accommodation} />
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
