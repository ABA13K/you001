import { MainCategoriesResponse, SubCategoriesResponse } from '@/types/category';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aa-dev.site/you/api';

export const categoriesApi = {
    // 1) Get all main categories
    getMainCategories: async (locale: 'ar' | 'en' = 'en'): Promise<MainCategoriesResponse> => {
        const response = await fetch(`${API_BASE_URL}/public/home-page/main-categorical/${locale}`);
        if (!response.ok) throw new Error('Failed to fetch main categories');
        return response.json();
    },

    // 2) Get sub categories by main category slug
    getSubCategories: async (
        mainCategorySlug: string,
        locale: 'ar' | 'en' = 'en'
    ): Promise<SubCategoriesResponse> => {
        const response = await fetch(
            `${API_BASE_URL}/public/home-page/sub-categorical/main-categorical/${mainCategorySlug}/${locale}`
        );
        if (!response.ok) throw new Error('Failed to fetch sub categories');
        return response.json();
    },
};