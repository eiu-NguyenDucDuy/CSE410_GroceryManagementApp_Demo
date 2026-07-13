import enUS from "antd/locale/en_US";
import viVN from "antd/locale/vi_VN";
import jaJP from "antd/locale/ja_JP";

export const languages = {
    en: {
        label: "English",
        antd: enUS,
    },
    vi: {
        label: "Tiếng Việt",
        antd: viVN,
    },
    ja: {
        label: "日本語",
        antd: jaJP,
    },
} as const;

export type Language = keyof typeof languages;

export const DEFAULT_LANGUAGE: Language = "en";
