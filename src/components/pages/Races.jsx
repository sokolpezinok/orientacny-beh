import { IonButton, IonButtons, IonContent, IonIcon, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import classNames from "classnames";
import { calendar, location, refresh } from "ionicons/icons";

import { Item, Refresher, SadFace } from "@/components/ui/Design";
import { isLastEntryExpired } from "@/utils";
import { RaceApi } from "@/utils/api";
import { formatDates } from "@/utils/format";
import Content from "../controllers/Content";

export default () => <Content Render={Races} updateData={RaceApi.list} errorText="Nepodarilo sa načítať preteky." />;

const Header = ({ handleUpdate }) => (
  <IonToolbar>
    <IonTitle>Preteky</IonTitle>
    <IonButtons slot="end">
      <IonButton onClick={handleUpdate}>
        <IonIcon slot="icon-only" icon={refresh} />
      </IonButton>
    </IonButtons>
  </IonToolbar>
);

const Races = ({ content, handleUpdate }) => {
  if (content.length === 0) {
    return (
      <IonPage>
        <Header handleUpdate={handleUpdate} />
        <IonContent>
          <Refresher handleUpdate={handleUpdate} />
          <SadFace title="V najbližšej dobe nie sú naplánované preteky." subtitle="Môžeš si zabehať nesúťažne :)" />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <Header handleUpdate={handleUpdate} />
      <IonContent>
        <Refresher handleUpdate={handleUpdate} />
        {content.map((child) => (
          <Item key={child.race_id} routerLink={`/tabs/races/${child.race_id}`}>
            <h1 className={classNames("text-2xl font-bold", child.cancelled && "line-through")}>{child.name}</h1>
            {isLastEntryExpired(child.entries) && <span className="text-rose-500">Prihlasovanie skončilo</span>}
            <div className="grid grid-cols-[auto_1fr] gap-x-4">
              <IonIcon icon={calendar} color="primary" className="self-center" />
              {formatDates(child.dates)}
              <IonIcon icon={location} color="primary" className="self-center" />
              {child.place}
            </div>
          </Item>
        ))}
      </IonContent>
    </IonPage>
  );
};
