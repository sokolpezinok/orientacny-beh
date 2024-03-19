import { StatusBar, Style } from "@capacitor/status-bar";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";

import ModalContextProvider from "@/utils/modals";

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
      <ModalContextProvider>
        <IonReactRouter>
          <IonRouterOutlet id="main">
            <Route path="/welcome" render={() => <Welcome />} exact={true} />
            <Route path="/" render={() => <Redirect to="/tabs" />} exact={true} />

            {/* /tabs MUST NOT BE EXACT */}
            <Route path="/tabs" render={() => <Tabs />} exact={false} />
          </IonRouterOutlet>
        </IonReactRouter>
      </ModalContextProvider>
    </IonApp>
  );
};

export default AppShell;
