import type { User } from "../context/AuthContext";
import { api, API_URL } from "./api";

// Using backend API
// export async function login(email: string, password: string) {
//     return api<User>(`${API_URL}/login`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//     });
// }


// Using json-server
export async function login(
    email: string,
    password: string,
): Promise<User | null> {
    const users = await api<User[]>(
        `${API_URL}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    );

    return users[0] ?? null;
}
