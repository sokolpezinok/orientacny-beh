import { Header, ItemLink } from "@/components/ui/Design";
import { useModal } from "@/utils/modals";
import { Notifications } from "@/utils/notify";
import { Storage } from "@/utils/storage";
import { Capacitor } from "@capacitor/core";
import { IonContent, IonHeader, IonPage } from "@ionic/react";

const Settings = () => {
  const { confirmModal, smartModal } = useModal();

  const handleLogout = smartModal(async (event) => {
    const surety = await confirmModal("Naozaj sa chceš odhlásiť?");
    if (!surety) return event.preventDefault();

    if (Capacitor.isNativePlatform()) {
      await Notifications.register(false);
    }

    await Storage.push((s) => {
      s.isLoggedIn = false;
    });
  }, "Nepodarilo sa ťa odhlásiť.");

  return (
    <IonPage>
      <IonHeader>
        <Header title="Nastavenia" />
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
