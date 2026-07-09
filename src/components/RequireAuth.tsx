import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function RequireAuth({ children }: { children: ReactNode }) {
    const { state } = useAuth();

    if (!state.user) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
