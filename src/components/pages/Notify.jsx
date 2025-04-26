import { IonButton, IonButtons, IonCheckbox, IonContent, IonIcon, IonPage } from "@ionic/react";
import { save } from "ionicons/icons";
import { memo } from "react";

import { Drawer, Header, Input, ItemGroup, SmallError, SmallWarning, Spacing, Toggle } from "@/components/ui/Design";
import { useModal } from "@/components/ui/Modals";
import { UserApi } from "@/utils/api";
import { Notifications } from "@/utils/notify";
import { Session, Storage } from "@/utils/storage";
import Content, { StatefulForm, useStatefulForm } from "../controllers/Content";

export default () => <Content Render={Notify} fetchContent={UserApi.notify} errorText="Nepodarilo sa načítať dáta." />;

const Notify = memo(({ content }) => {
  const { actionFeedbackModal } = useModal();
  const formRef = useStatefulForm();

  const handleSubmit = actionFeedbackModal(async (readonly) => {
    // data and readonly behaves very weirdly

    if (readonly.email.length === 0 && readonly.notify_type.find((child) => child.id === 1).value) {
      throw "Nezabudni vyplniť email.";
    }
    // data is needed to clone, because changing it will change pullstate state
    const data = structuredClone(readonly);

    // but cloning data will weirdly cast objects to numbers, so we need to read values from readonly
    for (const key of ["notify_type", "race_types", "rankings", "send_changes_data", "send_finances_data"]) {
      data[key] = readonly[key].filter((child) => child.value).reduce((a, b) => a | b.id, 0);
    }

    await UserApi.notify_update(data);
    return "Upozornenia boli úspešne aktualizované.";
  }, "Nepodarilo sa aktualizovať upozornenia.");

  return (
    <IonPage>
      <Header defaultHref="/tabs/settings" title="Upozornenia">
        <IonButtons slot="end">
          <IonButton onClick={formRef.current?.submit}>
            <IonIcon slot="icon-only" icon={save} />
          </IonButton>
        </IonButtons>
      </Header>
      <IonContent>
        <StatefulForm Render={NotifyForm} content={content} onSubmit={handleSubmit} />
      </IonContent>
    </IonPage>
  );
});

