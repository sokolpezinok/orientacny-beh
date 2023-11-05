import { Redirect, Route, useHistory } from "react-router-dom";
import { IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/react";
import { cog, flash } from "ionicons/icons";

import { Spinner } from "./ui/Media";

import Home from "./pages/Races";
import RaceDetail from "./pages/RaceDetail";
import RaceSign from "./pages/RaceSign";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import About from "./pages/About";

import { useEffect } from "react";
import Store, { syncStore } from "@/store";

import { App } from "@capacitor/app";
import { FatalModal } from "@/modals";
import { appServerDomain } from "@/version";

const DeepLinkListener = () => {
  const history = useHistory();

  useEffect(() => {
    App.addListener("appUrlOpen", (event) => {
      const path = new URL(event.url);
      
      if (path.hostname !== appServerDomain) return FatalModal("Odkaz sa nezhoduje so serverom.");
      if (!event.url.startsWith(Store.getRawState().club.server_url)) return FatalModal("Odkaz nie je z tvojho klubu.");
      
      const params = new URLSearchParams(path.search);
      
      const race_id = params.get("id_zav"); // anything that contain id_zav
      
      if (race_id === null) return;
      
      history.push(`/tabs/races/${race_id}`);
    });
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
        <Route path="/tabs/races" render={() => <Home />} exact={true} />
        <Route path="/tabs/races/:race_id" render={() => <RaceDetail />} exact={true} />
        <Route path="/tabs/races/:race_id/sign" render={() => <RaceSign />} exact={true} />
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
    <DeepLinkListener />
    </>
  );
};

export default Tabs;
