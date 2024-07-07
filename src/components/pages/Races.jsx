import { IonIcon, IonList, IonTitle, IonToolbar } from "@ionic/react";
import { calendar, location } from "ionicons/icons";

import { isEntryExpired } from "@/utils";
import { RaceApi } from "@/utils/api";
import { formatDates } from "@/utils/format";
import Content from "../controllers/Content";
import { Text, Title } from "../ui/Design";
import { SadFace } from "../ui/Media";

export default () => <Content Render={Races} Header={Header} updateData={() => RaceApi.list()} errorText="Nepodarilo sa načítať preteky." />;

const Header = ({}) => (
  <IonToolbar>
    <IonTitle>Preteky</IonTitle>
  </IonToolbar>
);

const Races = ({ content }) => {
  if (content.length === 0) {
    return <SadFace text="V najbližšej dobe nie sú naplánované preteky." subtext="Môžeš si zabehať nesúťažne :)" />;
  }

  return (
    <IonList>
      {content.map((child) => (
        <Text key={child.race_id} routerLink={`/tabs/races/${child.race_id}`} className="p-2">
          <Title className={child.cancelled && "line-through"}>{child.name}</Title>
          {isEntryExpired(child.entries) && <p className="!text-rose-500">Cez appku sa už nedá prihlásiť! Kontaktuj organizátorov.</p>}
          <ListItem icon={calendar} text={formatDates(child.dates)} />
          <ListItem icon={location} text={child.place} />
        </Text>
      ))}
    </IonList>
  );
};

const ListItem = ({ icon, text }) => {
  return (
    <p>
      <IonIcon icon={icon} color="primary" className="align-text-top" />
      <span className="ml-2">{text}</span>
    </p>
  );
};
