import { Storage } from "@/utils/storage";
import i18next from "i18next";
import { useEffect } from "react";
import { initReactI18next, useTranslation } from "react-i18next";

import sk from "./resources/sk";

export const locales = {
  sk: "Slovenčina",
};

export const defaultLocale = "sk";

const resources = {
  sk: { translation: sk },
};

export const initTranslation = () => {
  i18next.use(initReactI18next).init({
    resources,

    defaultNS: "translation",
    ns: ["translation"],

    lng: defaultLocale,
    fallbackLng: defaultLocale,

    interpolation: {
      escapeValue: false,
    },
  });
};

export const useLoadTranslation = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    Storage.subscribe(
      (s) => s.preferences.locale,
      (locale) => {
        i18n.changeLanguage(locale || defaultLocale);
      }
    );
  }, []);
};
