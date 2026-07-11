export interface ProductData {
    id: number;
    title: string;
    thumbnail: string | null;
    price: number;
    description: string;
    categoryType: string;
}

export type CreateProductData = Omit<ProductData, "id">;

export type ProductFormData = {
    productTitle: string;
    productThumbnail: FileList | string;
    productPrice: number;
    productDescription: string;
    productCategoryType: string;
};
