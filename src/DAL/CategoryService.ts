import { type CategoryData } from "../models/CategoryData";

const API_URL = "http://localhost:3001/categories";

export async function getAllCategories(): Promise<CategoryData[]> {
    const response = await fetch(API_URL);
    return response.json();
}

export async function getCategoryById(
    id: number,
): Promise<CategoryData | undefined> {
    const response = await fetch(`${API_URL}/${id}`);
    return response.json();
}
