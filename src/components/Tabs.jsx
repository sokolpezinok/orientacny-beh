import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { settings, trailSign } from "ionicons/icons";
import { Redirect, Route } from "react-router-dom";

import { Storage } from "@/utils/storage";
import DeeplinkListener from "./controllers/DeeplinkListener";
import NotifyListener from "./controllers/NotifyListener";
import { Spinner } from "./ui/Design";

import About from "./pages/About";
import Notify from "./pages/Notify";
import Profile from "./pages/Profile";
import RaceDetail from "./pages/RaceDetail";
import RaceNotify from "./pages/RaceNotify";
import RaceSign from "./pages/RaceSign";
import Races from "./pages/Races";
import Settings from "./pages/Settings";

const Tabs = () => {
  const isLoading = Storage.useState((s) => s.isLoading);
  const isLoggedIn = Storage.useState((s) => s.isLoggedIn);
  const allowNotify = Storage.useState((s) => s.preferences.allowNotify);

  if (isLoading) return <Spinner />;
  if (!isLoggedIn) return <Redirect to="/login" />;

  return (
    <>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact={true} path="/tabs/races" render={() => <Races />} />
          <Route exact={true} path="/tabs/races/:race_id" render={() => <RaceDetail />} />
          <Route exact={true} path="/tabs/races/:race_id/sign" render={() => <RaceSign />} />
          <Route exact={true} path="/tabs/races/:race_id/sign/:user_id" render={() => <RaceSign />} />
          <Route exact={true} path="/tabs/races/:race_id/notify" render={() => <RaceNotify />} />
          <Route exact={true} path="/tabs/settings" render={() => <Settings />} />
          <Route exact={true} path="/tabs/settings/profile" render={() => <Profile />} />
          <Route exact={true} path="/tabs/settings/notify" render={() => <Notify />} />
          <Route exact={true} path="/tabs/settings/about" render={() => <About />} />
          <Route exact={true} path="/tabs" render={() => <Redirect to="/tabs/races" />} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="races" href="/tabs/races">
            <IonIcon icon={trailSign} />
            <IonLabel>Preteky</IonLabel>
          </IonTabButton>
          <IonTabButton tab="settings" href="/tabs/settings">
            <IonIcon src={settings} />
            <IonLabel>Nastavenia</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
      {allowNotify && (
        <>
          <DeeplinkListener />
          <NotifyListener />
        </>
      )}
    </>
  );
};

export default Tabs;
