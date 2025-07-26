import { IonContent, IonPage, IonSelectOption } from "@ionic/react";
import { memo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { Header, Input, ItemGroup, PrimaryButton, Refresher, Select, SmallError, Textarea } from "@/components/ui/Design";
import { useModal } from "@/components/ui/Modals";
import { UserApi } from "@/utils/api";
import Content, { StatelessForm } from "../controllers/Content";

export default () => <Content Render={UserNotify} fetchContent={({ user_id }) => Promise.all([UserApi.detail(user_id), UserApi.user_devices(user_id)])} errorText="Nepodarilo sa načítať dáta." />;

const UserNotify = memo(({ content: [content, devices], onUpdate }) => {
  const { t } = useTranslation();
  const { user_id } = useParams();
  const { actionFeedbackModal, confirmModal } = useModal();

  devices = devices.filter((child) => child.fcm_status);

  const handleSubmit = actionFeedbackModal(async (elements) => {
    const data = {
      device: elements.device.value,
      title: elements.title.value,
      image: elements.image.value,
      body: elements.body.value,
    };

    if (data.title.length === 0) {
      throw t("users.notify.fillTitle");
    }

    const surety = await confirmModal(t("users.notify.confirmSend", { name: content.sort_name }));

    if (!surety) {
      return;
    }

    await UserApi.user_notify(user_id, data);
    return t("users.notify.sendSuccess");
  }, t("users.notify.sendError"));

  return (
    <IonPage>
      <Header defaultHref={`/tabs/users/${user_id}`} title={t("users.notify.title")} />
      <IonContent>
        <Refresher onUpdate={onUpdate} />
        <ItemGroup title={t("users.notify.notification")}>
          <Trans i18nKey="users.notify.willReceiveImmediately" values={{ name: content.sort_name }} components={[<b />]} />
        </ItemGroup>
        <StatelessForm onSubmit={handleSubmit}>
          <ItemGroup title={t("users.notify.selectDevice")}>
            {devices.length === 0 ? (
              <SmallError title={t("users.notify.noDeviceHasActivatedNotify")} />
            ) : (
              <Select name="device" value={null}>
                <IonSelectOption value={null}>{t("users.notify.allDevices")}</IonSelectOption>
                {devices.map((child) => (
                  <IonSelectOption key={child.device} value={child.device}>
                    {child.device_name || child.device}
                  </IonSelectOption>
                ))}
              </Select>
            )}
          </ItemGroup>
          <UserNotifyForm />
          <ItemGroup>
            <PrimaryButton type="submit" disabled={devices.length === 0}>
              {t("basic.send")}
            </PrimaryButton>
          </ItemGroup>
        </StatelessForm>
      </IonContent>
    </IonPage>
  );
});

export const UserNotifyForm = ({}) => {
  const { t } = useTranslation();

  return (
    <ItemGroup>
      <Input label={t("users.notify.titleLabel")} name="title" value={t("users.notify.titlePlaceholder")} required />
      <Input label={t("users.notify.imageUrlLabel")} name="image" value="" />
      <Textarea label={t("users.notify.bodyLabel")} name="body" value={t("users.notify.bodyPlaceholder")} />
    </ItemGroup>
  );
};
