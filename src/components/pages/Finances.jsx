import { IonContent, IonPage, IonRippleEffect, IonSelectOption } from "@ionic/react";
import { useState } from "react";

import { ColoredValue, Error, Header, Item, ItemGroup, Refresher, Select } from "@/components/ui/Design";
import { FinancesApi } from "@/utils/api";
import { lazyDate, stripTags } from "@/utils/format";
import { Storage } from "@/utils/storage";
import Content, { Modal } from "../controllers/Content";
import { FinancesDetail } from "./FinancesDetail";

export default () => <Content Render={Finances} fetchContent={() => Promise.all([FinancesApi.overview(), FinancesApi.history()])} errorText="Nepodarilo sa načítať dáta." />;

const Finances = ({ content: [overview, history], onUpdate }) => {
  const [current, setCurrent] = useState(Storage.pull().userId);

  return (
    <IonPage>
      <Header title="Financie" />
      <IonContent>
        <Refresher onUpdate={onUpdate} />
        <Item>
          <Select label="Člen" value={current} onIonChange={(event) => setCurrent(event.target.value)}>
            {overview.map((child) => (
              <IonSelectOption key={child.user_id} value={child.user_id}>
                {child.sort_name}
              </IonSelectOption>
            ))}
          </Select>
        </Item>
        <FinancesOf overview={overview.find((child) => child.user_id == current)} history={history.filter((child) => child.user_id == current)} onUpdate={onUpdate} />
      </IonContent>
    </IonPage>
  );
};

const FinancesOf = ({ overview, history, onUpdate }) => {
  const [select, setSelect] = useState(null);

  if (overview === undefined) {
    return <Error title="Nepodarilo sa zobraziť tabuľku" />;
  }

  const handleClose = () => setSelect(null);

  return (
    <>
      <ItemGroup title="Zostatok">
        <ColoredValue className="text-4xl" value={overview.total} />
      </ItemGroup>
      <ItemGroup title="História">
        <div className="-mx-4 -mb-4">
          <table className="table">
            <thead>
              <tr>
                <th>Dátum</th>
                <th>Udalosť</th>
                <th>Suma</th>
                <th>Poznámka</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {history.map((child) => (
                <tr key={child.fin_id} className="ion-activatable relative" onClick={() => setSelect(child)}>
                  <td>{lazyDate(child.date)}</td>
                  <td>{child.race_name || "-"}</td>
                  <td>{<ColoredValue value={child.amount} />}</td>
                  <td>{stripTags(child.note) || "-"}</td>
                  <td>{<IonRippleEffect />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ItemGroup>
      <Modal Render={FinancesDetail} content={select} onClose={handleClose} onUpdate={onUpdate} />
    </>
  );
};
