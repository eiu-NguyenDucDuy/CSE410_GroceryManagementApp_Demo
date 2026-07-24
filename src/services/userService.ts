import type { UserData } from "../types/user";
import { api, API_URL } from "./api";

// Using backend API
// export async function login(email: string, password: string) {
//     return api<UserData>(`${API_URL}/login`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//     });
// }

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

// Using json-server
export async function login(
    email: string,
    password: string,
): Promise<UserData | null> {
    const users = await getAllUsers();
    const normalizedEmail = normalizeEmail(email);

    return (
        users.find(
            (user) =>
                normalizeEmail(user.email) === normalizedEmail &&
                user.password === password,
        ) ?? null
    );
}

export async function getAllUsers(): Promise<UserData[]> {
    return api<UserData[]>(`${API_URL}/users`);
}

export async function createUser(
    user: Omit<UserData, "id">,
): Promise<UserData> {
    const existingUsers = await getAllUsers();
    const normalizedEmail = normalizeEmail(user.email);
    const emailExists = existingUsers.some(
        (existingUser) =>
            normalizeEmail(existingUser.email) === normalizedEmail,
    );

    if (emailExists) {
        throw new Error("Email already exists.");
    }

    return api<UserData>(`${API_URL}/users`, {
        method: "POST",
        body: JSON.stringify(user),
    });
}

export async function updateUser(user: UserData): Promise<UserData> {
    const existingUsers = await getAllUsers();
    const normalizedEmail = normalizeEmail(user.email);
    const emailExists = existingUsers.some(
        (existingUser) =>
            existingUser.id !== user.id &&
            normalizeEmail(existingUser.email) === normalizedEmail,
    );

    if (emailExists) {
        throw new Error("Email already exists.");
    }

    return api<UserData>(`${API_URL}/users/${user.id}`, {
        method: "PUT",
        body: JSON.stringify(user),
    });
}

export async function deleteUser(id: number): Promise<void> {
    await api<void>(`${API_URL}/users/${id}`, {
        method: "DELETE",
    });
}
