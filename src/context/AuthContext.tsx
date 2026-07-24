import { createContext } from "react";
import type { UserData } from "../types/user";

export type AuthState = {
    user: UserData | null;
};

export type AuthAction =
    | { type: "LOGIN"; payload: UserData }
    | { type: "LOGOUT" };

export const AuthContext = createContext<{
    state: AuthState;
    dispatch: React.Dispatch<AuthAction>;
} | null>(null);
