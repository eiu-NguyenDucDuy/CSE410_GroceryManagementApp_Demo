import { useState } from "react";
import enUS from "antd/locale/en_US";
import viVN from "antd/locale/vi_VN";
import { LanguageContext, type Language } from "../context/LanguageContext";

const locales = {
    en: enUS,
    vi: viVN,
};

export default function LanguageProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [language, setLanguage] = useState<Language>(() => {
        const saved = localStorage.getItem("language");

        return saved === "vi" ? "vi" : "en";
    });

    const changeLanguage = (lang: Language) => {
        localStorage.setItem("language", lang);
        setLanguage(lang);
    };

    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage: changeLanguage,
                locale: locales[language],
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}
