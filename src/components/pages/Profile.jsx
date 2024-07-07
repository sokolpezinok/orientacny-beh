import { IonAccordion, IonAccordionGroup, IonGrid, IonList, IonRow, IonSelect, IonSelectOption } from "@ionic/react";

import { UserApi } from "@/utils/api";
import countries from "@/utils/countries";
import { useModal } from "@/utils/modals";
import { Storage } from "@/utils/storage";
import { useRef } from "react";
import Content from "../controllers/Content";
import { Header, Input, PrimaryButton, Select, Spacing, Text, Toggle } from "../ui/Design";

export default () => <Content Render={Profile} Header={() => <Header backHref="/tabs/settings">Profil</Header>} updateData={() => UserApi.data()} errorText="Nepodarilo sa načítať dáta." />;

const Profile = ({ content }) => {
  const { smartModal } = useModal({ errorHeader: "Nepodarilo sa aktualizovať profil." });
  const ref = useRef(null);

  const canUserEdit = !Storage.pull().policies.policy_mng;

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
    await UserApi.update(collected);
    return "Vaše údaje boli úspešne aktualizované.";
  }, "Nepodarilo sa aktualizovať údaje.");

  return (
    <form ref={ref}>
      <IonList>
        <IonAccordionGroup>
          <IonAccordion>
            <Text slot="header">Všeobecné</Text>
            <div slot="content" className="bg-orange-50 dark:bg-transparent">
              <IonGrid className="mx-4 py-4">
                <IonRow>
                  <Input disabled={canUserEdit} label="Meno" name="name" value={content.name} />
                </IonRow>
                <IonRow>
                  <Input disabled={canUserEdit} label="Priezvisko" name="surname" value={content.surname} />
                </IonRow>
                <IonRow>
                  <Select disabled={canUserEdit} label="Pohlavie" name="gender" value={content.gender}>
                    <IonSelectOption value="H">Mužské</IonSelectOption>
                    <IonSelectOption value="D">Ženské</IonSelectOption>
                  </Select>
                </IonRow>
                <IonRow>
                  <Input disabled={canUserEdit} label="Narodenie" name="birth_date" value={content.birth_date} type="date" />
                </IonRow>
                <IonRow>
                  <Input disabled={canUserEdit} label="Rodné číslo" name="birth_number" value={content.birth_number} type="number" />
                </IonRow>
                <IonRow>
                  <IonSelect disabled={canUserEdit} label="Národnosť" name="nationality" value={content.nationality}>
                    {countries.map(([code, name]) => (
                      <IonSelectOption key={code} value={code}>
                        {name}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonRow>
                <IonRow>
                  <Toggle disabled={true} name="is_hidden" checked={content.is_hidden}>
                    Skryté konto
                  </Toggle>
                </IonRow>
              </IonGrid>
            </div>
          </IonAccordion>
          <IonAccordion>
            <Text slot="header">Kontakty</Text>
            <div slot="content" className="bg-orange-50 dark:bg-transparent">
              <IonGrid className="mx-4 py-4">
                <IonRow>
                  <Input label="Email" name="email" value={content.email} />
                </IonRow>
                <IonRow>
                  <Input label="Adresa" name="address" value={content.address} />
                </IonRow>
                <IonRow>
                  <Input label="Mesto" name="city" value={content.city} />
                </IonRow>
                <IonRow>
                  <Input label="PŠC" name="postal_code" value={content.postal_code} type="number" />
                </IonRow>
                <IonRow>
                  <Input label="Mobil" name="phone" value={content.phone} type="tel" />
                </IonRow>
                <IonRow>
                  <Input label="Domáci mobil" name="phone_home" value={content.phone_home} type="tel" />
                </IonRow>
                <IonRow>
                  <Input label="Pracovný mobil" name="phone_work" value={content.phone_work} type="tel" />
                </IonRow>
              </IonGrid>
            </div>
          </IonAccordion>
          <IonAccordion>
            <Text slot="header">Čip</Text>
            <div slot="content" className="bg-orange-50 dark:bg-transparent">
              <IonGrid className="mx-4 py-4">
                <IonRow>
                  <Input label="Čip" name="chip_number" value={content.chip_number} type="number" />
                </IonRow>
                <IonRow>
                  <Input disabled={canUserEdit} label="Registračné číslo" name="registration_number" value={content.registration_number} type="number" />
                </IonRow>
              </IonGrid>
            </div>
          </IonAccordion>
          <IonAccordion>
            <Text slot="header">Licencie</Text>
            <div slot="content" className="bg-orange-50 dark:bg-transparent">
              <IonGrid className="mx-4 py-4">
                <IonRow>
                  <Select label="Licencia OB" name="licence_ob" value={content.licence_ob}>
                    <IonSelectOption value="-">Žiadna</IonSelectOption>
                    <IonSelectOption value="E">E</IonSelectOption>
                    <IonSelectOption value="A">A</IonSelectOption>
                    <IonSelectOption value="B">B</IonSelectOption>
                    <IonSelectOption value="C">C</IonSelectOption>
                    <IonSelectOption value="D">D</IonSelectOption>
                    <IonSelectOption value="R">R</IonSelectOption>
                  </Select>
                </IonRow>
                <IonRow>
                  <Select label="Licencia LOB" name="licence_lob" value={content.licence_lob}>
                    <IonSelectOption value="-">Žiadna</IonSelectOption>
                    <IonSelectOption value="E">E</IonSelectOption>
                    <IonSelectOption value="A">A</IonSelectOption>
                    <IonSelectOption value="B">B</IonSelectOption>
                    <IonSelectOption value="C">C</IonSelectOption>
                    <IonSelectOption value="D">D</IonSelectOption>
                    <IonSelectOption value="R">R</IonSelectOption>
                  </Select>
                </IonRow>
                <IonRow>
                  <Select label="Licencia MTBO" name="licence_mtbo" value={content.licence_mtbo}>
                    <IonSelectOption value="-">Žiadna</IonSelectOption>
                    <IonSelectOption value="E">E</IonSelectOption>
                    <IonSelectOption value="A">A</IonSelectOption>
                    <IonSelectOption value="B">B</IonSelectOption>
                    <IonSelectOption value="C">C</IonSelectOption>
                    <IonSelectOption value="D">D</IonSelectOption>
                    <IonSelectOption value="R">R</IonSelectOption>
                  </Select>
                </IonRow>
              </IonGrid>
            </div>
          </IonAccordion>
        </IonAccordionGroup>
        <Spacing>
          <PrimaryButton onClick={handleSubmit}>Zmeniť</PrimaryButton>
        </Spacing>
      </IonList>
    </form>
  );
};
