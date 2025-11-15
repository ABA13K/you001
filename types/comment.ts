// types/comment.ts
export interface Comment {
    rating_id: number
    user_name: string
    comment: string
    score: string
    is_mine: boolean
    has_comment: boolean
}

// For public API: /public/products/{id}/comments
export interface PublicCommentsResponse {
    message: string
    data: {
        is_rated: boolean // Add this field
        comments: Comment[]
        next_offset?: number
        has_more?: boolean
    }
}

// For authenticated API: /products/{id}/comments  
export interface AuthenticatedCommentsResponse {
    message: string
    data: Comment[]
}

// Add this new interface for the authenticated response with is_rated
export interface AuthenticatedCommentsWithRatingStatusResponse {
    message: string
    data: {
        is_rated: boolean
        comments: Comment[]
        next_offset?: number
        has_more?: boolean
    }
}

export interface AddCommentData {
    score: number
    comment?: string
}

export interface UpdateCommentData {
    score: number
    comment?: string
}

export interface AddCommentResponse {
    message: string
}

export interface UpdateCommentResponse {
    message: string
}

export interface DeleteCommentResponse {
    message: string
}