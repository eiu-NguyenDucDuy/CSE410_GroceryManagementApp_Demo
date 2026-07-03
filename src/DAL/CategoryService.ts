import axios from "axios";
import { type CategoryData } from "../models/CategoryData";
import { API_URL } from "./api";

export async function getAllCategories(): Promise<CategoryData[]> {
    const { data } = await axios.get<CategoryData[]>(`${API_URL}/categories`);
    return data;
}

export async function getCategoryById(
    id: number,
): Promise<CategoryData | undefined> {
    const { data } = await axios.get<CategoryData>(
        `${API_URL}/categories/${id}`,
    );
    return data;
}

export async function createCategory(category: CategoryData) {
    const { data } = await axios.post<CategoryData>(
        `${API_URL}/categories`,
        category,
    );
    return data;
}

export async function updateCategory(category: CategoryData) {
    const { data } = await axios.put<CategoryData>(
        `${API_URL}/categories/${category.id}`,
        category,
    );
    return data;
}

export async function deleteCategory(id: number): Promise<void> {
    await axios.delete(`${API_URL}/categories/${id}`);
}
