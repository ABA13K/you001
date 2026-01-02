import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/lib/api/categories';

export const useCategories = (locale: 'ar' | 'en' = 'en') => {
    return useQuery({
        queryKey: ['main-categories', locale],
        queryFn: () => categoriesApi.getMainCategories(locale),
    });
};

export const useSubCategories = (mainCategorySlug: string, locale: 'ar' | 'en' = 'en') => {
    return useQuery({
        queryKey: ['sub-categories', mainCategorySlug, locale],
        queryFn: () => categoriesApi.getSubCategories(mainCategorySlug, locale),
        enabled: !!mainCategorySlug,
    });
};