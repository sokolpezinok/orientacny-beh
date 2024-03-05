import { App } from "@capacitor/app";
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { settings, trailSign } from "ionicons/icons";
import { useEffect } from "react";
import { Redirect, Route, useHistory } from "react-router-dom";

import About from "./pages/About";
import Profile from "./pages/Profile";
import RaceDetail from "./pages/RaceDetail";
import RaceSign from "./pages/RaceSign";
import Races from "./pages/Races";
import Settings from "./pages/Settings";

import { appServerDomain } from "@/manifest";
import { fatalModal } from "@/utils/modals";
import Store, { syncStore } from "@/utils/store";
import { Spinner } from "./ui/Media";

// import { PushNotifications } from "@capacitor/push-notifications";

const DeepLinkListener = () => {
  const history = useHistory();

  const handleUrlOpen = (url) => {
    // expects url in format
    // https://members.eob.cz/api/club/spt/race/132
    // https://members.eob.cz/api/club/spt/race/132/redirect
    //
    // ^/api/club/(\w+)/race/(\d+)

    const path = new URL(url);

    if (path.hostname !== appServerDomain) {
      return fatalModal("Odkaz sa nezhoduje so serverom.");
    }

    const search = /^\/api\/club\/(\w+)\/race\/(\d+)/.exec(path.pathname);

    if (search === null) {
      return fatalModal("Odkaz má neočakávaný formát.");
    }

    const [_, club, race_id] = search;

    if (club !== Store.getRawState().club.clubname) {
      return fatalModal("Odkaz nie je z tvojho klubu");
    }

    history.push(`/tabs/races/${race_id}`);
  };

  useEffect(() => {
    App.addListener("appUrlOpen", (event) => handleUrlOpen(event.url));
    // PushNotifications.addListener("pushNotificationActionPerformed", (event) =>{alert(JSON.stringify(event)); handleUrlOpen(event.notification.data.deeplink)});
  }, []);
};

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
      <DeepLinkListener />
    </>
  );
};

export default Tabs;
