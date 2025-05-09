import { IonBackButton, IonButtons, IonContent, IonPage } from "@ionic/react";
import { memo } from "react";

import { Copyable, Header, ItemGroup, ItemLink, Refresher } from "@/components/ui/Design";
import { doesManageUser } from "@/utils";
import { UserApi } from "@/utils/api";
import { Session } from "@/utils/storage";
import Content from "../controllers/Content";

export default () => <Content Render={UserDetail} fetchContent={({ user_id }) => UserApi.detail(user_id)} errorText="Nepodarilo sa načítať dáta." />;

export const UserDetail = memo(({ content, onUpdate }) => {
  const advancedOptions = Session.pull().policies.adm_small || Session.pull().policies.mng_big;

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
        <hr />
        <ItemLink routerLink={`/tabs/users/${content.user_id}/races`}>Preteky člena</ItemLink>
        {(advancedOptions || doesManageUser(content.user_id)) && <ItemLink routerLink={`/tabs/users/${content.user_id}/profile`}>Profil</ItemLink>}
        {advancedOptions && (
          <>
            <ItemLink routerLink={`/tabs/users/${content.user_id}/notify`}>Poslať notifikáciu</ItemLink>
            <ItemLink routerLink={`/tabs/users/${content.user_id}/devices`}>Zariadenia</ItemLink>
          </>
        )}
      </IonContent>
    </IonPage>
  );
});
