import { useTranslation } from "react-i18next";
import { LanguageContext } from "../context/LanguageContext";
import { languages, DEFAULT_LANGUAGE, type Language } from "../config/languages";

export default function LanguageProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { i18n } = useTranslation();

    const current = i18n.resolvedLanguage ?? DEFAULT_LANGUAGE;

    const language: Language =
        current in languages ? (current as Language) : DEFAULT_LANGUAGE;

    const changeLanguage = (lang: Language) => {
        localStorage.setItem("language", lang);
        i18n.changeLanguage(lang);
    };

    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage: changeLanguage,
                locale: languages[language].antd,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}
