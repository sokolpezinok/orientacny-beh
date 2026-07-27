import { IonButton, IonButtons, IonCheckbox, IonContent, IonIcon, IonPage } from "@ionic/react";
import { save } from "ionicons/icons";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { Drawer, Header, Input, ItemGroup, SmallError, SmallWarning, Spacing, Toggle } from "@/components/ui/Design";
import { useModal } from "@/components/ui/Modals";
import { UserApi, UserNotify as UserNotifyType } from "@/utils/api";
import { Notifications } from "@/utils/notify";
import { Session, Storage } from "@/utils/storage";
import { InputChangeEventDetail, IonInputCustomEvent, IonToggleCustomEvent, ToggleChangeEventDetail } from "@ionic/core";
import { Store } from "pullstate";
import Content, { RenderComponent, StatefulForm, useStatefulForm } from "../controllers/Content";

export default () => <Content Render={Notify} fetchContent={UserApi.notify} />;

const Notify: RenderComponent<typeof UserApi.notify> = memo(({ content }) => {
  const { t } = useTranslation();
  const { actionFeedbackModal } = useModal();
  const formRef = useStatefulForm();

  const handleSubmit = actionFeedbackModal(async (readonly: any) => {
    // data and readonly behaves very weirdly

    if (readonly.email.length === 0 && readonly.notify_type.find((child: any) => child.id === 1).value) {
      throw t("notify.fillEmail");
    }
    // data is needed to clone, because changing it will change pullstate state
    const data = structuredClone(readonly);

    // but cloning data will weirdly cast objects to numbers, so we need to read values from readonly
    for (const key of ["notify_type", "race_types", "rankings", "send_changes_data", "send_finances_data"]) {
      data[key] = readonly[key].filter((child: any) => child.value).reduce((a: number, b: any) => a | b.id, 0);
    }

    await UserApi.notify_update(data);
    return t("notify.notifyUpdateSuccess");
  }, t("notify.notifyUpdateError"));

  return (
    <IonPage>
      <Header defaultHref="/tabs/settings" title={t("notify.title")}>
        <IonButtons slot="end">
          <IonButton onClick={() => formRef.current?.submit()}>
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

export const NotifyForm = ({ store }: { store: Store<UserNotifyType> }) => {
  const { t } = useTranslation();
  const state = store.useState();
  const { actionFeedbackModal } = useModal();

  const allowNotify = Storage.useStorage((s) => s.preferences.activeNotify);

  const handleNotify = actionFeedbackModal(async (event: any) => {
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
  }, t("notify.permissionChangeError"));

  const handleChange = (event: IonInputCustomEvent<InputChangeEventDetail> | IonToggleCustomEvent<ToggleChangeEventDetail>) => {
    const { name, value } = event.target;

    console.log("changing", name, value);

    store.update((s) => {
      (s as any)[name] = value;
    });
  };

  const Checkboxes = ({ content, name }: { content: { id: number; name: string; value: boolean }[]; name: string }) => {
    return (
      <div className="pt-2 pl-4">
        {content.map((child, index) => (
          /* workaround to https://github.com/ionic-team/ionic-docs/issues/3459 */
          // <div key={child.id} className="flex items-center" onClick={handleChange(index)}>
          //   <IonCheckbox key={child.id} checked={child.value} name={name} value={child.id} />
          //   <span className="ms-4">{child.name}</span>
          // </div>
          <IonCheckbox
            key={child.id}
            checked={child.value}
            name={name}
            onIonChange={(event) => {
              store.update((s) => {
                (s as any)[name][index].value = event.target.checked;
              });
            }}
            className="w-full"
            justify="start"
            labelPlacement="end"
          >
            {child.name}
          </IonCheckbox>
        ))}
      </div>
    );
  };

  return (
    <>
      <ItemGroup title={t("notify.thisDevice")}>
        <Drawer active={!state.notify_type.find((child) => child.id === 2)!.value && allowNotify}>
          <SmallError title={t("notify.clickToReceive")} />
          <br />
        </Drawer>
        <Toggle checked={allowNotify} onIonChange={handleNotify}>
          {t("notify.receiveOnThisDevice")}
        </Toggle>
      </ItemGroup>
      <ItemGroup title={t("notify.notifyType")}>
        <p>{t("notify.setupNotifyGenerally")}</p>
        <Checkboxes content={state.notify_type} name="notify_type" />
        <Drawer active={state.notify_type.find((child) => child.id === 1)!.value}>
          <Input name="email" label={t("notify.notifyEmail")} type="email" value={state.email} required onIonChange={handleChange} />
        </Drawer>
      </ItemGroup>
      <ItemGroup title={t("notify.news")}>
        <SmallWarning title={t("notify.sectionDoesNotSupportPushNotify")} />
        <br />
        <Toggle name="send_news" checked={state.send_news} onIonChange={handleChange}>
          {t("notify.notifyAboutNews")}
        </Toggle>
      </ItemGroup>
      <ItemGroup title={t("notify.deadline")}>
        <Toggle name="send_races" checked={state.send_races} onIonChange={handleChange}>
          {t("notify.notifyAboutDeadline")}
        </Toggle>
        <Drawer active={state.send_races}>
          <Spacing>
            <Input
              name="days_before"
              value={state.days_before}
              label={t("notify.notifyDeadlineDaysBefore", { min: state.days_before_min, max: state.days_before_max })}
              type="number"
              required
              onIonChange={handleChange}
            />
            <p>{t("notify.notifyAboutTheseRaceTypes")}</p>
            <Checkboxes content={state.race_types} name="race_types" />
            <p>{t("notify.notifyAboutTheseRankings")}</p>
            <Checkboxes content={state.rankings} name="rankings" />
          </Spacing>
        </Drawer>
      </ItemGroup>
      <ItemGroup title={t("notify.dateChange")}>
        <Toggle name="send_changes" checked={state.send_changes} onIonChange={handleChange}>
          {t("notify.notifyAboutDateChange")}
        </Toggle>
        <Drawer active={state.send_changes}>
          <Checkboxes content={state.send_changes_data} name="send_changes_data" />
        </Drawer>
      </ItemGroup>
      <ItemGroup title={t("notify.finances")}>
        <SmallWarning title={t("notify.sectionDoesNotSupportPushNotify")} />
        <br />
        <Toggle name="send_finances" checked={state.send_finances} onIonChange={handleChange}>
          {t("notify.notifyAboutMyBalance")}
        </Toggle>
        <Drawer active={state.send_finances}>
          <Checkboxes content={state.send_finances_data} name="send_finances_data" />
          <Drawer active={state.send_finances_data.find((child) => child.id === 1)!.value}>
            <Input label={t("notify.notifyAboutMyBalanceLimit")} name="financial_limit" value={state.financial_limit} type="number" required onIonChange={handleChange} />
          </Drawer>
        </Drawer>
      </ItemGroup>
      {(Session.getRawState().policies.regs || Session.getRawState().policies.fin) && (
        <ItemGroup title={t("notify.advanced")}>
          <SmallWarning title={t("notify.sectionDoesNotSupportPushNotify")} />
          <br />
          <Spacing>
            <Toggle name="send_internal_entry_expired" checked={state.send_internal_entry_expired} disabled={!Session.getRawState().policies.regs} onIonChange={handleChange}>
              {t("notify.notifyInternalEntryExpired")}
            </Toggle>
            <Toggle name="send_member_minus" checked={state.send_member_minus} disabled={!Session.getRawState().policies.fin} onIonChange={handleChange}>
              {t("notify.notifyMemberMinus")}
            </Toggle>
          </Spacing>
        </ItemGroup>
      )}
    </>
  );
};
