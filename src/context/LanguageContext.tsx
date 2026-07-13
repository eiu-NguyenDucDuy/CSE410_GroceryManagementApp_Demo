import { createContext } from "react";
import { languages, type Language } from "../config/languages";

export type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    locale: (typeof languages)[Language]["antd"];
};

export const LanguageContext = createContext<LanguageContextType | null>(null);
