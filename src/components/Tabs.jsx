import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { settings, trailSign } from "ionicons/icons";
import { useEffect } from "react";
import { Redirect, Route } from "react-router-dom";

import { SystemApi } from "@/utils/api";
import { payments } from "@/utils/icons";
import { Storage } from "@/utils/storage";
import DeeplinkListener from "./controllers/DeeplinkListener";
import NotifyListener from "./controllers/NotifyListener";
import { SpinnerPage } from "./ui/Design";

import About from "./pages/About";
import Finances from "./pages/Finances";
import FinancesClaim from "./pages/FinancesClaim";
import FinancesDetail from "./pages/FinancesDetail";
import Notify from "./pages/Notify";
import Profile from "./pages/Profile";
import RaceDetail from "./pages/RaceDetail";
import RaceNotify from "./pages/RaceNotify";
import Races from "./pages/Races";
import Settings from "./pages/Settings";

export default () => {
  const isLoading = Storage.useState((s) => s.isLoading);
  const isLoggedIn = Storage.useState((s) => s.isLoggedIn);
  const allowNotify = Storage.useState((s) => s.preferences.allowNotify);

  useEffect(() => {
    if (isLoggedIn) {
      SystemApi.heartbeat();
    }
  }, [isLoggedIn]);

  if (isLoading) return <SpinnerPage />;
  if (!isLoggedIn) return <Redirect to="/login" />;

  return (
    <>
      <Tabs />
      {allowNotify && (
        <>
          <DeeplinkListener />
          <NotifyListener />
        </>
      )}
    </>
  );
};

const Tabs = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/races" component={Races} />
        <Route exact path="/tabs/races/:race_id" render={RaceDetail} />
        <Route exact path="/tabs/races/:race_id/notify" component={RaceNotify} />
        <Route exact path="/tabs/settings" component={Settings} />
        <Route exact path="/tabs/settings/profile" component={Profile} />
        <Route exact path="/tabs/settings/notify" component={Notify} />
        <Route exact path="/tabs/settings/about" component={About} />
        <Route exact path="/tabs/finances" component={Finances} />
        <Route exact path="/tabs/finances/:fin_id" component={FinancesDetail} />
        <Route exact path="/tabs/finances/:fin_id/claim" component={FinancesClaim} />
        <Route exact path="/tabs" render={() => <Redirect to="/tabs/races" />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="races" href="/tabs/races">
          <IonIcon icon={trailSign} />
          <IonLabel>Preteky</IonLabel>
        </IonTabButton>
        <IonTabButton tab="finances" href="/tabs/finances">
          <IonIcon src={payments} />
          <IonLabel>Financie</IonLabel>
        </IonTabButton>
        <IonTabButton tab="settings" href="/tabs/settings">
          <IonIcon src={settings} />
          <IonLabel>Nastavenia</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};
