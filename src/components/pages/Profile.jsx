import { IonContent, IonPage, IonSelectOption } from "@ionic/react";

import { Header, Input, ItemGroup, PrimaryButton, Select, SmallWarning, Spacing, Toggle } from "@/components/ui/Design";
import { useModal } from "@/components/ui/Modals";
import { UserApi } from "@/utils/api";
import countries from "@/utils/countries";
import { Storage } from "@/utils/storage";
import { useRef } from "react";
import Content from "../controllers/Content";

export default () => <Content Render={Profile} updateData={UserApi.data} errorText="Nepodarilo sa načítať dáta." />;

const Profile = ({ content }) => {
  const { smartModal, alertModal } = useModal();
  const ref = useRef(null);

  const userEditDisabled = !Storage.pull().policies.policy_mng_big;

  const handleSubmit = smartModal(async () => {
    const els = ref.current.elements;
    const collected = {
      name: els.name.value,
      surname: els.surname.value,
      email: els.email.value,
      gender: els.gender.value,
      birth_date: els.birth_date.value,
      birth_number: els.birth_number.value,
      nationality: els.nationality.value,
      address: els.address.value,
      city: els.city.value,
      postal_code: els.postal_code.value,
      phone: els.phone.value,
      phone_home: els.phone_home.value,
      phone_work: els.phone_work.value,
      registration_number: els.registration_number.value,
      chip_number: els.chip_number.value,
      licence_ob: els.licence_ob.value,
      licence_lob: els.licence_lob.value,
      licence_mtbo: els.licence_mtbo.value,
      is_hidden: els.is_hidden.checked,
    };
    await UserApi.data_update(collected);
    return "Vaše údaje boli úspešne aktualizované.";
  }, "Nepodarilo sa aktualizovať údaje.");

  const handleExplainDisabled = () =>
    alertModal(
      "Prečo nemôžem meniť niektoré nastavenia?",
      "Niektoré nastavenia sú pre členov zablokované, aby sa predišlo problémom s prihlasovaním do pretekov a zabezpečila sa stabilita systému. Ak potrebuješ vykonať zmeny, prosím, obráť sa na administrátora."
    );

  return (
    <IonPage>
      <Header defaultHref="/tabs/settings" title="Profil" />
      <IonContent>
        <form ref={ref}>
          <ItemGroup title="Všeobecné">
            {userEditDisabled && (
              <>
                <SmallWarning>
                  <a className="!text-inherit" onClick={handleExplainDisabled}>
                    Prečo nemôžem meniť niektoré nastavenia?
                  </a>
                </SmallWarning>
                <br />
              </>
            )}
            <Input disabled={userEditDisabled} label="Meno" name="name" value={content.name} required />
            <Input disabled={userEditDisabled} label="Priezvisko" name="surname" value={content.surname} required />
            <Select disabled={userEditDisabled} label="Pohlavie" name="gender" value={content.gender} required>
              <IonSelectOption value="H">Muž</IonSelectOption>
              <IonSelectOption value="D">Žena</IonSelectOption>
            </Select>
            <Input disabled={userEditDisabled} label="Dátum narodenia" name="birth_date" value={content.birth_date} type="date" required />
            <Input disabled={userEditDisabled} label="Rodné číslo" name="birth_number" value={content.birth_number} type="number" required />
            <Select disabled={userEditDisabled} label="Národnosť" name="nationality" value={content.nationality} required>
              {countries.map(([code, name]) => (
                <IonSelectOption key={code} value={code}>
                  {name}
                </IonSelectOption>
              ))}
            </Select>
            <Toggle disabled={true} name="is_hidden" checked={content.is_hidden}>
              Skryté konto
            </Toggle>
          </ItemGroup>
          <ItemGroup title="Kontakty">
            <Input label="Email" name="email" value={content.email} />
            <Input label="Adresa" name="address" value={content.address} />
            <Input label="Mesto" name="city" value={content.city} />
            <Input label="PSČ" name="postal_code" value={content.postal_code} type="number" />
            <Input label="Mobil" name="phone" value={content.phone} type="tel" />
            <Input label="Domáci mobil" name="phone_home" value={content.phone_home} type="tel" />
            <Input label="Pracovný mobil" name="phone_work" value={content.phone_work} type="tel" />
          </ItemGroup>
          <ItemGroup title="Čip">
            <Input label="Čip" name="chip_number" value={content.chip_number} type="number" required />
            <Input disabled={userEditDisabled} label="Registračné číslo" name="registration_number" value={content.registration_number} type="number" required />
          </ItemGroup>
          <ItemGroup title="Licenie">
            <Select label="Licencia OB" name="licence_ob" value={content.licence_ob}>
              <IonSelectOption value="-">Žiadna</IonSelectOption>
              <IonSelectOption value="E">E</IonSelectOption>
              <IonSelectOption value="A">A</IonSelectOption>
              <IonSelectOption value="B">B</IonSelectOption>
              <IonSelectOption value="C">C</IonSelectOption>
              <IonSelectOption value="D">D</IonSelectOption>
              <IonSelectOption value="R">R</IonSelectOption>
            </Select>
            <Select label="Licencia LOB" name="licence_lob" value={content.licence_lob}>
              <IonSelectOption value="-">Žiadna</IonSelectOption>
              <IonSelectOption value="E">E</IonSelectOption>
              <IonSelectOption value="A">A</IonSelectOption>
              <IonSelectOption value="B">B</IonSelectOption>
              <IonSelectOption value="C">C</IonSelectOption>
              <IonSelectOption value="D">D</IonSelectOption>
              <IonSelectOption value="R">R</IonSelectOption>
            </Select>
            <Select label="Licencia MTBO" name="licence_mtbo" value={content.licence_mtbo}>
              <IonSelectOption value="-">Žiadna</IonSelectOption>
              <IonSelectOption value="E">E</IonSelectOption>
              <IonSelectOption value="A">A</IonSelectOption>
              <IonSelectOption value="B">B</IonSelectOption>
              <IonSelectOption value="C">C</IonSelectOption>
              <IonSelectOption value="D">D</IonSelectOption>
              <IonSelectOption value="R">R</IonSelectOption>
            </Select>
          </ItemGroup>
          <Spacing innerPadding>
            <PrimaryButton onClick={handleSubmit}>Zmeniť</PrimaryButton>
          </Spacing>
        </form>
      </IonContent>
    </IonPage>
  );
};
