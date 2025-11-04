/* eslint-disable @typescript-eslint/no-empty-object-type */
// types/product.ts
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