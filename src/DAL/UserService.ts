import { API_URL } from "./api";
import type { User } from "../context/auth/AuthContext";

export async function login(
    username: string,
    password: string,
): Promise<User | null> {
    const response = await fetch(
        `${API_URL}/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
    );

    if (!response.ok) {
        throw new Error("Unable to connect to server.");
    }

    const users: User[] = await response.json();

    return users.length > 0 ? users[0] : null;
}
