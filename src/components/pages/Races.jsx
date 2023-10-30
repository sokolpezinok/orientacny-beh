import { IonItem, IonList, IonIcon, IonPage, IonHeader, IonToolbar, IonTitle, IonLabel, IonContent, IonRefresher, IonRefresherContent } from "@ionic/react";
import { location, calendar } from "ionicons/icons";
import HumanDate from "../ui/HumanDate";
import { Spinner, FatalError, SadFace } from "../ui/Media";
import { useEffect, useState } from "react";

import Store from "@/store";
import { fetchPrivateApi, privateApi } from "@/api";
import { ErrorModal } from "@/modals";

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
    const data = await fetchPrivateApi(privateApi.race, { action: "list" }, false).catch((data) => (content ? ErrorModal(data.message) : setError(data.message)));
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
        <SadFace text="V najbližšej dobe nie sú naplánované preteky." subtext="Stále však môžeš behať sám/-a :)" />
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
              <h1 className="text-gray text-xl !font-bold text-gray-700 dark:text-gray-200">
                <span className={child.is_cancelled ? "line-through" : null}>{child.name}</span>
              </h1>
              <p>
                <IonIcon icon={calendar} className="align-text-top" color="primary" />
                <span className="ml-2">
                  <HumanDate date={child.dates[0]} />
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
