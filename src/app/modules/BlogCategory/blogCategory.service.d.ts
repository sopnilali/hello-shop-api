export const BlogCategoryService: {
    createBlogCategory: (req: any) => Promise<any>;
    getAllBlogCategories: () => Promise<any>;
    getSingleBlogCategory: (id: string) => Promise<any>;
    updateBlogCategory: (id: string, req: any) => Promise<any>;
    deleteBlogCategory: (id: string) => Promise<any>;
} 