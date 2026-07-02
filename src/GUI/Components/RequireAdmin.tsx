import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth";

export default function RequireAdmin({ children }: { children: ReactNode }) {
    const { state } = useAuth();
    console.log("RequireAdmin:", state.user);

    if (!state.user) {
        return <Navigate to="/admin/login" replace />;
    }

    if (state.user.role !== "admin") {
        return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
}
