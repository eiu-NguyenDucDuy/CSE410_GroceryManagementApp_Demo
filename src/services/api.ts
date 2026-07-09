export const API_URL = "http://localhost:3001";

export async function api<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...(options?.headers ?? {}),
        },
        ...options,
    });

    if (!response.ok) {
        let message = `HTTP ${response.status}`;

        try {
            const error = await response.json();
            message = error.message ?? message;
        } catch {
            // Ignore if response isn't JSON
        }

        throw new Error(message);
    }

    return response.json() as Promise<T>;
}
