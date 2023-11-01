import { Redirect, Route } from "react-router-dom";
import { IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/react";
import { cog, flash } from "ionicons/icons";
import { appPublicDomain } from "@/version";
import Store, { syncStore } from "@/store";
import { useEffect, useState } from "react";
import { App } from "@capacitor/app";

import Home from "./pages/Races";
import RaceDetail from "./pages/RaceDetail";
import RaceSign from "./pages/RaceSign";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import About from "./pages/About";
import { Spinner } from "./ui/Media";

const DeepLinkListener = () => {
  const [slug, setSlug] = useState(null);

  useEffect(() => {
    App.addListener("appUrlOpen", (event) => {
      const path = new URL(event.url);
      // const regex = "[^/]+/([^/]+)/?";

      if (path.hostname !== appPublicDomain) return;
      // if (path.pathname.match(regex) === null) return;

      // const file = path.pathname.match(regex)[1];
      const params = new URLSearchParams(path.search);

      const race_id = params.get("id_zav");

      if (race_id !== null) {
        setSlug(`/tabs/races/${race_id}`);
      }
    });
  }, []);

  return slug ? <Redirect to={slug} /> : null;
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
