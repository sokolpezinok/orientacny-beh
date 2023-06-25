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
  useIonAlert,
  IonToggle,
} from '@ionic/react';
import { useState, useEffect, useCallback } from 'react';
import { FatalError, Spinner } from '../ui/Media';
import Form from '../ui/Form';
import Store from '@/store';
import Countries from '../../store/countries';
import { Button, ButtonsWrapper } from '../ui/Buttons';

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
  const club = Store.useState(s => s.club);
  const token = Store.useState(s => s.token);

  const [presentAlert] = useIonAlert();
  const emitAlert = text =>
    presentAlert({
      message: text,
      buttons: ['OK'],
    });

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const updateData = useCallback(() => {
    if (club === null || token === null) return;

    fetch(club + 'api/user.php', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ action: 'view_user_data', token }) })
      .then(data => data.json())
      .then(data => (data.status === 'ok' ? setData(data.data) : setError(data.message)))
      .catch(error => setError(error.message));
  }, [club, token]);

  useEffect(() => {
    updateData();
  }, [club, token, updateData]);

  const handleRefresh = event => {
    updateData();
    event.detail.complete();
  };

  const handleSubmit = els => {
    if (club === null || token === null) return;

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
      register_number: els.register_number.value,
      chip_number: els.chip_number.value,
      licence_ob: els.licence_ob.value,
      licence_lob: els.licence_lob.value,
      licence_mtbo: els.licence_mtbo.value,
      is_hidden: els.is_hidden.checked,
    };

    fetch(club + 'api/user.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ action: 'update_user_data', token, ...wanted_inputs }),
    })
      .then(data => data.json())
      .then(data => (data.status === 'ok' ? emitAlert('Hotovo!') : emitAlert('Chyba: ' + data.message)))
      .catch(error => emitAlert('Chyba: ' + error.message));
  };

  if (data === null && error === null) return <Spinner />;
  if (data === null)
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
      <Form onSubmit={handleSubmit}>
        <IonAccordionGroup>
          <IonAccordion>
            <IonItem slot="header">
              <IonLabel>Všeobecné</IonLabel>
            </IonItem>
            <div slot="content">
              <IonGrid className="mx-4 py-4">
                <IonRow>
                  <IonInput label="Meno" labelPlacement="floating" name="name" value={data.name} placeholder="..." />
                </IonRow>
                <IonRow>
                  <IonInput label="Priezvisko" labelPlacement="floating" name="surname" value={data.surname} placeholder="..." />
                </IonRow>
                <IonRow>
                  <IonSelect label="Pohlavie" labelPlacement="floating" name="gender" value={data.gender} placeholder="...">
                    <IonSelectOption value="H">Mužské</IonSelectOption>
                    <IonSelectOption value="D">Ženské</IonSelectOption>
                    <IonSelectOption value="D">Nechcem povedať</IonSelectOption>
                  </IonSelect>
                </IonRow>
                <IonRow>
                  <IonInput label="Narodenie" labelPlacement="floating" name="birth_date" value={data.birth_date} placeholder="..." type="date" />
                </IonRow>
                <IonRow>
                  <IonInput label="Rodné číslo" labelPlacement="floating" name="birth_number" value={data.birth_number} placeholder="..." type="number" />
                </IonRow>
                <IonRow>
                  <IonSelect label="Národnosť" labelPlacement="floating" name="nationality" value={data.nationality} placeholder="...">
                    {Countries.map(([code, name]) => (
                      <IonSelectOption key={code} value={code}>
                        {name}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonRow>
              </IonGrid>
            </div>
          </IonAccordion>
          <IonAccordion>
            <IonItem slot="header">
              <IonLabel>Kontakty</IonLabel>
            </IonItem>
            <div slot="content">
              <IonGrid className="mx-4 py-4">
                <IonRow>
                  <IonInput label="Email" labelPlacement="floating" name="email" value={data.email} placeholder="..." />
                </IonRow>
                <IonRow>
                  <IonInput label="Adresa" labelPlacement="floating" name="address" value={data.address} placeholder="..." />
                </IonRow>
                <IonRow>
                  <IonInput label="Mesto" labelPlacement="floating" name="city" value={data.city} placeholder="..." />
                </IonRow>
                <IonRow>
                  <IonInput label="PŠC" labelPlacement="floating" name="postal_code" value={data.postal_code} placeholder="..." type="number" />
                </IonRow>
                <IonRow>
                  <IonInput label="Mobil" labelPlacement="floating" name="phone" value={data.phone} placeholder="..." type="tel" />
                </IonRow>
                <IonRow>
                  <IonInput label="Mobil domov" labelPlacement="floating" name="phone_home" value={data.phone_home} placeholder="..." type="tel" />
                </IonRow>
                <IonRow>
                  <IonInput label="Mobil pracovný" labelPlacement="floating" name="phone_work" value={data.phone_work} placeholder="..." type="tel" />
                </IonRow>
              </IonGrid>
            </div>
          </IonAccordion>
          <IonAccordion>
            <IonItem slot="header">
              <IonLabel>Informácie</IonLabel>
            </IonItem>
            <div slot="content">
              <IonGrid className="mx-4 py-4">
                <IonRow>
                  <IonInput label="Registrácia" labelPlacement="floating" name="register_number" value={data.register_number} placeholder="..." type="number" />
                </IonRow>
                <IonRow>
                  <IonInput label="Čip" labelPlacement="floating" name="chip_number" value={data.chip_number} placeholder="..." type="number" />
                </IonRow>
                <IonRow>
                  <IonToggle labelPlacement="start" name="is_hidden" checked={data.is_hidden}>
                    Skryť
                  </IonToggle>
                </IonRow>
                <IonRow>
                  <IonSelect label="Licencia OB" labelPlacement="floating" name="licence_ob" value={data.licence_ob} placeholder="...">
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
                  <IonSelect label="Licencia LOB" labelPlacement="floating" name="licence_lob" value={data.licence_lob} placeholder="...">
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
                  <IonSelect label="Licencia MTBO" labelPlacement="floating" name="licence_mtbo" value={data.licence_mtbo} placeholder="...">
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
