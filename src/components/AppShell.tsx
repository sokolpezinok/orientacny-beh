import { initTranslation } from "@/i18n";
import { Storage } from "@/utils/storage";
import { Capacitor, SystemBars, SystemBarsStyle } from "@capacitor/core";
import { IonApp, IonPage, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { Redirect, Route } from "react-router-dom";
import Login from "./pages/Login";
import Tabs from "./Tabs";
import { Fatal, SpinnerPage } from "./ui/Design";

setupIonicReact({});
initTranslation();
Storage.hydrate();

const matchMediaListener = async (event: MediaQueryList | MediaQueryListEvent) => {
  if (Capacitor.isNativePlatform()) {
    SystemBars.setStyle({
      style: event.matches
        ? SystemBarsStyle.Dark // white text/icons
        : SystemBarsStyle.Light, // dark text/icons
    });
  }
};

function Fallback({ error }: { error: Error }) {
  const { t } = useTranslation();

  return (
    <IonPage>
      <Fatal title={t("api.fatalError")} subtitle={error?.message ? error.message : error + ""} />
    </IonPage>
  );
}

const AppShell = () => {
  useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");

    matchMedia.addEventListener("change", matchMediaListener);
    matchMediaListener(matchMedia);

    return () => {
      matchMedia.removeEventListener("change", matchMediaListener);
    };
  }, []);

  const isHydrated = Storage.useState((s) => s.hydrated);

  if (!isHydrated) return <SpinnerPage />;

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
