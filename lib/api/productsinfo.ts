import { ProductDetailsResponse, CommentsDataResponse } from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aa-dev.site/you/api';

export const productInfoApi = {
    // Get single product details by ID
    getProductById: async (id: number, locale: 'ar' | 'en' = 'en'): Promise<ProductDetailsResponse> => {
        const response = await fetch(
            `${API_BASE_URL}/public/products/${id}/${locale}`,
            {
                next: { revalidate: 60 } // Cache for 1 minute
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }

        return response.json();
    },

    // Get product comments with pagination
    getProductComments: async (
        productId: number,
        limit: number = 10,
        offset: number = 0
    ): Promise<CommentsDataResponse> => {
        const response = await fetch(
            `${API_BASE_URL}/public/products/${productId}/comments?limit=${limit}&offset=${offset}`,
            {
                next: { revalidate: 30 } // Cache for 30 seconds
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch product comments');
        }

        return response.json();
    },

    // Add a comment to product
    addProductComment: async (
        productId: number,
        commentData: {
            rating: number;
            comment: string;
            user_id: number;
        }
    ): Promise<{ message: string }> => {
        const response = await fetch(
            `${API_BASE_URL}/products/${productId}/comments`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentData),
            }
        );

        if (!response.ok) {
            throw new Error('Failed to add comment');
        }

        return response.json();
    },
};