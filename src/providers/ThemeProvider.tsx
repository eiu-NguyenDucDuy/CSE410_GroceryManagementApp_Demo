import { useState, type ReactNode } from "react";
import { theme, type ThemeConfig } from "antd";
import ThemeContext from "../context/ThemeContext";

export default function ThemeProvider({ children }: { children: ReactNode }) {
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark",
    );

    const toggleTheme = () => {
        setDarkMode((prev) => {
            const next = !prev;

            localStorage.setItem("theme", next ? "dark" : "light");

            return next;
        });
    };

    const antdTheme: ThemeConfig = {
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    };

    return (
        <ThemeContext.Provider
            value={{
                darkMode,
                toggleTheme,
                antdTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}
