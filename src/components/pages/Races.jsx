import { IonCard, IonIcon, IonPage, IonHeader, IonToolbar, IonTitle, IonLabel, IonContent, IonRefresher, IonRefresherContent } from '@ionic/react';
import { location, calendar } from 'ionicons/icons';
import HumanDate from '../ui/HumanDate';
import { Spinner, FatalError } from '../ui/Media';
import { useCallback, useEffect, useState } from 'react';

import Store from '@/store';

const Races = ({}) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Preteky</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <RacesContent />
      </IonContent>
    </IonPage>
  );
};
export default Races;

const RacesContent = ({}) => {
  const club = Store.useState(s => s.club);

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const updateData = useCallback(() => {
    if (club === null) return;
    fetch(club + 'api/race.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ action: 'list' }),
    })
      .then(data => data.json())
      .then(data => (data.status === 'ok' ? setData(data.data) : setError(data.message)))
      .catch(error => setError(error.message));
  }, [club]);

  useEffect(() => {
    updateData();
  }, [club, updateData]);

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
      {data.map(child => (
        <IonCard key={child.race_id} routerLink={`/tabs/races/${child.race_id}`} className="rounded-md p-4 shadow-md">
          <IonLabel>
            <h1 className="text-gray text-xl !font-bold text-gray-700 dark:text-gray-200">
              <span className={child.is_cancelled ? 'line-through' : null}>{child.name}</span>
            </h1>
            <p>
              <IonIcon icon={calendar} className="align-text-top" color="primary" />
              <span className="ml-2">
                <HumanDate date={child.dates[0]} />
              </span>
            </p>
            <p>
              <IonIcon icon={location} className="align-text-top" color="primary" />
              <span className="ml-2">{child.place}</span>
            </p>
          </IonLabel>
        </IonCard>
      ))}
    </>
  );

  return;
};
