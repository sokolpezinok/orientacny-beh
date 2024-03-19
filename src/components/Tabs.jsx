import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { settings, trailSign } from "ionicons/icons";
import { useEffect } from "react";
import { Redirect, Route } from "react-router-dom";

import Store, { syncStore } from "@/utils/store";
import Listener from "./Listener";
import { Spinner } from "./ui/Media";

import About from "./pages/About";
import Profile from "./pages/Profile";
import RaceDetail from "./pages/RaceDetail";
import RaceSign from "./pages/RaceSign";
import Races from "./pages/Races";
import Settings from "./pages/Settings";

const Tabs = () => {
  const is_loading = Store.useState((s) => s._is_loading);
  const is_logged_in = Store.useState((s) => s.is_logged_in);

  useEffect(() => {
    syncStore();
  }, []);

  if (is_loading) return <Spinner />;
  if (!is_logged_in) return <Redirect to="/welcome" />;

  return (
    <>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/tabs/races" render={() => <Races />} exact={true} />
          <Route path="/tabs/races/:race_id" render={() => <RaceDetail />} exact={true} />
          <Route path="/tabs/races/:race_id/sign" render={() => <RaceSign />} exact={true} />
          <Route path="/tabs/races/:race_id/sign/:user_id" render={() => <RaceSign />} exact={true} />
          <Route path="/tabs/settings" render={() => <Settings />} exact={true} />
          <Route path="/tabs/settings/profile" render={() => <Profile />} exact={true} />
          <Route path="/tabs/settings/about" render={() => <About />} exact={true} />
          <Route path="/tabs" render={() => <Redirect to="/tabs/races" />} exact={true} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom" className="shadow-2xl shadow-black">
          <IonTabButton tab="races" href="/tabs/races">
            <IonIcon icon={trailSign} />
            <IonLabel>Preteky</IonLabel>
          </IonTabButton>
          <IonTabButton tab="settings" href="/tabs/settings">
            <IonIcon icon={settings} />
            <IonLabel>Nastavenia</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
      <Listener />
    </>
  );
};

export default Tabs;
