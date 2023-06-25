import {
  IonBackButton,
  IonButtons,
  IonItem,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonList,
  IonSelect,
  IonSelectOption,
  IonToggle,
  useIonAlert,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';

import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Spinner, FatalError } from '../ui/Media';
import Form from '../ui/Form';
import { Button, ButtonsWrapper } from '../ui/Buttons';
import Store from '@/store';

const RaceSign = ({}) => {
  const { race_id } = useParams();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={`/tabs/races/${race_id}`} />
          </IonButtons>
          <IonTitle>Prihláška</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <RaceSignContent />
      </IonContent>
    </IonPage>
  );
};

export default RaceSign;

const RaceSignContent = ({}) => {
  const club = Store.useState(s => s.club);
  const token = Store.useState(s => s.token);

  const [presentAlert] = useIonAlert();
  const emitAlert = text =>
    presentAlert({
      message: text,
      buttons: ['OK'],
    });

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const { race_id } = useParams();

  const updateData = useCallback(() => {
    if (club === null || token === null) return;
    fetch(club + 'api/race.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'detail', race_id, token }) })
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

  const handleSubmit = els => {
    const wanted_inputs = {
      category: els.category.value,
      transport: els.transport.checked,
      accommodation: els.accommodation.checked,
      note: els.note.value,
      note_internal: els.note_internal.value,
    };

    if (wanted_inputs.category === '') return emitAlert('Nezabudni zadať kategóriu.');

    fetch(club + 'api/race.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ action: 'signin', race_id, token, ...wanted_inputs }),
    })
      .then(data => data.json())
      .then(data => (data.status === 'ok' ? emitAlert('Hotovo!').then(updateData) : emitAlert(data.message)))
      .catch(error => emitAlert(error.message));
  };

  const handleSignout = () => {
    fetch(club + 'api/race.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ action: 'signout', race_id, token }),
    })
      .then(data => data.json())
      .then(data => (data.status === 'ok' ? emitAlert('Hotovo').then(updateData) : emitAlert(data.message)))
      .catch(error => emitAlert(error.message));
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
      <div className="w-full md:w-1/3">
        <Form onSubmit={handleSubmit}>
          {/* <Image src={favicon} className="m-auto mb-4 w-24" alt="Orienteering Logo" /> */}
          <IonList>
            <IonItem>
              <IonSelect label="Kategória *" labelPlacement="floating" name="category" value={data.myself.category}>
                {data.categories.map(child => (
                  <IonSelectOption key={child} value={child}>
                    {child}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonItem>
              {/* transport can be: 0 => not avaible; 1 = up to user; 2 = commanded */}
              <IonToggle labelPlacement="start" name="transport" checked={data.transport == 1 ? data.myself.transport : data.transport} disabled={data.transport != 1}>
                Chcem využiť spoločnú dopravu
              </IonToggle>
            </IonItem>
            <IonItem>
              {/* accommodation can be: 0 => not avaible; 1 = up to user; 2 = commanded */}
              <IonToggle labelPlacement="start" name="accommodation" checked={data.accommodation == 1 ? data.myself.accommodation : data.accommodation} disabled={data.accommodation != 1}>
                Chcem využiť spoločné ubytovanie
              </IonToggle>
            </IonItem>
            <IonItem>
              <IonInput label="Poznámka (do prihlášky)" labelPlacement="floating" name="note" placeholder="..." value={data.myself.note} />
            </IonItem>
            <IonItem>
              <IonInput label="Poznámka (interná)" labelPlacement="floating" name="note_internal" placeholder="..." value={data.myself.note_internal}></IonInput>
            </IonItem>
            <IonItem>
              <ButtonsWrapper>
                <Button primary={true} type="submit">
                  {data.am_i_signed ? 'Zmeniť' : 'Prihlásiť sa'}
                </Button>
                <Button disabled={!data.am_i_signed} type="button" onClick={handleSignout}>
                  Odhlásiť sa
                </Button>
              </ButtonsWrapper>
            </IonItem>
          </IonList>
        </Form>
      </div>
    </>
  );
};
