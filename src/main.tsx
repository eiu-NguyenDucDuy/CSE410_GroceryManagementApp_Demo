import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import ThemeProvider from "./context/ThemeProvider";
import ThemedApp from "./components/ThemedApp";
import "antd/dist/reset.css";
import "./index.css";


ReactDOM.createRoot(
    document.getElementById("root")!,
).render(
    <StrictMode>
        <ThemeProvider>
            <ThemedApp />
        </ThemeProvider>
    </StrictMode>,
);