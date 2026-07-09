import type { ProductData, CreateProductData } from "../types/product";
import { api, API_URL } from "./api";

export async function getAllProducts(): Promise<ProductData[]> {
    return api<ProductData[]>(`${API_URL}/products`);
}

export async function getProductById(id: number): Promise<ProductData> {
    return api<ProductData>(`${API_URL}/products/${id}`);
}

export async function createProduct(
    product: CreateProductData,
): Promise<ProductData> {
    return api<ProductData>(`${API_URL}/products`, {
        method: "POST",
        body: JSON.stringify(product),
    });
}

export async function updateProduct(
    product: ProductData,
): Promise<ProductData> {
    return api<ProductData>(`${API_URL}/products/${product.id}`, {
        method: "PUT",
        body: JSON.stringify(product),
    });
}

export async function deleteProduct(id: number): Promise<void> {
    return api<void>(`${API_URL}/products/${id}`, {
        method: "DELETE",
    });
}
