import { IonButtons, IonContent } from "@ionic/react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";

import { Header, ItemGroup, PrimaryButton } from "@/components/ui/Design";
import { FinancesApi } from "@/utils/api";
import { lazyDate, stripTags } from "@/utils/format";
import Content from "../controllers/Content";

export default () => <Content Render={FinancesDetail} updateData={({ fin_id }) => FinancesApi.detail(fin_id)} errorText="Nepodarilo sa načítať dáta." />;

const FinancesDetail = ({ content }) => {
  return (
    <>
      <Header title="Podrobnosti" defaultHref="/tabs/finances">
        <IonButtons slot="end"></IonButtons>
      </Header>
      <FinancesDetailContent select={content} />
    </>
  );
};

export const FinancesDetailContent = ({ select, onClose }) => {
  const router = useHistory();

  const handleClick = (event) => {
    router.push(`/tabs/finances/${select.fin_id}/claim`);
    onClose && onClose(event);
  };

  return (
    <>
      <IonContent>
        {select !== null && (
          <>
            <ItemGroup title="Transakcia">
              <h4>Suma:</h4>
              <ColoredValue value={select.amount} className="text-4xl" />
              <hr />
              <h4>Dátum:</h4>
              <p>{lazyDate(select.date)}</p>
              <hr />
              <h4>Poznámka:</h4>
              <p>{stripTags(select.note) || "-"}</p>
              <hr />
              <h4>Autor:</h4>
              <p>{select.editor_sort_name}</p>
            </ItemGroup>
            <ItemGroup title="Udalosti">
              <h4>Názov udalosti:</h4>
              <p>{select.race_name || "-"}</p>
              <hr />
              <h4>Dátum udalosti:</h4>
              <p>{select.race_date ? lazyDate(select.race_date) : "-"}</p>
            </ItemGroup>
            <ItemGroup title="Reklamácia">
              <PrimaryButton onClick={handleClick}>Reklamovať</PrimaryButton>
            </ItemGroup>
          </>
        )}
      </IonContent>
    </>
  );
};

const ColoredValue = ({ value, className, ...props }) => {
  return (
    <span className={classNames(value >= 0 ? "text-emerald-500" : "text-error", className)} {...props}>
      {value}
    </span>
  );
};
