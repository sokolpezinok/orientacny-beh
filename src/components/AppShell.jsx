import { initTranslation, useLoadTranslation } from "@/i18n";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { EdgeToEdge } from "@capawesome/capacitor-android-edge-to-edge-support";
import { IonApp, IonPage, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Color from "color";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { Redirect, Route } from "react-router-dom";
import Login from "./pages/Login";
import Tabs from "./Tabs";
import { Error, SpinnerPage } from "./ui/Design";

setupIonicReact({});
initTranslation();

const toolbarColor = "#ea580c";

const matchMediaListener = async (event) => {
  if (Capacitor.getPlatform() === "android" && Capacitor.isPluginAvailable("StatusBar")) {
    StatusBar.setStyle({
      style: event.matches
        ? Style.Dark // white text
        : Style.Light, // dark text
    });
    StatusBar.setBackgroundColor({ color: toolbarColor });
  }

  if (Capacitor.isPluginAvailable("EdgeToEdge")) {
    const color = window.getComputedStyle(document.body).backgroundColor;

    if (!color) {
      return;
    }

    EdgeToEdge.setBackgroundColor({ color: Color(color).hex() });
  }
};

const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");

matchMedia.addEventListener("change", matchMediaListener);
matchMediaListener(matchMedia);

function Fallback({ error }) {
  const { t } = useTranslation();

  return (
    <IonPage>
      <Error title={t("api.fatalError")} subtitle={error?.message ? error.message : error + ""} />
    </IonPage>
  );
}

const AppShell = () => {
  useLoadTranslation();

  return (
    <IonApp>
      <ErrorBoundary FallbackComponent={Fallback}>
        <Suspense fallback={<SpinnerPage />}>
          <IonReactRouter>
            <IonRouterOutlet>
              <Route exact path="/login" component={Login} />
              <Route exact path="/" render={() => <Redirect to="/tabs" />} />
              <Route exact={false} path="/tabs" component={Tabs} />
            </IonRouterOutlet>
          </IonReactRouter>
        </Suspense>
      </ErrorBoundary>
    </IonApp>
  );
};

export default AppShell;
