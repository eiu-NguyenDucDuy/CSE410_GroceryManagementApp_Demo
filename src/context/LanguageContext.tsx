import { createContext } from "react";
import type enUS from "antd/locale/en_US";

export type Language = "en" | "vi";

export type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    locale: typeof enUS;
};

export const LanguageContext = createContext<LanguageContextType | null>(null);
