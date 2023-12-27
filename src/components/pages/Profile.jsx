import {
  IonBackButton,
  IonButtons,
  IonItem,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonGrid,
  IonRow,
  IonRefresher,
  IonRefresherContent,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonAccordion,
  IonAccordionGroup,
  IonToggle,
} from "@ionic/react";
import { useState, useEffect } from "react";
import { FatalError, Spinner } from "../ui/Media";
import { ErrorModal, AlertModal } from "@/modals";
import Form from "../ui/Form";
import Store from "@/store";
import Countries from "@/countries";
import { Button, ButtonsWrapper } from "../ui/Buttons";
import { fetchPrivateApi, privateApi } from "@/api";

const Profile = ({}) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/settings" />
          </IonButtons>
          <IonTitle>Profil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <ProfileContent />
      </IonContent>
    </IonPage>
  );
};

export default Profile;

const ProfileContent = ({}) => {
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);

  const updateContent = async () => {
    const { token } = Store.getRawState();

    const data = await fetchPrivateApi(privateApi.user, { action: "user_data", token }, false).catch((response) => (content ? ErrorModal(response) : setError(response)));
    if (data === undefined) return;

    setContent(data);
  };

  useEffect(() => {
    updateContent();
  }, []);

  const handleRefresh = (event) => {
    updateContent();
    event.detail.complete();
  };

  const handleSubmit = async (els) => {
    const { token } = Store.getRawState();

    const wanted_inputs = {
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

    await fetchPrivateApi(privateApi.user, { action: "update_user_data", token, ...wanted_inputs });

    AlertModal("Vaše údaje boli úspešne aktualizované.");
  };

  if (content === null && error === null) return <Spinner />;
  if (content === null)
    return (
      <>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        <FatalError text="Nepodarilo sa načítať dáta." error={error} />
      </>
    );

  return (
    <>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent />
      </IonRefresher>
      {/* <IonItem>
        <IonLabel className="ion-text-wrap p-4">
          <h1>Ahoj, {content.name}!</h1>
          <ul className="mt-2 text-gray-500">
            <li>Čip: {content.chip_number}</li>
            <li>Email: {content.email}</li>
            <li>Číslo: {content.registration_number}</li>
            <li>ID: {content.user_id}</li>
          </ul>
        </IonLabel>
      </IonItem> */}
      <Form onSubmit={handleSubmit}>
        <IonAccordionGroup>
          <IonAccordion>
            <IonItem slot="header">
              <IonLabel>Všeobecné</IonLabel>
            </IonItem>
            <div slot="content" className="bg-orange-50 dark:bg-transparent">
              <IonGrid className="mx-4 py-4">
                <IonRow>
                  <IonInput label="Meno" labelPlacement="floating" name="name" value={content.name} placeholder="..." />
                </IonRow>
                <IonRow>
                  <IonInput label="Priezvisko" labelPlacement="floating" name="surname" value={content.surname} placeholder="..." />
                </IonRow>
                <IonRow>
                  <IonSelect label="Pohlavie" labelPlacement="floating" name="gender" value={content.gender} placeholder="...">
                    <IonSelectOption value="H">Mužské</IonSelectOption>
                    <IonSelectOption value="D">Ženské</IonSelectOption>
                  </IonSelect>
                </IonRow>
                <IonRow>
                  <IonInput label="Narodenie" labelPlacement="floating" name="birth_date" value={content.birth_date} placeholder="..." type="date" />
                </IonRow>
                <IonRow>
                  <IonInput label="Rodné číslo" labelPlacement="floating" name="birth_number" value={content.birth_number} placeholder="..." type="number" />
                </IonRow>
                <IonRow>
                  <IonSelect label="Národnosť" labelPlacement="floating" name="nationality" value={content.nationality} placeholder="...">
                    {Countries.map(([code, name]) => (
                      <IonSelectOption key={code} value={code}>
                        {name}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonRow>
                <IonRow>
                  <IonToggle labelPlacement="start" name="is_hidden" checked={content.is_hidden}>
                    Skryté konto
                  </IonToggle>
                </IonRow>
              </IonGrid>
            </div>
          </IonAccordion>
          <IonAccordion>
            <IonItem slot="header">
              <IonLabel>Kontakty</IonLabel>
            </IonItem>
            <div slot="content" className="bg-orange-50 dark:bg-transparent">
              <IonGrid className="mx-4 py-4">
                <IonRow>
                  <IonInput label="Email" labelPlacement="floating" name="email" value={content.email} placeholder="..." />
                </IonRow>
                <IonRow>
                  <IonInput label="Adresa" labelPlacement="floating" name="address" value={content.address} placeholder="..." />
                </IonRow>
                <IonRow>
                  <IonInput label="Mesto" labelPlacement="floating" name="city" value={content.city} placeholder="..." />
                </IonRow>
                <IonRow>
                  <IonInput label="PŠC" labelPlacement="floating" name="postal_code" value={content.postal_code} placeholder="..." type="number" />
                </IonRow>
                <IonRow>
                  <IonInput label="Mobil" labelPlacement="floating" name="phone" value={content.phone} placeholder="..." type="tel" />
                </IonRow>
                <IonRow>
                  <IonInput label="Mobil domov" labelPlacement="floating" name="phone_home" value={content.phone_home} placeholder="..." type="tel" />
                </IonRow>
                <IonRow>
                  <IonInput label="Mobil pracovný" labelPlacement="floating" name="phone_work" value={content.phone_work} placeholder="..." type="tel" />
                </IonRow>
              </IonGrid>
            </div>
          </IonAccordion>
          <IonAccordion>
            <IonItem slot="header">Čip</IonItem>
            <div slot="content" className="bg-orange-50 dark:bg-transparent">
              <IonGrid className="mx-4 py-4">
                <IonRow>
                  <IonInput label="Čip" labelPlacement="floating" name="chip_number" value={content.chip_number} placeholder="..." type="number" />
                </IonRow>
                <IonRow>
                  <IonInput label="Registračné číslo" labelPlacement="floating" name="registration_number" value={content.registration_number} placeholder="..." type="number" />
                </IonRow>
              </IonGrid>
            </div>
          </IonAccordion>
          <IonAccordion>
            <IonItem slot="header">
              <IonLabel>Licencie</IonLabel>
            </IonItem>
            <div slot="content" className="bg-orange-50 dark:bg-transparent">
              <IonGrid className="mx-4 py-4">
                <IonRow>
                  <IonSelect label="Licencia OB" labelPlacement="floating" name="licence_ob" value={content.licence_ob} placeholder="...">
                    <IonSelectOption value="-">Žiadna</IonSelectOption>
                    <IonSelectOption value="E">E</IonSelectOption>
                    <IonSelectOption value="A">A</IonSelectOption>
                    <IonSelectOption value="B">B</IonSelectOption>
                    <IonSelectOption value="C">C</IonSelectOption>
                    <IonSelectOption value="D">D</IonSelectOption>
                    <IonSelectOption value="R">R</IonSelectOption>
                  </IonSelect>
                </IonRow>
                <IonRow>
                  <IonSelect label="Licencia LOB" labelPlacement="floating" name="licence_lob" value={content.licence_lob} placeholder="...">
                    <IonSelectOption value="-">Žiadna</IonSelectOption>
                    <IonSelectOption value="E">E</IonSelectOption>
                    <IonSelectOption value="A">A</IonSelectOption>
                    <IonSelectOption value="B">B</IonSelectOption>
                    <IonSelectOption value="C">C</IonSelectOption>
                    <IonSelectOption value="D">D</IonSelectOption>
                    <IonSelectOption value="R">R</IonSelectOption>
                  </IonSelect>
                </IonRow>
                <IonRow>
                  <IonSelect label="Licencia MTBO" labelPlacement="floating" name="licence_mtbo" value={content.licence_mtbo} placeholder="...">
                    <IonSelectOption value="-">Žiadna</IonSelectOption>
                    <IonSelectOption value="E">E</IonSelectOption>
                    <IonSelectOption value="A">A</IonSelectOption>
                    <IonSelectOption value="B">B</IonSelectOption>
                    <IonSelectOption value="C">C</IonSelectOption>
                    <IonSelectOption value="D">D</IonSelectOption>
                    <IonSelectOption value="R">R</IonSelectOption>
                  </IonSelect>
                </IonRow>
              </IonGrid>
            </div>
          </IonAccordion>
        </IonAccordionGroup>
        <IonItem>
          <ButtonsWrapper>
            <Button primary={true} type="submit">
              Zmeniť
            </Button>
          </ButtonsWrapper>
        </IonItem>
      </Form>
    </>
  );
};
