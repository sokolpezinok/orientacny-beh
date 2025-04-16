import { IonBackButton, IonButtons, IonContent, IonPage } from "@ionic/react";
import { useHistory, useParams } from "react-router-dom";

import { Header, ItemGroup, PrimaryButton, Refresher, SmallSuccess, SmallWarning, Spacing, Textarea, TransparentButton } from "@/components/ui/Design";
import { FinancesApi, FinancesEnum } from "@/utils/api";
import { formatDatetime, lazyDate } from "@/utils/format";
import { Storage } from "@/utils/storage";
import Content, { StatefulForm, useStatefulForm } from "../controllers/Content";
import { useModal } from "../ui/Modals";

export default () => (
  <Content Render={FinancesClaim} fetchContent={({ fin_id }) => Promise.all([FinancesApi.detail(fin_id), FinancesApi.claim_history(fin_id)])} errorText="Nepodarilo sa načítať dáta." />
);

const FinancesClaim = ({ content: [detail, history], onUpdate }) => {
  const { fin_id } = useParams();
  const { actionFeedbackModal } = useModal();
  const router = useHistory();
  const formRef = useStatefulForm();

  const handleSubmit = actionFeedbackModal(async (data) => {
    const message = data.message.trim();

    if (message.length === 0) {
      throw "Nezabudni napísať, čo sa ti nepáči.";
    }

    await FinancesApi.claim_message(fin_id, message);
    onUpdate();
  }, "Nepodarilo sa poslať správu");

  const handleClose = actionFeedbackModal(async () => {
    await FinancesApi.claim_close(fin_id);
    onUpdate();
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
      </Header>
      <IonContent>
        <Refresher onUpdate={onUpdate} />
        <ItemGroup title="Udalosť">
          <h4>Názov udalosti:</h4>
          <p>{detail.race_name || "-"}</p>
          <br />
          <h4>Dátum udalosti:</h4>
          <p>{detail.race_date ? lazyDate(detail.race_date) : "-"}</p>
        </ItemGroup>
        <ItemGroup title="Poslať správu">
          {detail.claim === FinancesEnum.CLAIM_OPENED && <SmallWarning>Reklamácia je otvorená.</SmallWarning>}
          {detail.claim === FinancesEnum.CLAIM_CLOSED && <SmallSuccess>Reklamácia bola uzatvorená.</SmallSuccess>}
          <StatefulForm Render={FinancesClaimForm} content={{ message: lastMessage }} onSubmit={handleSubmit} />
          <br />
          <Spacing>
            <PrimaryButton onClick={formRef.current?.submit}>{isUpdate ? "Zmeniť" : "Poslať"}</PrimaryButton>
            <TransparentButton onClick={handleClose} disabled={detail.claim === FinancesEnum.CLAIM_CLOSED}>
              Uzavrieť
            </TransparentButton>
          </Spacing>
        </ItemGroup>
        <ItemGroup title="Chat">
          {history.length === 0 && <small>(zatiaľ žiadna správa)</small>}
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

const FinancesClaimForm = ({ store }) => {
  const state = store.useState();

  const handleChange = (event) => {
    const { name, value } = event.target;

    store.update((s) => {
      s[name] = value;
    });
  };

  return <Textarea name="message" label="Čo sa ti nepáči?" value={state.message} onIonChange={handleChange} />;
};
