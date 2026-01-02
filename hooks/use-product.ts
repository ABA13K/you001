import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api/products';

export const useProductsBySubCategory = (subCategorySlug: string, locale: 'ar' | 'en' = 'en') => {
    return useQuery({
        queryKey: ['products', 'sub-category', subCategorySlug, locale],
        queryFn: () => productsApi.getProductsBySubCategory(subCategorySlug, locale),
        enabled: !!subCategorySlug,
    });
};

export const useTopRatedProducts = (locale: 'ar' | 'en' = 'en') => {
    return useQuery({
        queryKey: ['products', 'top-rated', locale],
        queryFn: () => productsApi.getTopRatedProducts(locale),
    });
};

export const useLatestProducts = (locale: 'ar' | 'en' = 'en') => {
    return useQuery({
        queryKey: ['products', 'latest', locale],
        queryFn: () => productsApi.getLatestProducts(locale),
    });
};

export const useRandomProducts = (locale: 'ar' | 'en' = 'en') => {
    return useQuery({
        queryKey: ['products', 'random', locale],
        queryFn: () => productsApi.getRandomProducts(locale),
    });
};

export const useTopSellingProducts = (locale: 'ar' | 'en' = 'en') => {
    return useQuery({
        queryKey: ['products', 'top-selling', locale],
        queryFn: () => productsApi.getTopSellingProducts(locale),
    });
};