import { IonContent, IonPage } from "@ionic/react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { Header, Item, ItemGroup, Refresher } from "@/components/ui/Design";
import { UserApi } from "@/utils/api";
import Content from "../controllers/Content";

export default () => <Content Render={UserRaces} fetchContent={({ user_id }) => UserApi.user_races(user_id)} />;

const UserRaces = memo(({ content, onUpdate }) => {
  const { t } = useTranslation();
  const { user_id } = useParams();

  return (
    <IonPage>
      <Header title={t("users.races.title")} defaultHref={`/tabs/users/${user_id}`} />
      <IonContent>
        <Refresher onUpdate={onUpdate} />
        <UserRacesContent content={content} />
      </IonContent>
    </IonPage>
  );
});

const UserRacesContent = ({ content }) => {
  const { t } = useTranslation();

  if (content.length === 0) {
    return (
      <ItemGroup>
        <small>{t("users.races.noRacesFound")}</small>
      </ItemGroup>
    );
  }

  return content.map((child) => (
    <Item key={child.race_id} routerLink={`/tabs/races/${child.race_id}`}>
      <h2>{child.name}</h2>
      <p>{child.category || "-"}</p>
    </Item>
  ));
};
