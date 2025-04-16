import { IonContent, IonPage } from "@ionic/react";
import { useParams } from "react-router-dom";

import { Header, Refresher } from "@/components/ui/Design";
import { UserApi } from "@/utils/api";
import Content from "../controllers/Content";
import { DevicesContent } from "./Devices";

export default () => <Content Render={UserDevices} fetchContent={({ user_id }) => UserApi.user_devices(user_id)} errorText="Nepodarilo sa načítať dáta." />;

const UserDevices = ({ content, onUpdate }) => {
  const { user_id } = useParams();

  return (
    <IonPage>
      <Header title="Zariadenia člena" defaultHref={`/tabs/users/${user_id}`} />
      <IonContent>
        <Refresher onUpdate={onUpdate} />
        <DevicesContent content={content} onUpdate={onUpdate} />
      </IonContent>
    </IonPage>
  );
};
