import { IonButton, IonButtons, IonContent, IonIcon, IonItem, IonPage, IonPopover, IonRippleEffect, IonSearchbar } from "@ionic/react";
import { ellipsisVertical } from "ionicons/icons";
import { useState } from "react";

import { Header, Refresher } from "@/components/ui/Design";
import { normalize } from "@/utils";
import { UserApi } from "@/utils/api";
import { Storage } from "@/utils/storage";
import Content, { Modal } from "../controllers/Content";
import { UserDetail } from "./UserDetail";

export default () => <Content Render={Users} fetchContent={UserApi.list} errorText="Nepodarilo sa načítať dáta." />;

const Users = ({ content, onUpdate }) => {
  const [table, setTable] = useState(content);
  const [select, setSelect] = useState(null);
  const handleClose = () => setSelect(null);

  const handleClear = () => setTable(content);

  const handleChange = (event) => {
    const value = normalize(event.target.value.trim());

    if (value === "") {
      handleClear();
      return;
    }

    setTable(content.filter((child) => normalize(child.name).includes(value) || normalize(child.surname).includes(value) || (child.si_chip + "").includes(value)));
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
      <IonSearchbar onIonInput={handleChange} onIonClear={handleClear} />
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
              <tr key={child.user_id} className="ion-activatable relative" onClick={() => setSelect(child)}>
                <td>{child.name}</td>
                <td>{child.surname}</td>
                <td>{child.si_chip}</td>
                <td>{<IonRippleEffect />}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal Render={UserDetail} content={select} onClose={handleClose} />
      </IonContent>
    </IonPage>
  );
};
