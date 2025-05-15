export type IOptions = {
    page?: number;
    limit?: number;
    sortBy?: string | undefined;
    sortOrder?: string | undefined;
    searchTerm?: string;
    minPrice?: number;
    maxPrice?: number;
    categoryId?: string;
    brandId?: string;
}