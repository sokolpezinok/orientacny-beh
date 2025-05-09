import { IonButton, IonButtons, IonContent, IonIcon, IonPage, IonSelectOption } from "@ionic/react";
import { alertCircleOutline, save } from "ionicons/icons";
import { memo } from "react";

import { Header, Input, ItemGroup, Refresher, Select, Toggle } from "@/components/ui/Design";
import { useModal } from "@/components/ui/Modals";
import { UserApi } from "@/utils/api";
import countries from "@/utils/countries";
import { Session } from "@/utils/storage";
import Content, { StatefulForm, useStatefulForm } from "../controllers/Content";

export default () => <Content Render={Profile} fetchContent={UserApi.profile} errorText="Nepodarilo sa načítať dáta." />;

const Profile = memo(({ content, onUpdate }) => {
  const { actionFeedbackModal } = useModal();
  const formRef = useStatefulForm();

  const handleSubmit = actionFeedbackModal(async (data) => {
    await UserApi.profile_update(data);
    return "Vaše údaje boli úspešne aktualizované.";
  }, "Nepodarilo sa aktualizovať údaje.");

  return (
    <IonPage>
      <Header defaultHref="/tabs/settings" title="Profil">
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
  const state = store.useState();
  const { alertModal } = useModal();

  const handleChange = (event) => {
    const { name, checked, value } = event.target;

    store.update((s) => {
      s[name] = checked ?? value;
    });
  };

  const disabled = !(Session.pull().policies.adm_small || Session.pull().policies.mng_big);

  const handleExplainDisabled = () =>
    alertModal(
      "Prečo nemôžem meniť niektoré nastavenia?",
      "Niektoré nastavenia sú pre členov zablokované, aby sa predišlo problémom s prihlasovaním do pretekov a zabezpečila sa stabilita systému. Ak potrebuješ vykonať zmeny, prosím, obráť sa na administrátora."
    );

  return (
    <>
      {disabled && (
        <ItemGroup>
          <div className="bg-primary-container grid grid-cols-[auto_1fr] gap-4 rounded-lg p-4">
            <IonIcon icon={alertCircleOutline} className="self-center text-2xl" />
            <a className="!text-inherit" onClick={handleExplainDisabled}>
              Prečo nemôžem meniť niektoré nastavenia?
            </a>
          </div>
        </ItemGroup>
      )}
      <ItemGroup title="Všeobecné" subtitle="Zadané údaje sa používajú na registráciu člena do centrálnej registrácie a na prihlasovanie na preteky.">
        <Input disabled={disabled} label="Meno" name="name" value={state.name} required onIonChange={handleChange} />
        <Input disabled={disabled} label="Priezvisko" name="surname" value={state.surname} required onIonChange={handleChange} />
        <Select disabled={disabled} label="Pohlavie" name="gender" value={state.gender} required onIonChange={handleChange}>
          <IonSelectOption value="H">Muž</IonSelectOption>
          <IonSelectOption value="D">Žena</IonSelectOption>
        </Select>
        <Input disabled={disabled} label="Dátum narodenia" name="birth_date" value={state.birth_date} type="date" required onIonChange={handleChange} />
        <Input disabled={disabled} label="Rodné číslo" name="birth_number" value={state.birth_number} type="number" required onIonChange={handleChange} />
        <Select disabled={disabled} label="Národnosť" name="nationality" value={state.nationality} required onIonChange={handleChange}>
          {countries.map(([code, name]) => (
            <IonSelectOption key={code} value={code}>
              {name}
            </IonSelectOption>
          ))}
        </Select>
        <Toggle disabled={!Session.pull().policies.adm_small} name="is_hidden" checked={state.is_hidden} onIonChange={handleChange}>
          Skryté konto
        </Toggle>
      </ItemGroup>
      <ItemGroup title="Kontakty">
        <Input label="Email" name="email" value={state.email} onIonChange={handleChange} />
        <Input label="Adresa" name="address" value={state.address} onIonChange={handleChange} />
        <Input label="Mesto" name="city" value={state.city} onIonChange={handleChange} />
        <Input label="PSČ" name="postal_code" value={state.postal_code} onIonChange={handleChange} />
        <Input label="Mobil" name="phone" value={state.phone} onIonChange={handleChange} />
        <Input label="Domáci mobil" name="phone_home" value={state.phone_home} onIonChange={handleChange} />
        <Input label="Pracovný mobil" name="phone_work" value={state.phone_work} onIonChange={handleChange} />
      </ItemGroup>
      <ItemGroup title="Čip">
        <Input label="Číslo čipu" name="si_chip" value={state.si_chip} onIonChange={handleChange} />
        <Input disabled={disabled} label="Registračné číslo" name="reg" value={state.reg} onIonChange={handleChange} />
      </ItemGroup>
      <ItemGroup title="Licencie">
        <Select label="Licencia OB" name="licence_ob" value={state.licence_ob} onIonChange={handleChange}>
          <IonSelectOption value="-">Žiadna</IonSelectOption>
          <IonSelectOption value="E">E</IonSelectOption>
          <IonSelectOption value="A">A</IonSelectOption>
          <IonSelectOption value="B">B</IonSelectOption>
          <IonSelectOption value="C">C</IonSelectOption>
          <IonSelectOption value="D">D</IonSelectOption>
          <IonSelectOption value="R">R</IonSelectOption>
        </Select>
        <Select label="Licencia LOB" name="licence_lob" value={state.licence_lob} onIonChange={handleChange}>
          <IonSelectOption value="-">Žiadna</IonSelectOption>
          <IonSelectOption value="E">E</IonSelectOption>
          <IonSelectOption value="A">A</IonSelectOption>
          <IonSelectOption value="B">B</IonSelectOption>
          <IonSelectOption value="C">C</IonSelectOption>
          <IonSelectOption value="D">D</IonSelectOption>
          <IonSelectOption value="R">R</IonSelectOption>
        </Select>
        <Select label="Licencia MTBO" name="licence_mtbo" value={state.licence_mtbo} onIonChange={handleChange}>
          <IonSelectOption value="-">Žiadna</IonSelectOption>
          <IonSelectOption value="E">E</IonSelectOption>
          <IonSelectOption value="A">A</IonSelectOption>
          <IonSelectOption value="B">B</IonSelectOption>
          <IonSelectOption value="C">C</IonSelectOption>
          <IonSelectOption value="D">D</IonSelectOption>
          <IonSelectOption value="R">R</IonSelectOption>
        </Select>
      </ItemGroup>
      <ItemGroup>
        <small>ID člena: {state.user_id}</small>
      </ItemGroup>
    </>
  );
};
