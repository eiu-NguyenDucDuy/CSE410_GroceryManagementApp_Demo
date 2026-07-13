import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import vi from "./locales/vi.json";
import { DEFAULT_LANGUAGE } from "../config/languages";

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: en,
        },
        vi: {
            translation: vi,
        },
    },

    lng: localStorage.getItem("language") ?? DEFAULT_LANGUAGE,

    fallbackLng: DEFAULT_LANGUAGE,

    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
