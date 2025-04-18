import { IonButton, IonContent, IonIcon, IonPage } from "@ionic/react";
import { trash } from "ionicons/icons";

import { Header, ItemGroup, Refresher, SmallError } from "@/components/ui/Design";
import { useModal } from "@/components/ui/Modals";
import { UserApi } from "@/utils/api";
import { formatDatetime } from "@/utils/format";
import { Storage } from "@/utils/storage";
import Content from "../controllers/Content";

export default () => <Content Render={Devices} fetchContent={UserApi.devices} errorText="Nepodarilo sa načítať dáta." />;

const Devices = ({ onUpdate, content }) => {
  return (
    <IonPage>
      <Header defaultHref="/tabs/settings" title="Moje zariadenia" />
      <IonContent>
        <Refresher onUpdate={onUpdate} />
        <DevicesContent content={content} onUpdate={onUpdate} />
      </IonContent>
    </IonPage>
  );
};

export const DevicesContent = ({ content, onUpdate }) => {
  const { actionFeedbackModal, confirmModal } = useModal();
  const currentDevice = Storage.pull().device;

  const handleDelete = actionFeedbackModal(async (device) => {
    const result = await confirmModal("Naozaj chceš odstrániť toto zariadenie?");

    if (!result) {
      return;
    }

    await UserApi.user_device_delete(device);
    onUpdate();
    return "Zariadenie úspešne odstránené.";
  }, "Nepodarilo sa odstrániť zariadenie.");

  if (content.length === 0) {
    return (
      <ItemGroup>
        <SmallError title="Člen nemá na žiadnom zariadení aktivované notifikácie." />
      </ItemGroup>
    );
  }

  return content.map((child) => (
    <div className="flex items-center justify-between" key={child.device}>
      <ItemGroup title={child.device_name || child.device} subtitle={child.device === currentDevice && "Práve sa používa"}>
        <h4>Naposledy aktívne {formatDatetime(child.app_last_opened)}</h4>
        <h4>Notifikácie sú {child.fcm_status ? "aktivované" : "deaktivované"}</h4>
      </ItemGroup>
      <ItemGroup>
        <IonButton fill="transparent" shape="circle" className="text-error" onClick={() => handleDelete(child.device)} disabled={child.device === currentDevice}>
          <IonIcon slot="icon-only" icon={trash} />
        </IonButton>
      </ItemGroup>
    </div>
  ));
};
