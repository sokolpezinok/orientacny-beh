import { IonButton, IonButtons, IonContent, IonIcon, IonPage, IonSelectOption } from "@ionic/react";
import { alertCircleOutline, save } from "ionicons/icons";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { Header, Input, ItemGroup, Refresher, Select, Toggle } from "@/components/ui/Design";
import { useModal } from "@/components/ui/Modals";
import { UserApi } from "@/utils/api";
import countries from "@/utils/countries";
import { Session } from "@/utils/storage";
import Content, { StatefulForm, useStatefulForm } from "../controllers/Content";

export default () => <Content Render={Profile} fetchContent={UserApi.profile} />;

const Profile = memo(({ content, onUpdate }) => {
  const { t } = useTranslation();
  const { actionFeedbackModal } = useModal();
  const formRef = useStatefulForm();

  const handleSubmit = actionFeedbackModal(async (data) => {
    await UserApi.profile_update(data);
    return t("profile.profileUpdateSuccess");
  }, t("profile.profileUpdateError"));

  return (
    <IonPage>
      <Header defaultHref="/tabs/settings" title={t("profile.title")}>
        <IonButtons slot="end">
          <IonButton onClick={() => formRef.current?.submit()}>
            <IonIcon slot="icon-only" icon={save} />
          </IonButton>
        </IonButtons>
      </Header>
      <IonContent>
        <Refresher onUpdate={onUpdate} />
        <StatefulForm Render={ProfileForm} content={content} onSubmit={handleSubmit} />
      </IonContent>
    </IonPage>
  );
});

export const ProfileForm = ({ store }) => {
  const { t } = useTranslation();
  const state = store.useState();
  const { alertModal } = useModal();

  const handleChange = (event) => {
    const { name, checked, value } = event.target;

    store.update((s) => {
      s[name] = checked ?? value;
    });
  };

  const disabled = !(Session.pull().policies.adm_small || Session.pull().policies.mng_big);

  const handleExplainDisabled = () => alertModal(t("profile.alertUpdateDisabledTitle"), t("profile.alertUpdateDisabledBody"));

  return (
    <>
      {disabled && (
        <ItemGroup>
          <div className="bg-primary-container grid grid-cols-[auto_1fr] gap-4 rounded-lg p-4">
            <IonIcon icon={alertCircleOutline} className="self-center text-2xl" />
            <a className="!text-inherit" onClick={handleExplainDisabled}>
              {t("profile.alertUpdateDisabledTitle")}
            </a>
          </div>
        </ItemGroup>
      )}
      <ItemGroup title={t("profile.general")} subtitle={t("profile.howIsYourDataUsed")}>
        <Input disabled={disabled} label={t("profile.name")} name="name" value={state.name} required onIonChange={handleChange} />
        <Input disabled={disabled} label={t("profile.surname")} name="surname" value={state.surname} required onIonChange={handleChange} />
        <Select disabled={disabled} label={t("profile.gender")} name="gender" value={state.gender} required onIonChange={handleChange}>
          <IonSelectOption value="H">{t("profile.man")}</IonSelectOption>
          <IonSelectOption value="D">{t("profile.woman")}</IonSelectOption>
        </Select>
        <Input disabled={disabled} label={t("profile.birthDate")} name="birth_date" value={state.birth_date} type="date" required onIonChange={handleChange} />
        <Input disabled={disabled} label={t("profile.birthNumber")} name="birth_number" value={state.birth_number} type="number" required onIonChange={handleChange} />
        <Select disabled={disabled} label={t("profile.nationality")} name="nationality" value={state.nationality} required onIonChange={handleChange}>
          {countries.map(([code, name]) => (
            <IonSelectOption key={code} value={code}>
              {name}
            </IonSelectOption>
          ))}
        </Select>
        <Toggle disabled={!Session.pull().policies.adm_small} name="is_hidden" checked={state.is_hidden} onIonChange={handleChange}>
          {t("profile.hiddenAccount")}
        </Toggle>
      </ItemGroup>
      <ItemGroup title={t("profile.contacts")}>
        <Input label={t("profile.email")} name="email" value={state.email} onIonChange={handleChange} />
        <Input label={t("profile.address")} name="address" value={state.address} onIonChange={handleChange} />
        <Input label={t("profile.city")} name="city" value={state.city} onIonChange={handleChange} />
        <Input label={t("profile.postalCode")} name="postal_code" value={state.postal_code} onIonChange={handleChange} />
        <Input label={t("profile.phone")} name="phone" value={state.phone} onIonChange={handleChange} />
        <Input label={t("profile.phoneHome")} name="phone_home" value={state.phone_home} onIonChange={handleChange} />
        <Input label={t("profile.phoneWork")} name="phone_work" value={state.phone_work} onIonChange={handleChange} />
      </ItemGroup>
      <ItemGroup title={t("profile.chip")}>
        <Input label={t("profile.chipNumber")} name="si_chip" value={state.si_chip} onIonChange={handleChange} />
        <Input disabled={disabled} label={t("profile.regNumber")} name="reg" value={state.reg} onIonChange={handleChange} />
      </ItemGroup>
      <ItemGroup title={t("profile.licenses")}>
        <Select label={t("profile.licenseOB")} name="licence_ob" value={state.licence_ob} onIonChange={handleChange}>
          <IonSelectOption value="-">{t("profile.noLicense")}</IonSelectOption>
          <IonSelectOption value="E">E</IonSelectOption>
          <IonSelectOption value="A">A</IonSelectOption>
          <IonSelectOption value="B">B</IonSelectOption>
          <IonSelectOption value="C">C</IonSelectOption>
          <IonSelectOption value="D">D</IonSelectOption>
          <IonSelectOption value="R">R</IonSelectOption>
        </Select>
        <Select label={t("profile.licenseLOB")} name="licence_lob" value={state.licence_lob} onIonChange={handleChange}>
          <IonSelectOption value="-">{t("profile.noLicense")}</IonSelectOption>
          <IonSelectOption value="E">E</IonSelectOption>
          <IonSelectOption value="A">A</IonSelectOption>
          <IonSelectOption value="B">B</IonSelectOption>
          <IonSelectOption value="C">C</IonSelectOption>
          <IonSelectOption value="D">D</IonSelectOption>
          <IonSelectOption value="R">R</IonSelectOption>
        </Select>
        <Select label={t("profile.licenseMTBO")} name="licence_mtbo" value={state.licence_mtbo} onIonChange={handleChange}>
          <IonSelectOption value="-">{t("profile.noLicense")}</IonSelectOption>
          <IonSelectOption value="E">E</IonSelectOption>
          <IonSelectOption value="A">A</IonSelectOption>
          <IonSelectOption value="B">B</IonSelectOption>
          <IonSelectOption value="C">C</IonSelectOption>
          <IonSelectOption value="D">D</IonSelectOption>
          <IonSelectOption value="R">R</IonSelectOption>
        </Select>
      </ItemGroup>
      <ItemGroup>
        <small>{t("profile.memberID", { id: state.user_id })}</small>
      </ItemGroup>
    </>
  );
};
