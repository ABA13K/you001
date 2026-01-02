export interface Product {
    id: number;
    name: string;
    description: string;
    original_price: string; // API returns string
    discount_percentage: number; // API returns number
    price_after_discount: string; // API returns string
    total_rating: number;
    is_favorite: boolean;
    image: string;
}

export interface ProductsResponse {
    message: string;
    data: Product[];
}