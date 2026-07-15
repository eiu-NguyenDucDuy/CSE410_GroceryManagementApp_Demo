import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import vi from "./locales/vi.json";
import ja from "./locales/ja.json";
import de from "./locales/de.json";
import zh from "./locales/zh.json";
import ru from "./locales/ru.json";
import fr from "./locales/fr.json";
import { DEFAULT_LANGUAGE } from "../config/languages";

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: en,
        },
        vi: {
            translation: vi,
        },
        ja: {
            translation: ja,
        },
        de: {
            translation: de,
        },
        zh: {
            translation: zh,
        },
        ru: {
            translation: ru,
        },
        fr: {
            translation: fr,
        },
    },

    lng: localStorage.getItem("language") ?? DEFAULT_LANGUAGE,

    fallbackLng: DEFAULT_LANGUAGE,

    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
