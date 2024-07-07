import { useModal } from "@/utils/modals";
import { Notifications } from "@/utils/notify";
import { Storage } from "@/utils/storage";
import { IonContent, IonHeader, IonItem, IonList, IonPage } from "@ionic/react";
import { useEffect, useState } from "react";
import { Header, ItemLink, Text, Toggle } from "../ui/Design";

const Settings = () => {
  const { errorModal, confirmModal, smartModal } = useModal();
  const [token, setToken] = useState(null);

  const handleLogout = async (event) => {
    const surety = await confirmModal("Naozaj sa chceš odhlásiť?");
    if (!surety) return event.preventDefault();

    await Notifications.unregister();
    await Storage.push((s) => {
      s.isLoggedIn = false;
    });
  };

  const handleAllowNotify = smartModal(async (event) => {
    try {
      if (event.target.checked) {
        await Notifications.register();
      } else {
        await Notifications.unregister();
      }
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
        <IonList>
          <ItemLink routerLink="/tabs/settings/profile">Profil</ItemLink>
          <IonItem>
            <Toggle checked={Storage.pull().preferences.allowNotify} onIonChange={handleAllowNotify}>
              Povoliť notifikácie
            </Toggle>
          </IonItem>
          <Text>
            <p>{token ?? "-"}</p>
          </Text>
          <Text>
            <p>{JSON.stringify(Storage.pull().policies) ?? "-"}</p>
          </Text>
          <ItemLink routerLink="#" onClick={() => Notifications.notify({ title: "Hello", body: "World" })}>
            Notify
          </ItemLink>
          <ItemLink routerLink="#" onClick={handleLogout}>
            Odhlásiť sa
          </ItemLink>
          <ItemLink routerLink="/tabs/settings/about">O aplikácii</ItemLink>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
