// types/favorite.ts
export interface FavoriteProduct {
    id: string
    name: string
    original_price: string
    discount_percentage: number
    price_after_discount: string
    total_rating: number
    image: string
}

export interface FavoriteItem {
    favorite_id: string
    product: FavoriteProduct
}

export interface FavoritesResponse {
    message: string
    data: FavoriteItem[]
}