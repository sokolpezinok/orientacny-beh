import { IonBackButton, IonButton, IonButtons, IonContent, IonIcon, IonPage } from "@ionic/react";
import { refresh } from "ionicons/icons";
import { useRef } from "react";
import { useHistory, useParams } from "react-router-dom";

import { Header, ItemGroup, List, PrimaryButton, Refresher, Textarea, Transparent } from "@/components/ui/Design";
import { FinancesApi } from "@/utils/api";
import { formatDatetime } from "@/utils/format";
import { Storage } from "@/utils/storage";
import Content from "../controllers/Content";
import { useModal } from "../ui/Modals";

export default () => (
  <Content Render={FinancesClaim} updateData={({ fin_id }) => Promise.all([FinancesApi.detail(fin_id), FinancesApi.claim_history(fin_id)])} errorText="Nepodarilo sa načítať dáta." />
);

const FinancesClaim = ({ content: [detail, history], handleUpdate }) => {
  const { fin_id } = useParams();
  const ref = useRef(null);
  const { smartModal } = useModal();
  const router = useHistory();

  const handleSend = smartModal(async () => {
    const message = ref.current.elements.message.value.trim();

    if (message.length === 0) {
      throw "Nezabudni napísať, čo sa ti nepáči.";
    }

    await FinancesApi.claim_message(fin_id, message);
    handleUpdate();
  }, "Nepodarilo sa poslať správu");

  const handleClose = smartModal(async () => {
    await FinancesApi.claim_close(fin_id);
    handleUpdate();
  }, "Nepodarilo sa uzavrieť reklamáciu");

  // messages ordered by descending date
  const isUpdate = history.length > 0 && history[0].user_id == Storage.pull().userId;
  const lastMessage = isUpdate ? history[0].text : "";

  return (
    <IonPage>
      <Header title="Reklamácia">
        <IonButtons slot="start">
          <IonBackButton defaultHref="#" onClick={() => router.replace(`/tabs/finances/${fin_id}`)} />
        </IonButtons>
        <IonButtons slot="end">
          <IonButton onClick={handleUpdate}>
            <IonIcon slot="icon-only" icon={refresh} />
          </IonButton>
        </IonButtons>
      </Header>
      <IonContent>
        <Refresher handleUpdate={handleUpdate} />
        <ItemGroup title="Poslať správu">
          <form ref={ref}>
            <Textarea name="message" label="Čo sa ti nepáči?" value={lastMessage} />
          </form>
          <br />
          <List>
            <PrimaryButton onClick={handleSend}>{isUpdate ? "Zmeniť" : "Poslať"}</PrimaryButton>
            <Transparent onClick={handleClose}>Uzavrieť</Transparent>
          </List>
        </ItemGroup>
        <ItemGroup title="Chat">
          {history.length === 0 && <p>(zatiaľ žiadna správa)</p>}
          {history.map((child, index) => (
            <div key={child.claim_id}>
              <h4>
                <span className="text-primary">{child.sort_name}</span> {formatDatetime(child.date)}
              </h4>
              <p>{child.text}</p>
              {index + 1 !== history.length && <hr />}
            </div>
          ))}
        </ItemGroup>
      </IonContent>
    </IonPage>
  );
};
