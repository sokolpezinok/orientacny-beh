import { IonContent, IonPage, IonSelectOption } from "@ionic/react";
import { memo } from "react";
import { useParams } from "react-router-dom";

import { Header, Input, ItemGroup, PrimaryButton, Refresher, Select, SmallError, Textarea } from "@/components/ui/Design";
import { useModal } from "@/components/ui/Modals";
import { UserApi } from "@/utils/api";
import Content, { StatelessForm } from "../controllers/Content";

export default () => <Content Render={UserNotify} fetchContent={({ user_id }) => Promise.all([UserApi.detail(user_id), UserApi.user_devices(user_id)])} errorText="Nepodarilo sa načítať dáta." />;

const UserNotify = memo(({ content: [content, devices], onUpdate }) => {
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
      throw "Nezabudni vyplniť nadpis notifikácie.";
    }

    const surety = await confirmModal(`Naozaj sa chceš poslať notifikáciu členovi ${content.sort_name}?`);

    if (!surety) {
      return;
    }

    await UserApi.user_notify(user_id, data);
    return "Notifikácia bola úspešne odoslaná.";
  }, "Nepodarilo sa poslať notifikáciu.");

  return (
    <IonPage>
      <Header defaultHref={`/tabs/users/${user_id}`} title="Napísať notifikáciu" />
      <IonContent>
        <Refresher onUpdate={onUpdate} />
        <ItemGroup title="Notifikácia">
          Člen <b>{content.sort_name}</b> dostane tvoju správu okamžite.
        </ItemGroup>
        <StatelessForm onSubmit={handleSubmit}>
          <ItemGroup title="Vyber si zariadenie.">
            {devices.length === 0 ? (
              <SmallError title="Člen nemá na žiadnom zariadení aktivované notifikácie." />
            ) : (
              <Select name="device" value={null}>
                <IonSelectOption value={null}>Všetky zariadenia</IonSelectOption>
                {devices.map((child) => (
                  <IonSelectOption key={child.device} value={child.device}>
                    {child.device_name}
                  </IonSelectOption>
                ))}
              </Select>
            )}
          </ItemGroup>
          <UserNotifyForm />
          <ItemGroup>
            <PrimaryButton type="submit" disabled={devices.length === 0}>
              Poslať
            </PrimaryButton>
          </ItemGroup>
        </StatelessForm>
      </IonContent>
    </IonPage>
  );
});

export const UserNotifyForm = ({}) => {
  return (
    <ItemGroup>
      <Input label="Nadpis" name="title" value="Notifikácia" required />
      <Input label="URL adresa obrázka (nepovinné)" name="image" value="" />
      <Textarea label="Obsah" name="body" value="" />
    </ItemGroup>
  );
};
