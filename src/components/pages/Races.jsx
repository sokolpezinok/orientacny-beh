import { IonContent, IonIcon, IonPage } from "@ionic/react";
import { calendar, location } from "ionicons/icons";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { Header, Item, ItemGroup, Refresher } from "@/components/ui/Design";
import { EntriesHelper } from "@/utils";
import { RaceApi } from "@/utils/api";
import { lazyDates } from "@/utils/format";
import Content from "../controllers/Content";

export default () => {
  const { t } = useTranslation();
  return <Content Render={Races} fetchContent={RaceApi.list} errorText={t("races.racesLoadError")} />;
};

const Races = memo(({ content, onUpdate }) => {
  const { t } = useTranslation();

  if (content.length === 0) {
    return (
      <IonPage>
        <Header title={t("races.title")} />
        <IonContent>
          <Refresher onUpdate={onUpdate} />
          <ItemGroup>
            <p>{t("races.alertNoRacesTitle")}</p>
            <p>{t("races.alertNoRacesBody")}</p>
          </ItemGroup>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <Header title={t("races.title")} />
      <IonContent>
        <Refresher onUpdate={onUpdate} />
        {content.map((child) => (
          <Item key={child.race_id} routerLink={`/tabs/races/${child.race_id}`}>
            <h2 className={child.cancelled ? "line-through" : undefined}>{child.name}</h2>
            {new EntriesHelper(child.entries).isExpired() && <span className="text-error">{t("races.detail.alertDeadlineExpiredTitle")}</span>}
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
});
