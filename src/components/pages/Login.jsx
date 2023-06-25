import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton } from '@ionic/react';
import { useCallback, useEffect, useState } from 'react';
import { Spinner, FatalError } from '../ui/Media';
import { useLocation, useHistory } from 'react-router-dom';

import Store, { syncStorage } from '@/store';

const Login = ({}) => {
  const location = useLocation();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/welcome" />
          </IonButtons>
          <IonTitle>Prihlásiť sa</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <LoginContent {...location.state} />
      </IonContent>
    </IonPage>
  );
};
export default Login;

const LoginContent = ({ username, password, club }) => {
  const history = useHistory();

  const [error, setError] = useState(null);

  const handleResult = useCallback(
    data => {
      Store.update(s => {
        (s.token = data), (s.club = club);
      });
      syncStorage()
        .then(() => history.push('/tabs'))
        .catch(error => setError(error));
    },
    [club, history]
  );

  useEffect(() => {
    fetch(club + 'api/user.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ action: 'login', username, password }),
    })
      .then(data => data.json())
      .then(data => (data.status === 'ok' ? handleResult(data.data) : setError(data.message)))
      .catch(error => setError(error.message));
  }, [username, password, club, handleResult]);

  return error === null ? <Spinner /> : <FatalError text="Skontroluj si meno a heslo." error={error} />;
};
