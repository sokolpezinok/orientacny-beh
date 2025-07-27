import { initTranslation, useLoadTranslation } from "@/i18n";
import { StatusBar, Style } from "@capacitor/status-bar";
import { IonApp, IonPage, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { Redirect, Route } from "react-router-dom";
import Login from "./pages/Login";
import Tabs from "./Tabs";
import { Error, SpinnerPage } from "./ui/Design";

setupIonicReact({});
initTranslation();

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
