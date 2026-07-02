import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/auth/AuthProvider";
import Routes from "./Routes.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AuthProvider>
            <Routes />
        </AuthProvider>
    </StrictMode>,
);
