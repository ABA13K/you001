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

export interface LatestProductsResponse {
    message: string
    data: Product[]
}