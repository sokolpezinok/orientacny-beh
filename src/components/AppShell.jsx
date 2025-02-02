import ModalContextProvider from "@/components/ui/Modals";
import { StatusBar, Style } from "@capacitor/status-bar";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import React from "react";
import { Redirect, Route } from "react-router-dom";
import { FatalError } from "./ui/Design";

import Tabs from "./Tabs";
import Login from "./pages/Login";

setupIonicReact({});

const matchColorMode = async (status) => {
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

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  // implement error catching
  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    console.log(error, info.componentStack);
  }

  render() {
    if (this.state.error !== null) {
      return this.props.fallback(this.state.error);
    }

    return this.props.children;
  }
}

const AppShell = () => {
  return (
    <IonApp>
      <ModalContextProvider>
        <ErrorBoundary fallback={(error) => <FatalError title="Ups! Nastala chyba, ktorú musíme opraviť." subtitle={error + ""} reload={false} />}>
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
