import { IonItem, IonList, IonIcon, IonPage, IonHeader, IonToolbar, IonTitle, IonLabel, IonContent, IonRefresher, IonRefresherContent } from "@ionic/react";
import { location, calendar } from "ionicons/icons";
import HumanDate from "../ui/HumanDate";
import { Spinner, FatalError, SadFace } from "../ui/Media";
import { useEffect, useState } from "react";

import Store from "@/store";
import { fetchPrivateApi, privateApi } from "@/api";
import { ErrorModal } from "@/modals";
import classNames from "classnames";

const Races = ({}) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Preteky</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <RacesContent />
      </IonContent>
    </IonPage>
  );
};
export default Races;

const RacesContent = ({}) => {
  const club = Store.useState((s) => s.club);

  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);

  const updateContent = async () => {
    const data = await fetchPrivateApi(privateApi.race, { action: "list" }, false).catch(response => content ? ErrorModal(response) : setError(response));
    if (data === undefined) return;

    setContent(data);
  };

  useEffect(() => {
    updateContent();
  }, [club]);

  const handleRefresh = (event) => {
    updateContent();
    event.detail.complete();
  };

  const RefresherContent = () => {
    return (
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent />
      </IonRefresher>
    );
  };

  if (content === null && error === null) return <Spinner />;
  if (content === null) {
    return (
      <>
        <RefresherContent />
        <FatalError text="Nepodarilo sa načítať preteky." error={error} />
      </>
    );
  }
  if (content.length === 0) {
    return (
      <>
        <RefresherContent />
        <SadFace text="V najbližšej dobe nie sú naplánované preteky." subtext="Môžeš si zabehať nesúťažne :)" />
      </>
    );
  }

  return (
    <>
      <RefresherContent />
      <IonList>
        {content.map((child) => (
          <IonItem key={child.race_id} routerLink={`/tabs/races/${child.race_id}`} className="p-2">
            <IonLabel>
              <h1 className={classNames("text-xl !font-bold text-gray-700 dark:text-gray-200")}>
                <span className={child.is_cancelled ? "line-through" : null}>{child.name}</span>
              </h1>
              {Math.min(...child.entries.map(a => new Date(a).getTime())) - Date.now() < 0 ? <p className="!text-rose-500">Cez appku sa už nedá prihlásiť! Kontaktuj organizátorov.</p> : null}
              <p>
                <IonIcon icon={calendar} className="align-text-top" color="primary" />
                <span className="ml-2">
                  <HumanDate date={child.dates[0]} />{ child.dates.length > 1 ? (<><span> - </span><HumanDate date={child.dates[1]} /></>) : null}
                </span>
              </p>
              <p>
                <IonIcon icon={location} className="align-text-top" color="primary" />
                <span className="ml-2">{child.place}</span>
              </p>
            </IonLabel>
          </IonItem>
        ))}
      </IonList>
    </>
  );

  return;
};
