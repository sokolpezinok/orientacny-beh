import { IonBackButton, IonButtons, IonContent, IonPage } from "@ionic/react";
import { useHistory } from "react-router-dom";

import { ColoredValue, Header, ItemGroup, PrimaryButton, Refresher, SmallSuccess, SmallWarning, Spacing } from "@/components/ui/Design";
import { FinancesApi, FinancesEnum } from "@/utils/api";
import { lazyDate, stripTags } from "@/utils/format";
import Content from "../controllers/Content";

export default () => <Content Render={FinancesDetail} fetchContent={({ fin_id }) => FinancesApi.detail(fin_id)} errorText="Nepodarilo sa načítať dáta." />;

export const FinancesDetail = ({ content, onUpdate }) => {
  const router = useHistory();

  const handleClick = (event) => {
    router.push(`/tabs/finances/${content.fin_id}/claim`);
  };

  return (
    <IonPage>
      <Header title="Podrobnosti">
        <IonButtons slot="start">
          <IonBackButton defaultHref="/tabs/finances" />
        </IonButtons>
      </Header>
      <IonContent>
        <Refresher onUpdate={onUpdate} />
        <ItemGroup>
          <h2>{content.race_name || <i>(bez názvu)</i>}</h2>
          <br />
          <h4>Dátum udalosti:</h4>
          <p>{content.race_date ? lazyDate(content.race_date) : "-"}</p>
          <br />
          <h4>Poznámka</h4>
          <p>{stripTags(content.note) || "-"}</p>
        </ItemGroup>
        {content.storno === FinancesEnum.STORNO_ACTIVE && (
          <ItemGroup title="Storno">
            <SmallWarning>Táto transakcia bolo stornovaná.</SmallWarning>
            <br />
            <h4>Poznámka k stornu:</h4>
            <p>{content.storno_note}</p>
            <br />
            <h4>Stornované členom:</h4>
            <p>{content.storno_sort_name}</p>
            <br />
            <h4>Dátum:</h4>
            <p>{lazyDate(content.storno_date)}</p>
          </ItemGroup>
        )}
        <ItemGroup title="Transakcia">
          <ColoredValue value={content.amount} className="text-4xl" />
          <br />
          <h4>Dátum transakcie:</h4>
          <p>{lazyDate(content.date)}</p>
          <br />
          <h4>Autor:</h4>
          <p>{content.editor_sort_name}</p>
        </ItemGroup>
        <ItemGroup title="Reklamácia">
          <Spacing>
            {content.claim === FinancesEnum.CLAIM_OPENED && <SmallWarning>Reklamácia je otvorená.</SmallWarning>}
            {content.claim === FinancesEnum.CLAIM_CLOSED && <SmallSuccess>Reklamácia bola uzatvorená.</SmallSuccess>}
            <PrimaryButton onClick={handleClick}>Podrobnosti</PrimaryButton>
          </Spacing>
        </ItemGroup>
      </IonContent>
    </IonPage>
  );
};

export const FinancesDetailOld = ({ content, onUpdate }) => {
  const router = useHistory();

  const handleClick = (event) => {
    router.push(`/tabs/finances/${content.fin_id}/claim`);
  };

  return (
    <IonPage>
      <Header title="Podrobnosti">
        <IonButtons slot="start">
          <IonBackButton defaultHref="/tabs/finances" />
        </IonButtons>
      </Header>
      <IonContent>
        <Refresher onUpdate={onUpdate} />
        {content.storno === FinancesEnum.STORNO_ACTIVE && (
          <ItemGroup title="Storno">
            <SmallWarning>Táto transakcia bolo stornovaná.</SmallWarning>
            <br />
            <h4>Poznámka:</h4>
            <p>{content.storno_note}</p>
            <br />
            <h4>Stornované členom:</h4>
            <p>{content.storno_sort_name}</p>
            <br />
            <h4>Dátum:</h4>
            <p>{lazyDate(content.storno_date)}</p>
          </ItemGroup>
        )}
        <ItemGroup title="Udalosť">
          <h4>Názov udalosti:</h4>
          <p>{content.race_name || "-"}</p>
          <br />
          <h4>Dátum udalosti:</h4>
          <p>{content.race_date ? lazyDate(content.race_date) : "-"}</p>
        </ItemGroup>
        <ItemGroup title="Transakcia">
          <h4>Suma:</h4>
          <ColoredValue value={content.amount} className="text-4xl" />
          <br />
          <h4>Dátum:</h4>
          <p>{lazyDate(content.date)}</p>
          <br />
          <h4>Poznámka:</h4>
          <p>{stripTags(content.note) || "-"}</p>
          <br />
          <h4>Autor:</h4>
          <p>{content.editor_sort_name}</p>
        </ItemGroup>
        <ItemGroup title="Reklamácia">
          <Spacing>
            {content.claim === FinancesEnum.CLAIM_OPENED && <SmallWarning>Reklamácia je otvorená.</SmallWarning>}
            {content.claim === FinancesEnum.CLAIM_CLOSED && <SmallSuccess>Reklamácia bola uzatvorená.</SmallSuccess>}
            <PrimaryButton onClick={handleClick}>Podrobnosti</PrimaryButton>
          </Spacing>
        </ItemGroup>
      </IonContent>
    </IonPage>
  );
};
