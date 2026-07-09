import { createContext } from "react";

export type User = {
    id: number;
    username: string;
    email: string;
    password: string;
    role: "admin" | "user";
};

export type AuthState = {
    user: User | null;
};

export type AuthAction = { type: "LOGIN"; payload: User } | { type: "LOGOUT" };

export const AuthContext = createContext<{
    state: AuthState;
    dispatch: React.Dispatch<AuthAction>;
} | null>(null);
