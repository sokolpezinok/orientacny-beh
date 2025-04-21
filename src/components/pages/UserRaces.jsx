import { IonContent, IonPage } from "@ionic/react";
import { memo } from "react";
import { useParams } from "react-router-dom";

import { Header, Item, ItemGroup, Refresher } from "@/components/ui/Design";
import { UserApi } from "@/utils/api";
import Content from "../controllers/Content";

export default () => <Content Render={UserRaces} fetchContent={({ user_id }) => UserApi.user_races(user_id)} errorText="Nepodarilo sa načítať dáta." />;

const UserRaces = memo(({ content, onUpdate }) => {
  const { user_id } = useParams();

  return (
    <IonPage>
      <Header title="Preteky člena" defaultHref={`/tabs/users/${user_id}`} />
      <IonContent>
        <Refresher onUpdate={onUpdate} />
        <UserRacesContent content={content} />
      </IonContent>
    </IonPage>
  );
});

const UserRacesContent = ({ content }) => {
  if (content.length === 0) {
    return (
      <ItemGroup>
        <small>(žiadne preteky)</small>
      </ItemGroup>
    );
  }

  return content.map((child) => (
    <Item key={child.race_id} routerLink={`/tabs/races/${child.race_id}`}>
      <h2>{child.name}</h2>
      <p>{child.category}</p>
    </Item>
  ));
};
