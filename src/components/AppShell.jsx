import { StatusBar, Style } from "@capacitor/status-bar";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";

import Tabs from "./Tabs";
import Welcome from "./pages/Welcome";

setupIonicReact({});

const matchColorMode = async (status) => {
  try {
    await StatusBar.setStyle({
      style: Style.Dark, // white text
    });
    await StatusBar.setBackgroundColor({
      color: status.matches ? "#c2410c" : "#ea580c",
    });
  } catch {}
};

// create a listener to color mode change
window.matchMedia("(prefers-color-scheme: dark)").addListener(matchColorMode);

// applies default color mode
matchColorMode(window.matchMedia("(prefers-color-scheme: dark)"));

const AppShell = () => {
  return (
    <IonApp>
      <IonReactRouter>
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
