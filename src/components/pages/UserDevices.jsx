import { IonContent, IonPage } from "@ionic/react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { Header, Refresher } from "@/components/ui/Design";
import { UserApi } from "@/utils/api";
import Content from "../controllers/Content";
import { DevicesContent } from "./Devices";

export default () => <Content Render={UserDevices} fetchContent={({ user_id }) => UserApi.user_devices(user_id)} />;

const UserDevices = memo(({ content, onUpdate }) => {
  const { t } = useTranslation();
  const { user_id } = useParams();

  return (
    <IonPage>
      <Header title={t("users.devices.title")} defaultHref={`/tabs/users/${user_id}`} />
      <IonContent>
        <Refresher onUpdate={onUpdate} />
        <DevicesContent content={content} onUpdate={onUpdate} />
      </IonContent>
    </IonPage>
  );
});
