import { Drawer, Header, Input, ItemGroup, List, PrimaryButton, SmallWarning, Toggle } from "@/components/ui/Design";
import { useModal } from "@/components/ui/Modals";
import { UserApi } from "@/utils/api";
import { Notifications } from "@/utils/notify";
import { Storage } from "@/utils/storage";
import { IonCheckbox, IonContent, IonPage } from "@ionic/react";
import classNames from "classnames";
import { useRef, useState } from "react";
import Content from "../controllers/Content";

export default () => <Content Render={Notify} updateData={UserApi.notify} errorText="Nepodarilo sa načítať dáta." />;

const Notify = ({ content }) => {
  const { smartModal } = useModal();
  const ref = useRef(null);
  const [state, setState] = useState(content);
  const allowNotify = Storage.useState((s) => s.preferences.allowNotify);

  const handleNotify = smartModal(async (event) => {
    try {
      await Notifications.register(event.target.checked);
    } catch (error) {
      // when an error is thrown, undo toggle check
      event.target.checked = !event.target.checked;
      // display error modal
      throw error;
    }
  }, "Nepodarilo sa zmeniť povolenie.");

  const handleSubmit = smartModal(async () => {
    const els = ref.current.elements;

    const joinFlags = (children) =>
      Array.from(children)
        .filter((child) => child.value !== "")
        .reduce((a, b) => a | b.value, 0);

    const collected = {
      notify_type: joinFlags(els["notify_type[]"]),
      email: els.email.value,

      send_news: els.send_news.value === "on",

      // notify when race is about to expire
      send_races: els.send_races.value === "on",
      days_before: els.days_before.value,
      race_types: joinFlags(els["race_types[]"]),
      rankings: joinFlags(els["rankings[]"]),

      // notify when race is changed
      send_changes: els.send_changes.value === "on",
      send_changes_data: joinFlags(els["send_changes_data[]"]),

      // registrator only
      send_internal_entry_expired: els.send_internal_entry_expired.value === "on",

      // notify when member does not have money, finance only
      send_member_minus: els.send_member_minus.value === "on",

      // notify financial status
      send_finances: els.send_finances.value === "on",
      send_finances_data: joinFlags(els["send_finances_data[]"]),
      financial_limit: els.financial_limit.value,
    };

    if (collected.email.length === 0) {
      throw "Nezabudni vyplniť email.";
    }

    await UserApi.notify_update(collected);
    return "Upozornenia boli úspešne aktualizované.";
  }, "Nepodarilo sa aktualizovať upozornenia.");

  const BitflagCheckboxes = ({ content, name, className, ...props }) => {
    const handleChange = (index) => (event) => {
      content[index].value = event.target.checked;

      setState({
        ...state,
        [name]: content,
      });
    };

    return (
      <div className={classNames("pl-4 pt-2", className)} {...props}>
        {content.map((child, index) => (
          /* workaround to https://github.com/ionic-team/ionic-docs/issues/3459 */
          // <div key={child.id} className="flex items-center" onClick={handleChange(index)}>
          //   <IonCheckbox key={child.id} checked={child.value} name={name} value={child.id} />
          //   <span className="ms-4">{child.name}</span>
          // </div>
          <IonCheckbox key={child.id} checked={child.value} name={name} value={child.id} onIonChange={handleChange(index)} className="w-full" justify="start" labelPlacement="end">
            {child.name}
          </IonCheckbox>
        ))}
      </div>
    );
  };

  const handleChange = (name) => (event) => setState({ ...state, [name]: event.target.checked });

  return (
    <IonPage>
      <Header backHref="/tabs/settings" title="Upozornenia" />
      <IonContent>
        <form ref={ref}>
          <ItemGroup title="Spôsob posielania">
            <BitflagCheckboxes content={state.notify_type} name="notify_type[]" />
            <Drawer active={state.notify_type.find((child) => child.id === 1).value}>
              <Input name="email" label="Email, kam budeš dostávať upozornenia" type="email" value={state.email} required />
            </Drawer>
            <Drawer active={state.notify_type.find((child) => child.id === 2).value}>
              <Drawer active={!allowNotify}>
                <span className="mb-2 font-medium text-rose-500">Notifikácie nie sú povolené na tomto zariadení.</span>
              </Drawer>
              <Toggle checked={allowNotify} onIonChange={handleNotify}>
                Povoliť notifikácie na tomto zariadení.
              </Toggle>
            </Drawer>
          </ItemGroup>
          <ItemGroup title="Novinky">
            <SmallWarning>Upozornenia na túto sekciu je zatiaľ možné posielať iba cez email.</SmallWarning>
            <Toggle name="send_news" checked={state.send_news}>
              Upozorniť ma na pridané novinky
            </Toggle>
          </ItemGroup>
          <ItemGroup title="Termíny prihlášok">
            <Toggle name="send_races" checked={state.send_races} onIonChange={handleChange("send_races")}>
              Upozorniť ma na koniec termínu prihlášok
            </Toggle>
            <Drawer active={state.send_races}>
              <List>
                <Input name="days_before" value={state.days_before} label={`Koľko dní pred termínom ma upozorniť (${state.days_before_min} - ${state.days_before_max})`} type="number" required />
                <span>Upozorniť ma na tieto typy pretekov:</span>
                <BitflagCheckboxes content={state.race_types} name="race_types[]" />
                <span>Upozorniť ma na preteky z tohto rebríčka:</span>
                <BitflagCheckboxes content={state.rankings} name="rankings[]" />
              </List>
            </Drawer>
          </ItemGroup>
          <ItemGroup title="Zmeny termínu">
            <Toggle name="send_changes" checked={state.send_changes} onIonChange={handleChange("send_changes")}>
              Upozorniť ma na zmeny termínu
            </Toggle>
            <Drawer active={state.send_changes}>
              <BitflagCheckboxes content={state.send_changes_data} name="send_changes_data[]" />
            </Drawer>
          </ItemGroup>
          <ItemGroup title="Financie">
            <SmallWarning>Upozornenia na túto sekciu je zatiaľ možné posielať iba cez email.</SmallWarning>
            <Toggle name="send_finances" checked={state.send_finances} onIonChange={handleChange("send_finances")}>
              Upozorniť ma na môj finančný stav
            </Toggle>
            <Drawer active={state.send_finances}>
              <BitflagCheckboxes content={state.send_finances_data} name="send_finances_data[]" />
              <Drawer active={state.send_finances_data.find((child) => child.id === 1).value}>
                <Input label="Hranica (Kč)" name="financial_limit" value={state.financial_limit} type="number" required />
              </Drawer>
            </Drawer>
          </ItemGroup>
          <ItemGroup title="Pokročilé">
            <SmallWarning>Upozornenia na túto sekciu je zatiaľ možné posielať iba cez email.</SmallWarning>
            <List>
              <Toggle name="send_internal_entry_expired" checked={state.send_internal_entry_expired} disabled={!Storage.pull().policies.policy_regs}>
                Upozorniť ma, keď uplynul interný termín
              </Toggle>
              <Toggle name="send_member_minus" checked={state.send_member_minus} disabled={!Storage.pull().policies.policy_fin}>
                Upozorniť ma na členov, ktorí sa na účte dostali do mínusu
              </Toggle>
            </List>
          </ItemGroup>
          <List innerPadding>
            <PrimaryButton onClick={handleSubmit}>Zmeniť</PrimaryButton>
          </List>
        </form>
      </IonContent>
    </IonPage>
  );
};