export const NotifyForm = ({ store }) => {
  const state = store.useState();
  const { actionFeedbackModal } = useModal();

  const allowNotify = Storage.useState((s) => s.preferences.activeNotify);

  const handleNotify = actionFeedbackModal(async (event) => {
    try {
      if (event.target.checked) {
        await Notifications.register();
      } else {
        await Notifications.unregister();
      }
    } catch (error) {
      // when an error is thrown, undo toggle check
      event.target.checked = !event.target.checked;
      // display error modal
      throw error;
    }
  }, "Nepodarilo sa zmeniť povolenie.");

  const handleChange = (event) => {
    const { name, checked, index, value } = event.target;

    if (index !== undefined) {
      store.update((s) => {
        s[name][index].value = checked;
      });

      return;
    }

    store.update((s) => {
      s[name] = checked ?? value;
    });
  };

  const Checkboxes = ({ content, name }) => {
    return (
      <div className="pt-2 pl-4">
        {content.map((child, index) => (
          /* workaround to https://github.com/ionic-team/ionic-docs/issues/3459 */
          // <div key={child.id} className="flex items-center" onClick={handleChange(index)}>
          //   <IonCheckbox key={child.id} checked={child.value} name={name} value={child.id} />
          //   <span className="ms-4">{child.name}</span>
          // </div>
          <IonCheckbox key={child.id} checked={child.value} name={name} index={index} onIonChange={handleChange} className="w-full" justify="start" labelPlacement="end">
            {child.name}
          </IonCheckbox>
        ))}
      </div>
    );
  };

  return (
    <>
      <ItemGroup title="Toto zariadenie">
        <Drawer active={!state.notify_type.find((child) => child.id === 2).value && allowNotify}>
          <SmallError title="Ak chceš dostávať upozornenia, zaškrtni posielanie push notifikácii." />
          <br />
        </Drawer>
        <Toggle checked={allowNotify} onIonChange={handleNotify}>
          Dostávať upozornenia na toto zariadenie.
        </Toggle>
      </ItemGroup>
      <ItemGroup title="Spôsob posielania">
        <p>V tejto sekcii nastavíš posielanie upozornení všeobecne.</p>
        <Checkboxes content={state.notify_type} name="notify_type" onIonChange={handleChange} />
        <Drawer active={state.notify_type.find((child) => child.id === 1).value}>
          <Input name="email" label="Email, kam budeš dostávať upozornenia" type="email" value={state.email} required onIonChange={handleChange} />
        </Drawer>
      </ItemGroup>
      <ItemGroup title="Novinky">
        <SmallWarning title="Upozornenia na túto sekciu je zatiaľ možné posielať iba cez email." />
        <br />
        <Toggle name="send_news" checked={state.send_news} onIonChange={handleChange}>
          Upozorniť ma na pridané novinky
        </Toggle>
      </ItemGroup>
      <ItemGroup title="Termíny prihlášok">
        <Toggle name="send_races" checked={state.send_races} onIonChange={handleChange}>
          Upozorniť ma na koniec termínu prihlášok
        </Toggle>
        <Drawer active={state.send_races}>
          <Spacing>
            <Input
              name="days_before"
              value={state.days_before}
              label={`Koľko dní pred termínom ma upozorniť (${state.days_before_min} - ${state.days_before_max})`}
              type="number"
              required
              onIonChange={handleChange}
            />
            <p>Upozorniť ma na tieto typy pretekov:</p>
            <Checkboxes content={state.race_types} name="race_types" onIonChange={handleChange} />
            <p>Upozorniť ma na preteky z tohto rebríčka:</p>
            <Checkboxes content={state.rankings} name="rankings" onIonChange={handleChange} />
          </Spacing>
        </Drawer>
      </ItemGroup>
      <ItemGroup title="Zmeny termínu">
        <Toggle name="send_changes" checked={state.send_changes} onIonChange={handleChange}>
          Upozorniť ma na zmeny termínu
        </Toggle>
        <Drawer active={state.send_changes}>
          <Checkboxes content={state.send_changes_data} name="send_changes_data" onIonChange={handleChange} />
        </Drawer>
      </ItemGroup>
      <ItemGroup title="Financie">
        <SmallWarning title="Upozornenia na túto sekciu je zatiaľ možné posielať iba cez email." />
        <br />
        <Toggle name="send_finances" checked={state.send_finances} onIonChange={handleChange}>
          Upozorniť ma na môj finančný stav
        </Toggle>
        <Drawer active={state.send_finances}>
          <Checkboxes content={state.send_finances_data} name="send_finances_data" />
          <Drawer active={state.send_finances_data.find((child) => child.id === 1).value}>
            <Input label="Hranica (Kč)" name="financial_limit" value={state.financial_limit} type="number" required onIonChange={handleChange} />
          </Drawer>
        </Drawer>
      </ItemGroup>
      {(Session.pull().policies.regs || Session.pull().policies.fin) && (
        <ItemGroup title="Pokročilé">
          <SmallWarning title="Upozornenia na túto sekciu je zatiaľ možné posielať iba cez email." />
          <br />
          <Spacing>
            <Toggle name="send_internal_entry_expired" checked={state.send_internal_entry_expired} disabled={!Session.pull().policies.regs} onIonChange={handleChange}>
              Upozorniť ma, keď uplynul interný termín
            </Toggle>
            <Toggle name="send_member_minus" checked={state.send_member_minus} disabled={!Session.pull().policies.fin} onIonChange={handleChange}>
              Upozorniť ma na členov, ktorí sa na účte dostali do mínusu
            </Toggle>
          </Spacing>
        </ItemGroup>
      )}
    </>
  );
};
