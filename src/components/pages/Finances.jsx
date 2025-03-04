import { IonBackButton, IonButton, IonButtons, IonContent, IonIcon, IonModal, IonPage, IonRippleEffect, IonSelectOption } from "@ionic/react";
import classNames from "classnames";
import { refresh } from "ionicons/icons";
import { useState } from "react";

import { Error, Header, Item, ItemGroup, Refresher, Select } from "@/components/ui/Design";
import { FinancesApi } from "@/utils/api";
import { lazyDate, stripTags } from "@/utils/format";
import { Storage } from "@/utils/storage";
import Content from "../controllers/Content";
import { FinancesDetailContent } from "./FinancesDetail";

export default () => <Content Render={Finances} updateData={() => Promise.all([FinancesApi.overview(), FinancesApi.history()])} errorText="Nepodarilo sa načítať dáta." />;

const MyHeader = ({ handleUpdate }) => (
  <Header title="Financie">
    <IonButtons slot="end">
      <IonButton onClick={handleUpdate}>
        <IonIcon slot="icon-only" icon={refresh} />
      </IonButton>
    </IonButtons>
  </Header>
);

const Finances = ({ content: [overview, history], handleUpdate }) => {
  const [current, setCurrent] = useState(Storage.pull().userId);

  return (
    <IonPage>
      <MyHeader handleUpdate={handleUpdate} />
      <IonContent>
        <Refresher handleUpdate={handleUpdate} />
        <Item>
          <Select label="Člen" value={current} onIonChange={(event) => setCurrent(event.target.value)}>
            {overview.map((child) => (
              <IonSelectOption key={child.user_id} value={child.user_id}>
                {child.sort_name}
              </IonSelectOption>
            ))}
          </Select>
        </Item>
        <FinancesOf overview={overview.find((child) => child.user_id == current)} history={history.filter((child) => child.user_id == current)} />
      </IonContent>
    </IonPage>
  );
};

const FinancesOf = ({ overview, history }) => {
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
      <IonModal isOpen={select !== null} onDidDismiss={handleClose}>
        <Header title="Podrobnosti">
          <IonButtons slot="start">
            <IonBackButton onClick={handleClose} defaultHref="#" />
          </IonButtons>
        </Header>
        <FinancesDetailContent select={select} onClose={handleClose} />
      </IonModal>
    </>
  );
};

const ColoredValue = ({ value, className, ...props }) => {
  return (
    <span className={classNames(value >= 0 ? "text-success" : "text-error", className)} {...props}>
      {value}
    </span>
  );
};
