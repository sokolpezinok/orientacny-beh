import { IonContent, IonIcon, IonPage } from "@ionic/react";
import { calendar, location } from "ionicons/icons";

import { Header, Item, Refresher, SadFace } from "@/components/ui/Design";
import { EntriesHelper } from "@/utils";
import { RaceApi } from "@/utils/api";
import { lazyDates } from "@/utils/format";
import Content from "../controllers/Content";

export default () => <Content Render={Races} fetchContent={RaceApi.list} errorText="Nepodarilo sa načítať preteky." />;

const Races = ({ content, onUpdate }) => {
  if (content.length === 0) {
    return (
      <IonPage>
        <Header title="Preteky" />
        <IonContent>
          <Refresher onUpdate={onUpdate} />
          <br />
          <SadFace title="V najbližšej dobe nie sú naplánované preteky." subtitle="Môžeš si zabehať nesúťažne :)" />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <Header title="Preteky" />
      <IonContent>
        <Refresher onUpdate={onUpdate} />
        {content.map((child) => (
          <Item key={child.race_id} routerLink={`/tabs/races/${child.race_id}`}>
            <h2 className={child.cancelled ? "line-through" : undefined}>{child.name}</h2>
            {new EntriesHelper(child.entries).isExpired() && <span className="text-error">Prihlasovanie skončilo</span>}
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
