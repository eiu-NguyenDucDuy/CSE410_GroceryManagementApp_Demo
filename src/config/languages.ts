import enUS from "antd/locale/en_US";
import viVN from "antd/locale/vi_VN";
import jaJP from "antd/locale/ja_JP";
import deDE from "antd/locale/de_DE";
import zhCN from "antd/locale/zh_CN";
import ruRU from "antd/locale/ru_RU";
import frFR from "antd/locale/fr_FR";

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
    de: {
        label: "Deutsch",
        antd: deDE,
    },
    zh: {
        label: "中文",
        antd: zhCN,
    },
    ru: {
        label: "Русский",
        antd: ruRU,
    },
    fr: {
        label: "Français",
        antd: frFR,
    },
} as const;

export type Language = keyof typeof languages;

export const DEFAULT_LANGUAGE: Language = "en";
