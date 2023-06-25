import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { StatusBar, Style } from '@capacitor/status-bar';

import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

// import { syncStore } from '../store';

import Tabs from './pages/Tabs';
import Welcome from './pages/Welcome';
import Logout from './pages/Logout';
import Login from './pages/Login';

setupIonicReact({});

window.matchMedia('(prefers-color-scheme: dark)').addListener(async status => {
  try {
    await StatusBar.setStyle({
      style: status.matches ? Style.Dark : Style.Light,
    });
  } catch {}
});

const AppShell = () => {
  // syncStore();

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet id="main">
          <Route path="/welcome" render={() => <Welcome />} exact={true} />
          <Route path="/login" render={() => <Login />} exact={true} />
          <Route path="/logout" render={() => <Logout />} exact={true} />
          <Route path="/" render={() => <Redirect to="/tabs" />} exact={true} />
          <Route path="/tabs" render={() => <Tabs />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default AppShell;
