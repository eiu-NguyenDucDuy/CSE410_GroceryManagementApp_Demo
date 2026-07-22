import { api, API_URL } from "./api";
import type { HistoryLog, HistoryLogInput } from "../types/history";

export async function getAllHistoryLogs(): Promise<HistoryLog[]> {
    return api<HistoryLog[]>(`${API_URL}/historyLogs`);
}

export async function createHistoryLog(
    log: HistoryLogInput,
): Promise<HistoryLog> {
    const now = new Date();

    const history = {
        ...log,
        createdAt: now.toISOString(),
        date: now.toISOString().split("T")[0],
        time: now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }),
        isRead: log.isRead ?? false,
        isStarred: log.isStarred ?? false,
    };

    return api<HistoryLog>(`${API_URL}/historyLogs`, {
        method: "POST",
        body: JSON.stringify(history),
    });
}

export async function updateHistoryLog(log: HistoryLog): Promise<HistoryLog> {
    return api<HistoryLog>(`${API_URL}/historyLogs/${log.id}`, {
        method: "PUT",
        body: JSON.stringify(log),
    });
}

export async function deleteHistoryLog(id: number): Promise<void> {
    return api<void>(`${API_URL}/historyLogs/${id}`, {
        method: "DELETE",
    });
}

export async function markHistoryLogsAsRead(ids: number[]): Promise<void> {
    await Promise.all(
        ids.map((id) =>
            api<HistoryLog>(`${API_URL}/historyLogs/${id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    isRead: true,
                }),
            }),
        ),
    );
}

export async function toggleHistoryStarState(id: number) {
    const log = await api<HistoryLog>(`${API_URL}/historyLogs/${id}`);

    return api<HistoryLog>(`${API_URL}/historyLogs/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
            isStarred: !log.isStarred,
        }),
    });
}

export async function toggleHistoryReadState(id: number) {
    const log = await api<HistoryLog>(`${API_URL}/historyLogs/${id}`);

    return api<HistoryLog>(`${API_URL}/historyLogs/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
            isRead: !log.isRead,
        }),
    });
}

const NOTIFICATION_KEY = "notificationsEnabled";

export function areNotificationsEnabled(): boolean {
    const value = localStorage.getItem(NOTIFICATION_KEY);

    return value !== "false";
}

export function setNotificationsEnabled(enabled: boolean): void {
    localStorage.setItem(NOTIFICATION_KEY, String(enabled));
}
