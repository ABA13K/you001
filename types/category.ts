export interface Category {
    slug: string;
    id: number;
    name: string;
    image: string | null;
    products_count: number;
    sub_categories_count: number;
}

export interface SubCategory {
    slug: string;
    id: number;
    name: string;
    image: string | null;
    discount: number | null;
    products_count: number;
}

export interface MainCategoriesResponse {
    message: string;
    data: Category[];
}

export interface SubCategoriesResponse {
    message: string;
    data: SubCategory[];
}