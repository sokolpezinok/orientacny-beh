import { IonButton, IonButtons, IonContent, IonIcon, IonPage } from "@ionic/react";
import classNames from "classnames";
import { calendar, location, refresh } from "ionicons/icons";

import { Header, Item, Refresher, SadFace } from "@/components/ui/Design";
import { isLastEntryExpired } from "@/utils";
import { RaceApi } from "@/utils/api";
import { lazyDates } from "@/utils/format";
import Content from "../controllers/Content";

export default () => <Content Render={Races} updateData={RaceApi.list} errorText="Nepodarilo sa načítať preteky." />;

const MyHeader = ({ handleUpdate }) => (
  <Header title="Preteky">
    <IonButtons slot="end">
      <IonButton onClick={handleUpdate}>
        <IonIcon slot="icon-only" icon={refresh} />
      </IonButton>
    </IonButtons>
  </Header>
);

const Races = ({ content, handleUpdate }) => {
  if (content.length === 0) {
    return (
      <IonPage>
        <MyHeader handleUpdate={handleUpdate} />
        <IonContent>
          <Refresher handleUpdate={handleUpdate} />
          <br />
          <SadFace title="V najbližšej dobe nie sú naplánované preteky." subtitle="Môžeš si zabehať nesúťažne :)" />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <MyHeader handleUpdate={handleUpdate} />
      <IonContent>
        <Refresher handleUpdate={handleUpdate} />
        {content.map((child) => (
          <Item key={child.race_id} routerLink={`/tabs/races/${child.race_id}`}>
            <h2 className={classNames("text-2xl font-bold", child.cancelled && "line-through")}>{child.name}</h2>
            {isLastEntryExpired(child.entries) && <span className="text-error">Prihlasovanie skončilo</span>}
            <div className="grid grid-cols-[auto_1fr] gap-x-4">
              <IonIcon icon={calendar} color="primary" className="self-center" />
              {lazyDates(child.dates)}
              <IonIcon icon={location} color="primary" className="self-center" />
              {child.place}
            </div>
          </Item>
        ))}
      </IonContent>
    </IonPage>
  );
};
