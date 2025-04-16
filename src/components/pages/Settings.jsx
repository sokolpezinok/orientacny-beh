import { Header, ItemLink } from "@/components/ui/Design";
import { useModal } from "@/components/ui/Modals";
import { SystemApi } from "@/utils/api";
import { IonContent, IonHeader, IonPage } from "@ionic/react";

const Settings = () => {
  const { confirmModal, actionFeedbackModal } = useModal();

  const handleLogout = actionFeedbackModal(async (event) => {
    const surety = await confirmModal("Naozaj sa chceš odhlásiť?");
    if (!surety) return event.preventDefault();

    await SystemApi.logout();
  }, "Nepodarilo sa ťa odhlásiť.");

  return (
    <IonPage>
      <IonHeader>
        <Header title="Nastavenia" />
      </IonHeader>
      <IonContent>
        <ItemLink routerLink="/tabs/settings/profile">Profil</ItemLink>
        <ItemLink routerLink="/tabs/settings/notify">Upozornenia</ItemLink>
        <ItemLink routerLink="/tabs/settings/devices">Moje zariadenia</ItemLink>
        <ItemLink routerLink="#" onClick={handleLogout}>
          Odhlásiť sa
        </ItemLink>
        <ItemLink routerLink="/tabs/settings/about">O aplikácii</ItemLink>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
