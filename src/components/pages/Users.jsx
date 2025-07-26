import { IonButton, IonButtons, IonContent, IonIcon, IonItem, IonPage, IonPopover, IonRippleEffect, IonSearchbar } from "@ionic/react";
import { ellipsisVertical } from "ionicons/icons";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { Header, Refresher } from "@/components/ui/Design";
import { normalize } from "@/utils";
import { UserApi } from "@/utils/api";
import { Session } from "@/utils/storage";
import Content from "../controllers/Content";

export default () => <Content Render={Users} fetchContent={UserApi.list} errorText="Nepodarilo sa načítať dáta." />;

const Users = memo(({ content, onUpdate }) => {
  const { t } = useTranslation();
  const [table, setTable] = useState(content);
  const router = useHistory();

  const handleClear = () => {
    setTable(content);
  };

  const handleChange = (event) => {
    const value = normalize(event.target.value.trim());

    if (value === "") {
      handleClear();
      return;
    }

    const result = content.filter((child) => {
      return normalize(child.name).includes(value) || normalize(child.surname).includes(value) || (child.si_chip + "").includes(value);
    });

    setTable(result);
  };

  return (
    <IonPage>
      <Header title={t("users.title")}>
        {Session.pull().policies.mng_big && (
          <IonButtons slot="end">
            <IonButton id="ellipsis">
              <IonIcon slot="icon-only" icon={ellipsisVertical} />
            </IonButton>
            <IonPopover trigger="ellipsis" dismissOnSelect={true}>
              <IonContent>
                <IonItem routerLink="/tabs/users/notify">{t("users.notify.title")}</IonItem>
                <IonItem routerLink="/tabs/users/statistics">{t("users.statistics.title")}</IonItem>
              </IonContent>
            </IonPopover>
          </IonButtons>
        )}
      </Header>
      <div className="bg-background">
        <IonSearchbar placeholder={t("users.searchTutorial")} onIonInput={handleChange} onIonClear={handleClear} />
      </div>
      <IonContent>
        <Refresher onUpdate={onUpdate} />
        <table className="table">
          <thead>
            <tr>
              <th>{t("profile.name")}</th>
              <th>{t("profile.surname")}</th>
              <th>{t("profile.chipNumber")}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {table.map((child) => (
              <tr key={child.user_id} className="ion-activatable relative" onClick={() => router.push(`/tabs/users/${child.user_id}`, child)}>
                <td>{child.name}</td>
                <td>{child.surname}</td>
                <td>{child.si_chip}</td>
                <td>{<IonRippleEffect />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </IonContent>
    </IonPage>
  );
});
