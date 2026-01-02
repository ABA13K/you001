import { ProductsResponse } from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aa-dev.site/you/api';

export const productsApi = {
    // 3) Get products by sub-category slug
    getProductsBySubCategory: async (
        subCategorySlug: string,
        locale: 'ar' | 'en' = 'en'
    ): Promise<ProductsResponse> => {
        const response = await fetch(
            `${API_BASE_URL}/public/products/sub-categories/${subCategorySlug}/${locale}`
        );
        if (!response.ok) throw new Error('Failed to fetch products by sub category');
        return response.json();
    },

    // 4) Get top 10 rated products
    getTopRatedProducts: async (locale: 'ar' | 'en' = 'en'): Promise<ProductsResponse> => {
        const response = await fetch(
            `${API_BASE_URL}/public/home-page/products/top-rated/${locale}`
        );
        if (!response.ok) throw new Error('Failed to fetch top rated products');
        return response.json();
    },

    // 5) Get latest products
    getLatestProducts: async (locale: 'ar' | 'en' = 'en'): Promise<ProductsResponse> => {
        const response = await fetch(
            `${API_BASE_URL}/public/home-page/products/latest/${locale}`
        );
        if (!response.ok) throw new Error('Failed to fetch latest products');
        return response.json();
    },

    // 6) Get random products
    getRandomProducts: async (locale: 'ar' | 'en' = 'en'): Promise<ProductsResponse> => {
        const response = await fetch(
            `${API_BASE_URL}/public/home-page/products/random/${locale}`
        );
        if (!response.ok) throw new Error('Failed to fetch random products');
        return response.json();
    },

    // 7) Get top selling products
    getTopSellingProducts: async (locale: 'ar' | 'en' = 'en'): Promise<ProductsResponse> => {
        const response = await fetch(
            `${API_BASE_URL}/public/home-page/products/top-selling/${locale}`
        );
        if (!response.ok) throw new Error('Failed to fetch top selling products');
        return response.json();
    },
};