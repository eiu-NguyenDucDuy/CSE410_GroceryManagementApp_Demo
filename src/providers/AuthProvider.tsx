import { useReducer, type ReactNode } from "react";
import { AuthContext, type AuthAction, type AuthState } from "../context/AuthContext";

const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem("user") || "null"),
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case "LOGIN":
            localStorage.setItem("user", JSON.stringify(action.payload));
            return {
                user: action.payload,
            };

        case "LOGOUT":
            localStorage.removeItem("user");
            return { user: null };

        default:
            return state;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}
