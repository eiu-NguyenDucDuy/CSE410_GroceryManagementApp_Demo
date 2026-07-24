export interface HistoryLog {
    id: number;
    createdAt: string;
    date: string;
    time: string;
    userId: number;
    userName: string;
    contentType: HistoryContentType;
    objectName: string;
    changeAction: HistoryAction;
    details: string;
    isRead: boolean;
    isStarred: boolean;
}

export type ActiveTab = "system" | "user";

export const HistoryAction = {
    Create: "Create",
    Update: "Update",
    Delete: "Delete",
    Login: "Login",
    Logout: "Logout",
} as const;

export type HistoryAction = (typeof HistoryAction)[keyof typeof HistoryAction];

export const HistoryContentType = {
    Product: "Product",
    Category: "Category",
    User: "User",
    Account: "Account",
} as const;

export type HistoryContentType =
    (typeof HistoryContentType)[keyof typeof HistoryContentType];

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
