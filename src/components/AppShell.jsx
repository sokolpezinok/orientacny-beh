import ModalContextProvider from "@/components/ui/Modals";
import { StatusBar, Style } from "@capacitor/status-bar";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { ErrorBoundary } from "react-error-boundary";
import { Redirect, Route } from "react-router-dom";
import Tabs from "./Tabs";
import Login from "./pages/Login";
import { FatalError } from "./ui/Design";

setupIonicReact({});

const matchColorMode = async () => {
  try {
    await StatusBar.setStyle({
      style: Style.Dark, // white text
    });
    await StatusBar.setBackgroundColor({
      color: "#ea580c",
    });
  } catch {}
};

// create a listener to color mode change
window.matchMedia("(prefers-color-scheme: dark)").addListener(matchColorMode);

// applies default color mode
matchColorMode(window.matchMedia("(prefers-color-scheme: dark)"));

function Fallback({ error }) {
  return <FatalError title="Neočakávaná chyba, kvôli ktorej aplikácia nemôže fungovať." subtitle={error?.message ? error.message : error + ""} reload={false} />;
}

const AppShell = () => {
  return (
    <IonApp>
      <ModalContextProvider>
        <ErrorBoundary FallbackComponent={Fallback}>
          <IonReactRouter>
            <IonRouterOutlet id="main">
              <Route path="/login" render={() => <Login />} exact={true} />
              <Route path="/" render={() => <Redirect to="/tabs" />} exact={true} />

              {/* /tabs MUST NOT BE EXACT */}
              <Route path="/tabs" render={() => <Tabs />} exact={false} />
            </IonRouterOutlet>
          </IonReactRouter>
        </ErrorBoundary>
      </ModalContextProvider>
    </IonApp>
  );
};

export default AppShell;
