import { IonContent, IonPage, IonRippleEffect, IonSelectOption } from "@ionic/react";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { ColoredValue, Error, Header, Item, ItemGroup, Refresher, Select } from "@/components/ui/Design";
import { FinancesApi } from "@/utils/api";
import { lazyDate, stripTags } from "@/utils/format";
import { Storage } from "@/utils/storage";
import Content from "../controllers/Content";

export default () => <Content Render={Finances} fetchContent={() => Promise.all([FinancesApi.overview(), FinancesApi.history()])} errorText="Nepodarilo sa načítať dáta." />;

const Finances = memo(({ content: [overview, history], onUpdate }) => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(Storage.pull().userId);

  return (
    <IonPage>
      <Header title={t("finances.title")} />
      <IonContent>
        <Refresher onUpdate={onUpdate} />
        <Item>
          <Select label={t("basic.member")} value={current} onIonChange={(event) => setCurrent(event.target.value)}>
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
});

const FinancesOf = ({ overview, history }) => {
  const { t } = useTranslation();
  const router = useHistory();

  if (overview === undefined) {
    return <Error title={t("finances.overviewError")} />;
  }

  return (
    <>
      <ItemGroup title={t("finances.balance")}>
        <ColoredValue className="text-4xl" value={overview.total} />
      </ItemGroup>
      <ItemGroup title={t("finances.history")}>
        <div className="-mx-4 -mb-4">
          <table className="table">
            <thead>
              <tr>
                <th>{t("finances.date")}</th>
                <th>{t("finances.event")}</th>
                <th>{t("finances.total")}</th>
                <th>{t("finances.note")}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {history.map((child) => (
                <tr key={child.fin_id} className="ion-activatable relative" onClick={() => router.push(`/tabs/finances/${child.fin_id}`, child)}>
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
    </>
  );
};
