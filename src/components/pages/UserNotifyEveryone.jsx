import { IonContent, IonPage } from "@ionic/react";
import { useParams } from "react-router-dom";

import { Header, ItemGroup, PrimaryButton, Refresher } from "@/components/ui/Design";
import { useModal } from "@/components/ui/Modals";
import { UserApi } from "@/utils/api";
import { Storage } from "@/utils/storage";
import { StatelessForm } from "../controllers/Content";
import { UserNotifyForm } from "./UserNotify";

export default UserNotify;

const UserNotify = ({ onUpdate }) => {
  const { user_id } = useParams();
  const { actionFeedbackModal, confirmModal } = useModal();

  const handleSubmit = actionFeedbackModal(async (elements) => {
    const data = {
      title: elements.title.value,
      image: elements.image.value,
      body: elements.body.value,
    };

    if (data.title.length === 0) {
      throw "Nezabudni vyplniť nadpis notifikácie.";
    }

    const surety = await confirmModal(`Naozaj sa chceš poslať notifikáciu celému klubu ${Storage.pull().club.fullname}?`);

    if (!surety) {
      return;
    }

    await UserApi.notify_everyone(user_id, data);
    return "Notifikácia bola úspešne odoslaná.";
  }, "Nepodarilo sa poslať notifikáciu.");

  return (
    <IonPage>
      <Header defaultHref="/tabs/users" title="Napísať klubu notifikáciu" />
      <IonContent>
        <Refresher onUpdate={onUpdate} />
        <ItemGroup title="Notifikácia" subtitle="Členovia tvojho klubu, ktorí majú povolene notifikácie, dostanú tvoju správu okamžite." />
        <StatelessForm onSubmit={handleSubmit}>
          <UserNotifyForm />
          <ItemGroup>
            <PrimaryButton type="submit">Poslať</PrimaryButton>
          </ItemGroup>
        </StatelessForm>
      </IonContent>
    </IonPage>
  );
};
