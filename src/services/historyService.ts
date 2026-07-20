import { api, API_URL } from "./api";
import type { HistoryLog, HistoryLogInput } from "../types/history";

export async function getAllHistoryLogs(): Promise<HistoryLog[]> {
    return api<HistoryLog[]>(`${API_URL}/historyLogs`);
}

export async function createHistoryLog(
    log: HistoryLogInput,
): Promise<HistoryLog> {
    return api<HistoryLog>(`${API_URL}/historyLogs`, {
        method: "POST",
        body: JSON.stringify(log),
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
    return api<void>(`${API_URL}/historyLogs/markAsRead`, {
        method: "PUT",
        body: JSON.stringify({ ids }),
    });
}

export async function toggleHistoryReadState(id: number): Promise<void> {
    return api<void>(`${API_URL}/historyLogs/toggleReadState/${id}`);
}

export async function toggleHistoryStarState(id: number): Promise<void> {
    return api<void>(`${API_URL}/historyLogs/toggleStarState/${id}`);
}

const NOTIFICATION_KEY = "notificationsEnabled";

export function areNotificationsEnabled(): boolean {
    const value = localStorage.getItem(NOTIFICATION_KEY);

    return value !== "false";
}

export function setNotificationsEnabled(enabled: boolean): void {
    localStorage.setItem(NOTIFICATION_KEY, String(enabled));
}
