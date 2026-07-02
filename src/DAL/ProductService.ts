import type {
    ProductData,
    ProductDataForHomePage,
} from "../models/ProductData";

const API_URL = "http://localhost:3001/products";

export async function getAllProducts(): Promise<ProductData[]> {
    const response = await fetch(`${API_URL}`);
    return response.json();
}

export async function getProductsByCategory(
    categoryId: number,
): Promise<ProductDataForHomePage[]> {
    const response = await fetch(`${API_URL}?categoryId=${categoryId}`);
    const data: ProductData[] = await response.json();

    return data.map((p) => ({
        id: p.id,
        title: p.title,
        thumbnail: p.thumbnail,
        price: p.price,
    }));
}
