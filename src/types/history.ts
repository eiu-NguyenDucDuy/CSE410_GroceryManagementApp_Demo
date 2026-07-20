export type HistoryTab = "system" | "user";

export interface HistoryLog {
    id: number;
    createdAt: string;
    date: string;
    time: string;
    userId: number;
    userName: string;
    contentType: string;
    objectName: string;
    changeAction: string;
    details: string;
    isRead: boolean;
    isStarred: boolean;
    tab: HistoryTab;
}

export type HistoryLogInput = Omit<
    HistoryLog,
    "id" | "createdAt" | "date" | "time" | "isRead" | "isStarred"
> & {
    isRead?: boolean;
    isStarred?: boolean;
};

export type HistorySearchField =
    | "all"
    | "contentType"
    | "objectName"
    | "changeAction"
    | "userName"
    | "date";
