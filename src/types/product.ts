export interface ProductData {
    id: number;
    title: string;
    thumbnail: string | null;
    price: number;
    description: string;
    categoryId: number;
}

export type CreateProductData = Omit<ProductData, "id">;

export type ProductFormData = {
    productTitle: string;
    productThumbnail: FileList | string;
    productPrice: number;
    productDescription: string;
    productCategoryId: number;
};
