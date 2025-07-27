import { IonBackButton, IonButtons, IonContent, IonPage } from "@ionic/react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { ColoredValue, Header, ItemGroup, PrimaryButton, Refresher, SmallSuccess, SmallWarning } from "@/components/ui/Design";
import { FinancesApi, FinancesEnum } from "@/utils/api";
import { lazyDate, stripTags } from "@/utils/format";
import Content from "../controllers/Content";

export default () => <Content Render={FinancesDetail} fetchContent={({ fin_id }) => FinancesApi.detail(fin_id)} />;

export const FinancesDetail = memo(({ content, onUpdate }) => {
  const { t } = useTranslation();
  const router = useHistory();

  const handleClick = (event) => {
    router.push(`/tabs/finances/${content.fin_id}/claim`);
  };

  return (
    <IonPage>
      <Header title={t("finances.detail.title")}>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/tabs/finances" />
        </IonButtons>
      </Header>
      <IonContent>
        <Refresher onUpdate={onUpdate} />
        <ItemGroup>
          <h2>{content.race_name || t("finances.transactionID", { id: content.fin_id })}</h2>
          <br />
          <h4>{t("finances.detail.total")}</h4>
          <ColoredValue value={content.amount} className="text-4xl" />
          <br />
          <h4>{t("finances.detail.note")}</h4>
          <p>{stripTags(content.note) || "-"}</p>
          <br />
          <h4>{t("finances.detail.transactionDate")}</h4>
          <p>{content.date ? lazyDate(content.date) : "-"}</p>
          <br />
          <h4>{t("finances.detail.raceDate")}</h4>
          <p>{content.race_date ? lazyDate(content.race_date) : "-"}</p>
          <br />
          <h4>{t("finances.detail.transactionAuthor")}</h4>
          <p>{content.editor_sort_name}</p>
        </ItemGroup>
        {content.storno === FinancesEnum.STORNO_ACTIVE && (
          <ItemGroup>
            <SmallWarning title={t("finances.storno.title")}>
              <h4>{t("finances.storno.note")}</h4>
              <p>{content.storno_note}</p>
              <br />
              <h4>{t("finances.storno.member")}</h4>
              <p>{content.storno_sort_name}</p>
              <br />
              <h4>{t("finances.storno.date")}</h4>
              <p>{content.storno_date ? lazyDate(content.storno_date) : "-"}</p>
            </SmallWarning>
          </ItemGroup>
        )}
        <ItemGroup>
          {content.claim === FinancesEnum.CLAIM_OPENED && (
            <SmallWarning title={t("finances.claim.claimOpened")}>
              <PrimaryButton onClick={handleClick} color="warning">
                {t("basic.show")}
              </PrimaryButton>
            </SmallWarning>
          )}
          {content.claim === FinancesEnum.CLAIM_CLOSED && (
            <SmallSuccess title={t("finances.claim.claimClosed")}>
              <PrimaryButton onClick={handleClick} color="success">
                {t("basic.show")}
              </PrimaryButton>
            </SmallSuccess>
          )}
          {content.claim === FinancesEnum.CLAIM_UNOPENED && <PrimaryButton onClick={handleClick}>{t("finances.detail.claim")}</PrimaryButton>}
        </ItemGroup>
      </IonContent>
    </IonPage>
  );
});
