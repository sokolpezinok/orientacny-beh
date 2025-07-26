import { IonContent, IonHeader, IonPage, IonSelectOption } from "@ionic/react";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { Header, Item, ItemLink, Select } from "@/components/ui/Design";
import { useModal } from "@/components/ui/Modals";
import { locales } from "@/i18n";
import { SystemApi } from "@/utils/api";
import { Storage } from "@/utils/storage";

const Settings = memo(({}) => {
  const { t } = useTranslation();
  const { confirmModal, actionFeedbackModal } = useModal();
  const locale = Storage.useState((s) => s.preferences.locale);

  const handleLogout = actionFeedbackModal(async (event) => {
    const surety = await confirmModal(t("settings.confirmSignOut"));
    if (!surety) return event.preventDefault();

    await SystemApi.logout();
  }, t("settings.signOutError"));

  const handleLocale = actionFeedbackModal(async (event) => {
    Storage.push((s) => {
      s.preferences.locale = event.target.value;
    });
  });

  return (
    <IonPage>
      <IonHeader>
        <Header title={t("settings.title")} />
      </IonHeader>
      <IonContent>
        <Item>
          <Select label={t("settings.selectLanguage")} value={locale} onIonChange={handleLocale}>
            {Object.entries(locales).map(([locale, name]) => (
              <IonSelectOption key={locale} value={locale}>
                {name}
              </IonSelectOption>
            ))}
          </Select>
        </Item>
        <ItemLink routerLink="/tabs/settings/profile">{t("profile.title")}</ItemLink>
        <ItemLink routerLink="/tabs/settings/notify">{t("notify.title")}</ItemLink>
        <ItemLink routerLink="/tabs/settings/devices">{t("devices.title")}</ItemLink>
        <ItemLink routerLink="#" onClick={handleLogout}>
          {t("settings.signOut")}
        </ItemLink>
        <ItemLink routerLink="/tabs/settings/about">{t("about.title")}</ItemLink>
      </IonContent>
    </IonPage>
  );
});

export default Settings;
