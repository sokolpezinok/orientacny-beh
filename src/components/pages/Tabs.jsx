import { Redirect, Route } from 'react-router-dom';
import { IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { cog, flash } from 'ionicons/icons';
import Store, { syncStore } from '@/store';
import { useEffect, useState } from 'react';

import Home from './Races';
import RaceDetail from './RaceDetail';
import RaceSign from './RaceSign';
import Settings from './Settings';
import Profile from './Profile';
import About from './About';
import { Spinner } from '../ui/Media';

const Tabs = () => {
  const token = Store.useState(s => s.token);
  const club = Store.useState(s => s.club);

  const [signed, setSigned] = useState(null);

  useEffect(() => {
    syncStore();
  }, []);

  useEffect(() => {
    if (token === undefined || club === undefined) return;
    setSigned(token !== null && club !== null);
  }, [token, club]);

  if (signed === null) return <Spinner />;
  if (signed === false) return <Redirect to="/welcome" />;

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/tabs/races" render={() => <Home />} exact={true} />
        <Route path="/tabs/races/:race_id" render={() => <RaceDetail />} exact={true} />
        <Route path="/tabs/races/:race_id/sign" render={() => <RaceSign />} exact={true} />
        {/* <Route path="/tabs/lists" render={() => <Lists />} exact={true} /> */}
        <Route path="/tabs/settings" render={() => <Settings />} exact={true} />
        <Route path="/tabs/settings/profile" render={() => <Profile />} exact={true} />
        <Route path="/tabs/settings/about" render={() => <About />} exact={true} />
        <Route path="/tabs" render={() => <Redirect to="/tabs/races" />} exact={true} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom" className="shadow-2xl shadow-black">
        <IonTabButton tab="races" href="/tabs/races">
          <IonIcon icon={flash} />
          <IonLabel>Preteky</IonLabel>
        </IonTabButton>
        <IonTabButton tab="settings" href="/tabs/settings">
          <IonIcon icon={cog} />
          <IonLabel>Nastavenia</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
