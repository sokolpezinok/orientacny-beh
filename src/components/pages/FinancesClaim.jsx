import { IonBackButton, IonButton, IonButtons, IonContent, IonIcon, IonPage } from "@ionic/react";
import { refresh } from "ionicons/icons";
import { useRef } from "react";
import { useHistory, useParams } from "react-router-dom";

import { Header, ItemGroup, PrimaryButton, Refresher, SmallSuccess, SmallWarning, Spacing, Textarea, TransparentButton } from "@/components/ui/Design";
import { FinancesApi, FinancesEnum } from "@/utils/api";
import { formatDatetime, lazyDate } from "@/utils/format";
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
        <ItemGroup title="Udalosť">
          <h3>Názov udalosti:</h3>
          <p>{detail.race_name || "-"}</p>
          <br />
          <h3>Dátum udalosti:</h3>
          <p>{detail.race_date ? lazyDate(detail.race_date) : "-"}</p>
        </ItemGroup>
        <ItemGroup title="Poslať správu">
          {detail.claim === FinancesEnum.CLAIM_OPENED && <SmallWarning>Reklamácia je otvorená.</SmallWarning>}
          {detail.claim === FinancesEnum.CLAIM_CLOSED && <SmallSuccess>Reklamácia bola uzatvorená.</SmallSuccess>}
          <form ref={ref}>
            <Textarea name="message" label="Čo sa ti nepáči?" value={lastMessage} />
          </form>
          <br />
          <Spacing>
            <PrimaryButton onClick={handleSend}>{isUpdate ? "Zmeniť" : "Poslať"}</PrimaryButton>
            <TransparentButton onClick={handleClose} disabled={detail.claim === FinancesEnum.CLAIM_CLOSED}>
              Uzavrieť
            </TransparentButton>
          </Spacing>
        </ItemGroup>
        <ItemGroup title="Chat">
          {history.length === 0 && <p>(zatiaľ žiadna správa)</p>}
          {history.map((child, index) => (
            <div key={child.claim_id}>
              <h3>
                <span className="text-primary">{child.sort_name}</span> {formatDatetime(child.date)}
              </h3>
              <p>{child.text}</p>
              {index + 1 !== history.length && <hr />}
            </div>
          ))}
        </ItemGroup>
      </IonContent>
    </IonPage>
  );
};
