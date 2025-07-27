import { IonContent, IonPage, IonRippleEffect } from "@ionic/react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { BooleanIcon, Header, Refresher } from "@/components/ui/Design";
import { UserApi } from "@/utils/api";
import Content from "../controllers/Content";

export default () => <Content Render={UserNotify} fetchContent={UserApi.statistics} />;

const UserNotify = memo(({ content, onUpdate }) => {
  const { t } = useTranslation();
  const router = useHistory();

  return (
    <IonPage>
      <Header defaultHref="/tabs/users" title={t("users.statistics.title")} />
      <IonContent>
        <Refresher onUpdate={onUpdate} />
        <table className="table">
          <thead>
            <tr>
              <th>{t("profile.name")}</th>
              <th>{t("profile.surname")}</th>
              <th>{t("users.statistics.hasAppInstalled")}</th>
              <th>{t("users.statistics.hasNotifyActivated")}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {content.map((child) => (
              <tr key={child.user_id} className="ion-activatable relative" onClick={() => router.push(`/tabs/users/${child.user_id}`)}>
                <td>{child.name}</td>
                <td>{child.surname}</td>
                <td>{<BooleanIcon value={child.device_count > 0} />}</td>
                <td>{<BooleanIcon value={child.fcm_count > 0} />}</td>
                <td>{<IonRippleEffect />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </IonContent>
    </IonPage>
  );
});
