import { ProductDetailsResponse, ProductsResponse } from '@/types/product';

const API_BASE_URL = 'https://aa-dev.site/you/api';

export const productInfoApi = {
    // Get single product details by ID
    getProductById: async (id: number, locale: 'ar' | 'en' = 'en'): Promise<ProductDetailsResponse> => {
        // Note: You need to create this endpoint in your backend
        // For now, we'll use a workaround
        const response = await fetch(
            `${API_BASE_URL}/public/products/${id}/${locale}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }

        return response.json();
    },

    // Get product reviews/comments
    getProductReviews: async (productId: number, locale: 'ar' | 'en' = 'en') => {
        const response = await fetch(
            `${API_BASE_URL}/public/products/${productId}/reviews/${locale}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch product reviews');
        }

        return response.json();
    },

    // Get related products
    getRelatedProducts: async (productId: number, locale: 'ar' | 'en' = 'en'): Promise<ProductsResponse> => {
        const response = await fetch(
            `${API_BASE_URL}/public/products/${productId}/related/${locale}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch related products');
        }

        return response.json();
    },

    // Add product review
    addProductReview: async (
        productId: number,
        reviewData: {
            rating: number;
            comment: string;
            user_id: number;
        },
        locale: 'ar' | 'en' = 'en'
    ) => {
        const response = await fetch(
            `${API_BASE_URL}/public/products/${productId}/reviews/${locale}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData),
            }
        );

        if (!response.ok) {
            throw new Error('Failed to add review');
        }

        return response.json();
    },
};