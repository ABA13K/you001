// types/category.ts
export interface Category {
    id: number
    name: string
    image: string
    products_count: number
}

export interface CategoriesResponse {
    message: string
    data: Category[]
}