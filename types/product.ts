import { ReactNode } from "react";

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

export interface ProductProperty {
    key: ReactNode;
    id: number;
    name: string;
    value: string;
    icon?: string; // Optional icon class or URL
}

export interface ProductVariant {
    id: number;
    name: string;
    price: string;
    image: string;
    stock: number;
    properties: Record<string, string>; // e.g., { color: 'red', size: 'M' }
}

export interface ProductDetails extends Product {
    category: string;
    category_slug: string;
    sub_category: string;
    sub_category_slug: string;
    brand?: string;
    sku: string;
    stock: number;
    properties: ProductProperty[];
    variants: ProductVariant[];
    images: string[];
    specifications: Record<string, string>; // Key-value pairs for specs
    tags: string[];
    created_at: string;
    updated_at: string;
}

export interface ProductsResponse {
    message: string;
    data: Product[];
}

export interface ProductDetailsResponse {
    message: string;
    data: ProductDetails;
}