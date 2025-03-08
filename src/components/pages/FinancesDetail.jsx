import { IonButtons, IonContent } from "@ionic/react";
import { useHistory } from "react-router-dom";

import { ColoredValue, Header, ItemGroup, PrimaryButton, Refresher, SmallSuccess, SmallWarning, Spacing } from "@/components/ui/Design";
import { FinancesApi, FinancesEnum } from "@/utils/api";
import { lazyDate, stripTags } from "@/utils/format";
import Content from "../controllers/Content";

export default () => <Content Render={FinancesDetail} updateData={({ fin_id }) => FinancesApi.detail(fin_id)} errorText="Nepodarilo sa načítať dáta." />;

const FinancesDetail = ({ content, handleUpdate }) => {
  return (
    <>
      <Header title="Podrobnosti" defaultHref="/tabs/finances">
        <IonButtons slot="end"></IonButtons>
      </Header>
      <FinancesDetailContent select={content} handleUpdate={handleUpdate} />
    </>
  );
};

export const FinancesDetailContent = ({ select, onClose, handleUpdate }) => {
  const router = useHistory();

  const handleClick = (event) => {
    router.push(`/tabs/finances/${select.fin_id}/claim`);
    onClose && onClose(event);
  };

  return (
    <>
      <IonContent>
        <Refresher handleUpdate={handleUpdate} />
        {select !== null && (
          <>
            {select.storno === FinancesEnum.STORNO_ACTIVE && (
              <ItemGroup title="Storno">
                <SmallWarning>Táto transakcia bolo stornovaná.</SmallWarning>
                <br />
                <h3>Poznámka:</h3>
                <p>{select.storno_note}</p>
                <br />
                <h3>Stornované členom:</h3>
                <p>{select.storno_sort_name}</p>
                <br />
                <h3>Dátum:</h3>
                <p>{lazyDate(select.storno_date)}</p>
              </ItemGroup>
            )}
            <ItemGroup title="Udalosť">
              <h3>Názov udalosti:</h3>
              <p>{select.race_name || "-"}</p>
              <br />
              <h3>Dátum udalosti:</h3>
              <p>{select.race_date ? lazyDate(select.race_date) : "-"}</p>
            </ItemGroup>
            <ItemGroup title="Transakcia">
              <h3>Suma:</h3>
              <ColoredValue value={select.amount} className="text-4xl" />
              <br />
              <h3>Dátum:</h3>
              <p>{lazyDate(select.date)}</p>
              <br />
              <h3>Poznámka:</h3>
              <p>{stripTags(select.note) || "-"}</p>
              <br />
              <h3>Autor:</h3>
              <p>{select.editor_sort_name}</p>
            </ItemGroup>
            <ItemGroup title="Reklamácia">
              <Spacing>
                {select.claim === FinancesEnum.CLAIM_OPENED && <SmallWarning>Reklamácia je otvorená.</SmallWarning>}
                {select.claim === FinancesEnum.CLAIM_CLOSED && <SmallSuccess>Reklamácia bola uzatvorená.</SmallSuccess>}
                <PrimaryButton onClick={handleClick}>Podrobnosti</PrimaryButton>
              </Spacing>
            </ItemGroup>
          </>
        )}
      </IonContent>
    </>
  );
};
