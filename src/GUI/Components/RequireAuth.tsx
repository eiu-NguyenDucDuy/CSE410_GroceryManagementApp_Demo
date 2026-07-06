import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth";

export default function RequireAdmin({ children }: { children: ReactNode }) {
    const { state } = useAuth();
    console.log("RequireAuth check:", state.user);

    if (!state.user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
