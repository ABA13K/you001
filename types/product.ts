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

export interface ProductDetails extends Product {
    category: string;
    category_slug: string;
    sub_category: string;
    sub_category_slug: string;
    brand?: string;
    sku: string;
    stock: number;
    properties: Array<{
        id: number;
        name: string;
        value: string;
        icon?: string;
    }>;
    variants: Array<{
        id: number;
        name: string;
        price: string;
        image: string;
        stock: number;
        properties: Record<string, string>;
    }>;
    images: string[];
    specifications: Record<string, string>;
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

export interface Review {
    id: number;
    user_id: number;
    user_name: string;
    user_avatar?: string;
    rating: number;
    comment: string;
    created_at: string;
    helpful_count: number;
}

export interface ReviewsResponse {
    message: string;
    data: Review[];
    average_rating: number;
    total_reviews: number;
}
export interface ProductProperty {
    id: number;
    name: string;  // Changed from 'key' to 'name'
    value: string;
    icon?: string;
    description?: string;
    unit?: string;
}

// Or if you want to support both 'key' and 'name'
export interface ProductProperty {
    id: number;
    name: string;      // Display name
    key?: string;      // Optional key for programmatic access
    value: string;
    icon?: string;
}
export interface ProductVariant {
    id: number;
    name: string;
    price: string;
    image: string;
    stock: number;
    sku?: string;
    barcode?: string;
    properties: Record<string, string>;
    is_default?: boolean;
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
        unit: string;
    };
}