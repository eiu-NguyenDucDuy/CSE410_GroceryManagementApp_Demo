import type { CategoryData, CreateCategoryData } from "../types/category";
import { api, API_URL } from "./api";

export async function getAllCategories(): Promise<CategoryData[]> {
    return api<CategoryData[]>(`${API_URL}/categories`);
}

export async function getCategoryById(id: number): Promise<CategoryData> {
    return api<CategoryData>(`${API_URL}/categories/${id}`);
}

export async function createCategory(
    category: CreateCategoryData,
): Promise<CategoryData> {
    return api<CategoryData>(`${API_URL}/categories`, {
        method: "POST",
        body: JSON.stringify(category),
    });
}

export async function updateCategory(
    category: CategoryData,
): Promise<CategoryData> {
    return api<CategoryData>(`${API_URL}/categories/${category.id}`, {
        method: "PUT",
        body: JSON.stringify(category),
    });
}

export async function deleteCategory(id: number): Promise<void> {
    return api<void>(`${API_URL}/categories/${id}`, {
        method: "DELETE",
    });
}
