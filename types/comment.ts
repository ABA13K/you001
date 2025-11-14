// types/comment.ts
export interface Comment {
    rating_id: number
    user_name: string
    comment: string
    score: string
    is_mine: boolean
}

// types/comment.ts - Make sure this matches the API
export interface CommentsResponse {
    message: string
    data: {
        comments: Comment[]
        next_offset?: number
        has_more?: boolean
    }
}

export interface AuthenticatedCommentsResponse {
    message: string
    data: Comment[] // This might be different!
}

export interface AddCommentData {
    product_id: number
    comment: string
    score: number
}

export interface AddCommentResponse {
    message: string
    data: {
        rating_id: number
    }
}
export interface Comment {
    rating_id: number
    user_name: string
    comment: string
    score: string
    is_mine: boolean
}

// For public API: /public/products/{id}/comments
export interface PublicCommentsResponse {
    message: string
    data: {
        comments: Comment[]
        next_offset?: number
        has_more?: boolean
    }
}

// For authenticated API: /products/{id}/comments  
export interface AuthenticatedCommentsResponse {
    message: string
    data: Comment[] // Direct array of comments
}

export interface AddCommentData {
    product_id: number
    comment: string
    score: number
}

export interface AddCommentResponse {
    message: string
    data: {
        rating_id: number
    }
}