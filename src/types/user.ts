export interface UserData {
    id: number;
    username: string;
    email: string;
    password: string;
    role: "admin" | "user";
    avatar?: string;
}

export type CreateUserData = Omit<UserData, "id">;

export type UserFormData = {
    username: string;
    email: string;
    password: string;
    role: "admin" | "user";
    avatar?: string;
};
