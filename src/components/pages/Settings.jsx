import { useModal } from "@/utils/modals";
import { Notifications } from "@/utils/notify";
import { Storage } from "@/utils/storage";
import { IonContent, IonHeader, IonPage } from "@ionic/react";
import { useEffect, useState } from "react";
import { Header, ItemLink } from "../ui/Design";

const Settings = () => {
  const { errorModal, confirmModal, smartModal } = useModal();
  const [token, setToken] = useState(null);

  const handleLogout = smartModal(async (event) => {
    const surety = await confirmModal("Naozaj sa chceš odhlásiť?");
    if (!surety) return event.preventDefault();

    await Notifications.register(false);
    await Storage.push((s) => {
      s.isLoggedIn = false;
    });
  }, "Nepodarilo sa ťa odhlásiť.");

  const handleAllowNotify = smartModal(async (event) => {
    try {
      await Notifications.register(event.target.checked);
    } catch (error) {
      // when an error is thrown, undo toggle check
      event.target.checked = !event.target.checked;
      throw error;
    }

    await Storage.push((s) => {
      s.preferences.allowNotify = event.target.checked;
    });
  }, "Nepodarilo sa zmeniť nastavenie.");

  useEffect(() => {
    if (Storage.pull().preferences.allowNotify) {
      Notifications.getToken()
        .then((data) => setToken(data.token))
        .catch((error) => errorModal(error.message));
    }
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <Header>Nastavenia</Header>
      </IonHeader>
      <IonContent>
        <ItemLink routerLink="/tabs/settings/profile">Profil</ItemLink>
        <ItemLink routerLink="/tabs/settings/notify">Upozornenia</ItemLink>
        <ItemLink routerLink="#" onClick={handleLogout}>
          Odhlásiť sa
        </ItemLink>
        <ItemLink routerLink="/tabs/settings/about">O aplikácii</ItemLink>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
