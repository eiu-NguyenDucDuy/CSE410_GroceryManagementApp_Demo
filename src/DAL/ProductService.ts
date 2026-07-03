import axios from "axios";
import type { ProductData } from "../models/ProductData";
import { API_URL } from "./api";

export async function getAllProducts(): Promise<ProductData[]> {
    const { data } = await axios.get<ProductData[]>(`${API_URL}/products`);
    return data;
}

export async function getProductsByCategory(
    categoryId: number,
): Promise<ProductData[]> {
    const { data } = await axios.get<ProductData[]>(
        `${API_URL}/products/?categoryId=${categoryId}`,
    );

    return data.map((p) => ({
        id: p.id,
        title: p.title,
        thumbnail: p.thumbnail,
        price: p.price,
        description: p.description,
        categoryId: p.categoryId,
    }));
}

export async function createProduct(
    product: ProductData,
): Promise<ProductData> {
    const { data } = await axios.post<ProductData>(
        `${API_URL}/products`,
        product,
    );
    return data;
}

export async function updateProduct(
    product: ProductData,
): Promise<ProductData> {
    const { data } = await axios.put<ProductData>(
        `${API_URL}/products/${product.id}`,
        product,
    );
    return data;
}

export async function deleteProduct(id: number): Promise<void> {
    await axios.delete(`${API_URL}/products/${id}`);
}
