export interface CategoryData {
    id: number;
    categoryName: string;
    description: string;
}

export type CreateCategoryData = Omit<CategoryData, "id">;

export type CategoryFormData = {
    categoryName: string;
    categoryDescription: string;
};
