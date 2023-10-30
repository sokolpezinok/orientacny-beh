import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { StatusBar, Style } from "@capacitor/status-bar";
import { App } from "@capacitor/app";

import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route, useHistory } from "react-router-dom";

import Tabs from "./Tabs";
import Welcome from "./pages/Welcome";
import { useEffect, useState } from "react";

setupIonicReact({});

const matchColorMode = async (status) => {
  try {
    await StatusBar.setStyle({
      style: Style.Dark, // white text
    });
    await StatusBar.setBackgroundColor({
      color: status.matches ? "#c2410c" : "#ea580c",
    })
  } catch {}
}

// create a listener to color mode change
window.matchMedia("(prefers-color-scheme: dark)").addListener(matchColorMode);

// applies default color mode
matchColorMode(window.matchMedia("(prefers-color-scheme: dark)"));

const DeepLinkListener = () => {
  const [slug, setSlug] = useState(null);

  useEffect(() => {
    App.addListener("appUrlOpen", (event) => {
      const path = event.url.split(".app").pop();
      
      if (path) setSlug(path);
    });
  }, []);

  return slug ? <Redirect to={slug} /> : null;
};

const AppShell = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <DeepLinkListener />
        <IonRouterOutlet id="main">
          <Route path="/welcome" render={() => <Welcome />} exact={true} />
          <Route path="/" render={() => <Redirect to="/tabs" />} exact={true} />
          <Route path="/tabs" render={() => <Tabs />} />
          {/* /tabs MUST NOT BE EXACT */}
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default AppShell;
