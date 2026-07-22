import { useAuth } from "./useAuth";
import { createHistoryLog } from "../services/historyService";
import type { HistoryAction, HistoryContentType } from "../types/history";

interface LogHistoryOptions {
    contentType: HistoryContentType;
    objectName: string;
    changeAction: HistoryAction;
    details?: string;
}

export function useHistoryLogger() {
    const { state } = useAuth();

    async function logHistory({
        contentType,
        objectName,
        changeAction,
        details = "",
    }: LogHistoryOptions) {
        const user = state.user;

        if (!user) return;

        const defaultDetails = `${changeAction} ${contentType}: ${objectName}`;

        await createHistoryLog({
            userId: user.id,
            userName: user.username,
            contentType,
            objectName,
            changeAction,
            details: details || defaultDetails,
        });
    }

    return { logHistory };
}
