import { IonBackButton, IonButtons, IonContent, IonPage } from "@ionic/react";

import { Copyable, Header, ItemGroup, ItemLink, Refresher } from "@/components/ui/Design";
import { UserApi } from "@/utils/api";
import { Storage } from "@/utils/storage";
import Content from "../controllers/Content";

export default () => <Content Render={UserDetail} fetchContent={({ user_id }) => UserApi.detail(user_id)} errorText="Nepodarilo sa načítať dáta." />;

export const UserDetail = ({ content, onUpdate }) => {
  return (
    <IonPage>
      <Header title="Podrobnosti">
        <IonButtons slot="start">
          <IonBackButton defaultHref="/tabs/users" />
        </IonButtons>
      </Header>
      <IonContent>
        <Refresher onUpdate={onUpdate} />
        <ItemGroup>
          <h2 className="text-2xl">
            {content.name} {content.surname}
          </h2>
        </ItemGroup>
        <ItemGroup title="Čip">
          <h4>Registračné číslo</h4>
          <Copyable text={content.reg || "-"} />
          <br />
          <h4>Číslo čipu</h4>
          <Copyable text={content.si_chip || "-"} />
        </ItemGroup>
        <ItemLink routerLink={`/tabs/users/${content.user_id}/races`}>Preteky člena</ItemLink>
        {Storage.pull().policies.policy_mng_big && (
          <>
            <ItemLink routerLink={`/tabs/users/${content.user_id}/notify`}>Poslať notifikáciu</ItemLink>
            <ItemLink routerLink={`/tabs/users/${content.user_id}/profile`}>Profil</ItemLink>
            <ItemLink routerLink={`/tabs/users/${content.user_id}/devices`}>Zariadenia</ItemLink>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};
