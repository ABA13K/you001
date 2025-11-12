/* eslint-disable @typescript-eslint/no-empty-object-type */
// types/product.ts
export interface ProductProperty {
    key: string
    value: string
}

export interface ProductVariant {
    id: number
    value: string
    extra_price: string
    quantity: number
    images: string[]
}

export interface ProductVariants {
    color?: ProductVariant[]
    Ram?: ProductVariant[]
    // Add other variant types as needed
}

export interface DetailedProduct {
    id_product: number
    name: string
    description: string
    main_image: string
    original_price: string
    discount_percentage: number
    price_after_discount: string
    quantity: number
    total_rating: number
    sales_count: number
    is_active: number
    sub_category_name: string
    images: string[]
    properties: ProductProperty[]
    variants: ProductVariants
}

export interface SimilarProduct {
    id: number
    name: string
    original_price: string
    discount_percentage: number
    price_after_discount: string
    total_rating: number
    image: string
}

export interface ProductDetailResponse {
    message: string
    data: {
        product: DetailedProduct
        similar_products: SimilarProduct[]
    }
}

// Keep your existing types for list views
export interface Product {
    id: number
    name: string
    original_price: string
    discount_percentage: string
    price_after_discount: number
    total_rating: number
    image: string
}

export interface ProductsResponse {
    message: string
    data: Product[]
}

// Specific response types for each endpoint
export interface LatestProductsResponse extends ProductsResponse { }
export interface RandomProductsResponse extends ProductsResponse { }
export interface TopRatedProductsResponse extends ProductsResponse { }
export interface TopSellingProductsResponse extends ProductsResponse { }