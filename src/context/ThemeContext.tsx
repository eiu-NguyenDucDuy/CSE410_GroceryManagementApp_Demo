import { createContext } from "react";
import type { ThemeConfig } from "antd";

export type ThemeContextType = {
    darkMode: boolean;
    toggleTheme: () => void;
    antdTheme: ThemeConfig;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export default ThemeContext;
