import { IonContent, IonPage } from "@ionic/react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { Header, ItemGroup, PrimaryButton, Refresher } from "@/components/ui/Design";
import { useModal } from "@/components/ui/Modals";
import { UserApi } from "@/utils/api";
import { Storage } from "@/utils/storage";
import { StatelessForm } from "../controllers/Content";
import { UserNotifyForm } from "./UserNotify";

const UserNotify = memo(({ onUpdate }) => {
  const { t } = useTranslation();
  const { user_id } = useParams();
  const { actionFeedbackModal, confirmModal } = useModal();

  const handleSubmit = actionFeedbackModal(async (elements) => {
    const data = {
      title: elements.title.value,
      image: elements.image.value,
      body: elements.body.value,
    };

    if (data.title.length === 0) {
      throw t("users.notify.fillTitle");
    }

    const surety = await confirmModal(t("users.notifyAll.confirmSend", { club: Storage.pull().club.fullname }));

    if (!surety) {
      return;
    }

    await UserApi.notify_everyone(user_id, data);
    return t("users.notify.sendSuccess");
  }, t("users.notify.sendError"));

  return (
    <IonPage>
      <Header defaultHref="/tabs/users" title={t("users.notifyAll.title")} />
      <IonContent>
        <Refresher onUpdate={onUpdate} />
        <ItemGroup title={t("users.notify.notification")} subtitle={t("users.notifyAll.willReceiveImmediately")} />
        <StatelessForm onSubmit={handleSubmit}>
          <UserNotifyForm />
          <ItemGroup>
            <PrimaryButton type="submit">{t("basic.send")}</PrimaryButton>
          </ItemGroup>
        </StatelessForm>
      </IonContent>
    </IonPage>
  );
});

export default UserNotify;
