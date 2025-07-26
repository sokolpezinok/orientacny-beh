import { IonBackButton, IonButtons, IonContent, IonPage } from "@ionic/react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

import { Header, ItemGroup, PrimaryButton, Refresher, SmallSuccess, SmallWarning, Spacing, Textarea, TransparentButton } from "@/components/ui/Design";
import { FinancesApi, FinancesEnum } from "@/utils/api";
import { formatDatetime } from "@/utils/format";
import { Storage } from "@/utils/storage";
import Content, { StatefulForm, useStatefulForm } from "../controllers/Content";
import { useModal } from "../ui/Modals";

export default () => (
  <Content Render={FinancesClaim} fetchContent={({ fin_id }) => Promise.all([FinancesApi.detail(fin_id), FinancesApi.claim_history(fin_id)])} errorText="Nepodarilo sa načítať dáta." />
);

const FinancesClaim = memo(({ content: [detail, history], onUpdate }) => {
  const { t } = useTranslation();
  const { fin_id } = useParams();
  const { actionFeedbackModal } = useModal();
  const router = useHistory();
  const formRef = useStatefulForm();

  const handleSubmit = actionFeedbackModal(async (data) => {
    const message = data.message.trim();

    if (message.length === 0) {
      throw t("finances.claim.fillReason");
    }

    await FinancesApi.claim_message(fin_id, message);
    onUpdate();
  }, t("finances.claim.sendMessageError"));

  const handleClose = actionFeedbackModal(async () => {
    await FinancesApi.claim_close(fin_id);
    onUpdate();
  }, t("finances.claim.closeClaimError"));

  // messages ordered by descending date
  const isUpdate = history.length > 0 && history[0].user_id == Storage.pull().userId;
  const lastMessage = isUpdate ? history[0].text : "";

  return (
    <IonPage>
      <Header title={t("finances.claim.title")}>
        <IonButtons slot="start">
          <IonBackButton defaultHref="#" onClick={() => router.replace(`/tabs/finances/${fin_id}`)} />
        </IonButtons>
      </Header>
      <IonContent>
        <Refresher onUpdate={onUpdate} />
        <ItemGroup>
          <h2>{detail.race_name || t("finances.transactionID", { id: fin_id })}</h2>
          <br />
          {detail.claim === FinancesEnum.CLAIM_OPENED && <SmallWarning title={t("finances.claim.claimOpened")} />}
          {detail.claim === FinancesEnum.CLAIM_CLOSED && <SmallSuccess title={t("finances.claim.claimClosed")} />}
        </ItemGroup>
        <ItemGroup title={t("finances.claim.sendMessage")}>
          <StatefulForm Render={FinancesClaimForm} content={{ message: lastMessage }} onSubmit={handleSubmit} />
          <br />
          <Spacing>
            <PrimaryButton onClick={() => formRef.current?.submit()}>{isUpdate ? t("finances.claim.changeClaim") : t("finances.claim.sendClaim")}</PrimaryButton>
            <TransparentButton onClick={handleClose} disabled={detail.claim === FinancesEnum.CLAIM_CLOSED}>
              {t("finances.claim.close")}
            </TransparentButton>
          </Spacing>
        </ItemGroup>
        <hr />
        <ItemGroup title={t("finances.claim.chat")}>
          {history.length === 0 && <small>{t("finances.claim.noMessageFound")}</small>}
          {history.map((child) => (
            <div key={child.claim_id} className="mb-4">
              <h4>
                <span className="text-primary">{child.sort_name}</span> {formatDatetime(child.date)}
              </h4>
              <p>{child.text}</p>
            </div>
          ))}
        </ItemGroup>
      </IonContent>
    </IonPage>
  );
});

const FinancesClaimForm = ({ store }) => {
  const { t } = useTranslation();
  const state = store.useState();

  const handleChange = (event) => {
    const { name, value } = event.target;

    store.update((s) => {
      s[name] = value;
    });
  };

  return <Textarea name="message" label={t("finances.claim.reason")} value={state.message} onIonChange={handleChange} />;
};
