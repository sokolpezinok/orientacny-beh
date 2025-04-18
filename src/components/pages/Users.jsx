import { IonButton, IonButtons, IonContent, IonIcon, IonItem, IonPage, IonPopover, IonRippleEffect, IonSearchbar } from "@ionic/react";
import { ellipsisVertical } from "ionicons/icons";
import { useState } from "react";

import { Header, Refresher } from "@/components/ui/Design";
import { normalize } from "@/utils";
import { UserApi } from "@/utils/api";
import { Storage } from "@/utils/storage";
import { useHistory } from "react-router-dom";
import Content from "../controllers/Content";

export default () => <Content Render={Users} fetchContent={UserApi.list} errorText="Nepodarilo sa načítať dáta." />;

const Users = ({ content, onUpdate }) => {
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
      <Header title="Členovia">
        {Storage.pull().policies.policy_mng_big && (
          <IonButtons slot="end">
            <IonButton id="ellipsis">
              <IonIcon slot="icon-only" icon={ellipsisVertical} />
            </IonButton>
            <IonPopover trigger="ellipsis" dismissOnSelect={true}>
              <IonContent>
                <IonItem routerLink="/tabs/users/notify">Poslať notifikáciu</IonItem>
                <IonItem routerLink="/tabs/users/statistics">Štatistiky</IonItem>
              </IonContent>
            </IonPopover>
          </IonButtons>
        )}
      </Header>
      <div className="bg-background">
        <IonSearchbar onIonInput={handleChange} onIonClear={handleClear} />
      </div>
      <IonContent>
        <Refresher onUpdate={onUpdate} />
        <table className="table">
          <thead>
            <tr>
              <th>Meno</th>
              <th>Priezvisko</th>
              <th>Čip</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {table.map((child) => (
              <tr key={child.user_id} className="ion-activatable relative" onClick={() => router.push({ pathname: `/tabs/users/${child.user_id}`, state: child })}>
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
};
