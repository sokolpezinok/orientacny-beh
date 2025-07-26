import { IonButton, IonButtons, IonContent, IonIcon, IonPage } from "@ionic/react";
import { save } from "ionicons/icons";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { Header, Refresher } from "@/components/ui/Design";
import { UserApi } from "@/utils/api";
import Content, { StatefulForm, useStatefulForm } from "../controllers/Content";
import { useModal } from "../ui/Modals";
import { ProfileForm } from "./Profile";

export default () => <Content Render={UserProfile} fetchContent={({ user_id }) => UserApi.user_profile(user_id)} errorText="Nepodarilo sa načítať dáta." />;

const UserProfile = memo(({ content, onUpdate }) => {
  const { t } = useTranslation();
  const { user_id } = useParams();
  const { actionFeedbackModal } = useModal();
  const formRef = useStatefulForm();

  const handleSubmit = actionFeedbackModal(async (data) => {
    await UserApi.user_profile_update(user_id, data);
    return t("users.profile.updateSuccess");
  }, t("users.profile.updateError"));

  return (
    <IonPage>
      <Header title={t("users.profile.title")} defaultHref={`/tabs/users/${user_id}`}>
        <IonButtons slot="end">
          <IonButton onClick={() => formRef.current?.submit()}>
            <IonIcon slot="icon-only" icon={save} />
          </IonButton>
        </IonButtons>
      </Header>
      <IonContent>
        <Refresher onUpdate={onUpdate} />
        <StatefulForm Render={ProfileForm} content={content} onSubmit={handleSubmit} />
      </IonContent>
    </IonPage>
  );
});
