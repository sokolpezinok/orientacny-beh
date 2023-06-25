import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton } from '@ionic/react';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { useCallback, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Spinner, FatalError } from '../ui/Media';
import Store from '@/store';

const Logout = ({}) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Odhlásiť sa</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <LogoutContent />
      </IonContent>
    </IonPage>
  );
};
export default Logout;

const LogoutContent = ({}) => {
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);

  const handleLogout = useCallback(() => {
    SecureStoragePlugin.clear()
      .then(() => {
        Store.update(s => {
          s.token = null;
          s.club = null;
        });
        setStatus(true);
      })
      .catch(error => setError(error));
  }, []);

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  if (status === null && error === null) return <Spinner />;
  if (status === null) return <FatalError text="Problém pri odhlasovaní." error={error} />;

  return <Redirect to="/welcome" />;
};
