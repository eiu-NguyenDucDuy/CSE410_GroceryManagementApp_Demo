import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import ThemeProvider from "./providers/ThemeProvider";
import LanguageProvider from "./providers/LanguageProvider";
import ThemedApp from "./components/ThemedApp";
import "antd/dist/reset.css";
import "./index.css";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <LanguageProvider>
                <ThemedApp />
            </LanguageProvider>
        </ThemeProvider>
    </StrictMode>,
);
