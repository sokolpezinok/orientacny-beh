import { IonContent, IonPage } from "@ionic/react";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { Header, ItemGroup, PrimaryButton } from "@/components/ui/Design";
import { useModal } from "@/components/ui/Modals";
import { getClub } from "@/utils";
import { UserApi } from "@/utils/api";
import { StatelessForm } from "../controllers/Content";
import { UserNotifyForm } from "./UserNotify";

const UserNotify = memo(() => {
  const { t } = useTranslation();
  const { actionFeedbackModal, confirmModal } = useModal();

  const handleSubmit = actionFeedbackModal(async (elements: any) => {
    const data = {
      title: elements.title.value,
      image: elements.image.value,
      body: elements.body.value,
    };

    if (data.title.length === 0) {
      throw t("users.notify.fillTitle");
    }

    const surety = await confirmModal(t("users.notifyAll.confirmSend", { club: getClub().fullname }));

    if (!surety) {
      return;
    }

    await UserApi.notify_everyone(data);
    return t("users.notify.sendSuccess");
  }, t("users.notify.sendError"));

  return (
    <IonPage>
      <Header defaultHref="/tabs/users" title={t("users.notifyAll.title")} />
      <IonContent>
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
