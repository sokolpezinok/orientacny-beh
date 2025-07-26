import { IonBackButton, IonButtons, IonContent, IonPage } from "@ionic/react";
import { memo } from "react";

import { Copyable, Header, ItemGroup, ItemLink, Refresher } from "@/components/ui/Design";
import { doesManageUser } from "@/utils";
import { UserApi } from "@/utils/api";
import { Session } from "@/utils/storage";
import { useTranslation } from "react-i18next";
import Content from "../controllers/Content";

export default () => <Content Render={UserDetail} fetchContent={({ user_id }) => UserApi.detail(user_id)} errorText="Nepodarilo sa načítať dáta." />;

export const UserDetail = memo(({ content, onUpdate }) => {
  const { t } = useTranslation();
  const advancedOptions = Session.pull().policies.adm_small || Session.pull().policies.mng_big;

  return (
    <IonPage>
      <Header title={t("users.detail.title")}>
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
        <ItemGroup title={t("profile.chip")}>
          <h4>{t("profile.regNumber")}</h4>
          <Copyable text={content.reg || "-"} />
          <br />
          <h4>{t("profile.chipNumber")}</h4>
          <Copyable text={content.si_chip || "-"} />
        </ItemGroup>
        <hr />
        <ItemLink routerLink={`/tabs/users/${content.user_id}/races`}>{t("users.races.title")}</ItemLink>
        {(advancedOptions || doesManageUser(content.user_id)) && <ItemLink routerLink={`/tabs/users/${content.user_id}/profile`}>{t("users.profile.title")}</ItemLink>}
        {advancedOptions && (
          <>
            <ItemLink routerLink={`/tabs/users/${content.user_id}/notify`}>{t("users.notify.title")}</ItemLink>
            <ItemLink routerLink={`/tabs/users/${content.user_id}/devices`}>{t("users.devices.title")}</ItemLink>
          </>
        )}
      </IonContent>
    </IonPage>
  );
});
