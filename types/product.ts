import { Key, ReactNode } from "react";

// Basic Product Interface
export interface Product {
    id: number;
    name: string;
    description: string;
    original_price: string;
    discount_percentage: number;
    price_after_discount: string;
    total_rating: number;
    is_favorite: boolean;
    image: string;
}

// Product Property (from API response)
export interface ProductProperty {
    name: ReactNode;
    id: Key | null | undefined;
    key: string;
    value: string;
    type: 'text' | 'color' | 'number' | 'boolean';
}

// Product Variant Option (from variants array in API)
export interface ProductVariantOption {
    id: number;
    value: string;
    extra_price: string;
    quantity: number;
    images: string[];
}

// Variants grouped by type (Color, Upholstery, Package)
export interface ProductVariantsGroup {
    [variantType: string]: ProductVariantOption[];
}

// Comment/Review Interface
export interface Comment {
    rating_id: number;
    user_name: string;
    comment: string;
    score: string;
    is_mine: boolean;
}

export interface CommentsResponse {
    is_rated: boolean;
    comments: Comment[];
    next_offset: number;
    has_more: boolean;
}

// Main Product Details Interface
export interface ProductDetails {
    product: {
        id_product: number;
        name: string;
        description: string;
        main_image: string;
        original_price: string;
        discount_percentage: number;
        price_after_discount: string;
        quantity: number;
        total_rating: number;
        sales_count: number;
        is_active: number;
        is_favorite: boolean;
        language: string;
        sub_category_name: string;
        has_comments: boolean;
        images: string[];
        properties: ProductProperty[];
        variants: ProductVariantsGroup;
        sub_category: {
            id: number;
            name: string;
            slug: string;
        };
    };
    similar_products: Product[];
    language: string;
}

// API Response Interfaces
export interface ProductDetailsResponse {
    message: string;
    data: ProductDetails;
}

export interface CommentsDataResponse {
    message: string;
    data: CommentsResponse;
}

export interface ProductsResponse {
    message: string;
    data: Product[];
}

// For backward compatibility - remove or update existing ProductVariant type
export interface ProductVariant {
    id: number;
    name: string;
    price: string;
    image: string;
    stock: number;
    properties: Record<string, string>;
}

// For backward compatibility - remove or update existing ProductVariants type
export interface ProductVariants {
    type: string;
    options: ProductVariantOption[];
}