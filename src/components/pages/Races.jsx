import { IonIcon, IonTitle, IonToolbar } from "@ionic/react";
import { calendar, location } from "ionicons/icons";

import { isEntryExpired } from "@/utils";
import { RaceApi } from "@/utils/api";
import { formatDate } from "@/utils/format";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
import Content from "../controllers/Content";
import { Item, SadFace } from "../ui/Design";

export default () => <Content Render={Races} Header={Header} updateData={RaceApi.list} errorText="Nepodarilo sa načítať preteky." />;

const Header = ({}) => (
  <IonToolbar>
    <IonTitle>Preteky</IonTitle>
  </IonToolbar>
);

const Races = ({ content }) => {
  const history = useHistory();

  if (content.length === 0) {
    return <SadFace title="V najbližšej dobe nie sú naplánované preteky." subtitle="Môžeš si zabehať nesúťažne :)" />;
  }

  return (
    <>
      {content.map((child) => (
        <Item key={child.race_id} routerLink={`/tabs/races/${child.race_id}`}>
          <h1 className={classNames("text-2xl font-bold", child.cancelled && "line-through")}>{child.name}</h1>
          {isEntryExpired(child.entries) && <span className="text-rose-500">Vypršal minimálny termín prihlášok.</span>}
          <ListItem icon={calendar}>{child.dates.map(formatDate).join(" - ")}</ListItem>
          <ListItem icon={location}>{child.place}</ListItem>
        </Item>
      ))}
    </>
  );
};

const ListItem = ({ children, icon }) => {
  return (
    <p>
      <IonIcon icon={icon} color="primary" className="align-text-top" />
      <span className="ml-2">{children}</span>
    </p>
  );
};
