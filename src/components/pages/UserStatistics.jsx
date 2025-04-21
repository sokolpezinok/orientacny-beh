import { IonContent, IonPage, IonRippleEffect } from "@ionic/react";
import { memo } from "react";
import { useHistory } from "react-router-dom";

import { BooleanIcon, Header, Refresher } from "@/components/ui/Design";
import { UserApi } from "@/utils/api";
import Content from "../controllers/Content";

export default () => <Content Render={UserNotify} fetchContent={UserApi.statistics} errorText="Nepodarilo sa načítať dáta." />;

const UserNotify = memo(({ content, onUpdate }) => {
  const router = useHistory();

  return (
    <IonPage>
      <Header defaultHref="/tabs/users" title="Štatistiky" />
      <IonContent>
        <Refresher onUpdate={onUpdate} />
        <table className="table">
          <thead>
            <tr>
              <th>Meno</th>
              <th>Priezvisko</th>
              <th>Aplikácia</th>
              <th>Notifikácie</th>
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
