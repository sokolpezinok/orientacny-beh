import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { people, settings, trailSign } from "ionicons/icons";
import { lazy, memo, Suspense, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";

import { SystemApi } from "@/utils/api";
import { payments } from "@/utils/icons";
import { Session, Storage } from "@/utils/storage";
import DeeplinkListener from "./controllers/DeeplinkListener";
import NotifyListener from "./controllers/NotifyListener";
import { SpinnerPage } from "./ui/Design";

const Wrapper = (func) => {
  const Render = lazy(func);

  return memo((props) => {
    return (
      <Suspense fallback={<SpinnerPage />}>
        <Render {...props} />
      </Suspense>
    );
  });
};

const About = Wrapper(() => import("./pages/About"));
const Finances = Wrapper(() => import("./pages/Finances"));
const FinancesClaim = Wrapper(() => import("./pages/FinancesClaim"));
const FinancesDetail = Wrapper(() => import("./pages/FinancesDetail"));
const Notify = Wrapper(() => import("./pages/Notify"));
const Profile = Wrapper(() => import("./pages/Profile"));
const Devices = Wrapper(() => import("./pages/Devices"));
const RaceDetail = Wrapper(() => import("./pages/RaceDetail"));
const RaceNotify = Wrapper(() => import("./pages/RaceNotify"));
const Races = Wrapper(() => import("./pages/Races"));
const Settings = Wrapper(() => import("./pages/Settings"));
const UserDetail = Wrapper(() => import("./pages/UserDetail"));
const UserNotify = Wrapper(() => import("./pages/UserNotify"));
const UserNotifyEveryone = Wrapper(() => import("./pages/UserNotifyEveryone"));
const UserProfile = Wrapper(() => import("./pages/UserProfile"));
const UserDevices = Wrapper(() => import("./pages/UserDevices"));
const UserRaces = Wrapper(() => import("./pages/UserRaces"));
const Users = Wrapper(() => import("./pages/Users"));
const UserStatistics = Wrapper(() => import("./pages/UserStatistics"));

export default memo(({}) => {
  const appLoading = Session.useState((s) => s.appLoading);
  const isLoggedIn = Storage.useState((s) => s.isLoggedIn);
  const allowNotify = Storage.useState((s) => s.preferences.activeNotify);

  useEffect(() => {
    if (isLoggedIn) {
      SystemApi.device_update();
      Session.fetch_user_data();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    Storage.load();
  }, []);

  if (appLoading) return <SpinnerPage />;
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
});

const Tabs = memo(({}) => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/races" component={Races} />
        <Route exact path="/tabs/races/:race_id" component={RaceDetail} />
        <Route exact path="/tabs/races/:race_id/notify" component={RaceNotify} />
        <Route exact path="/tabs/settings" component={Settings} />
        <Route exact path="/tabs/settings/profile" component={Profile} />
        <Route exact path="/tabs/settings/devices" component={Devices} />
        <Route exact path="/tabs/settings/notify" component={Notify} />
        <Route exact path="/tabs/settings/about" component={About} />
        <Route exact path="/tabs/finances" component={Finances} />
        <Route exact path="/tabs/finances/:fin_id" component={FinancesDetail} />
        <Route exact path="/tabs/finances/:fin_id/claim" component={FinancesClaim} />
        <Route exact path="/tabs/users" component={Users} />
        <Route exact path="/tabs/users/:user_id/" component={UserDetail} />
        <Route exact path="/tabs/users/:user_id/races" component={UserRaces} />
        <Route exact path="/tabs/users/:user_id/notify" component={UserNotify} />
        <Route exact path="/tabs/users/:user_id/profile" component={UserProfile} />
        <Route exact path="/tabs/users/:user_id/devices" component={UserDevices} />
        <Route exact path="/tabs/users/notify" component={UserNotifyEveryone} />
        <Route exact path="/tabs/users/statistics" component={UserStatistics} />
        <Route exact path="/tabs" render={() => <Redirect to="/tabs/races" />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom" id="ion-tab-bar">
        <IonTabButton tab="races" href="/tabs/races">
          <IonIcon icon={trailSign} />
          <IonLabel>Preteky</IonLabel>
        </IonTabButton>
        <IonTabButton tab="finances" href="/tabs/finances">
          <IonIcon src={payments} />
          <IonLabel>Financie</IonLabel>
        </IonTabButton>
        <IonTabButton tab="users" href="/tabs/users">
          <IonIcon src={people} />
          <IonLabel>Členovia</IonLabel>
        </IonTabButton>
        <IonTabButton tab="settings" href="/tabs/settings">
          <IonIcon src={settings} />
          <IonLabel>Nastavenia</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
});
