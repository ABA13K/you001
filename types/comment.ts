// types/comment.ts
// types/comment.ts
export interface Comment {
    rating_id: number
    user_name: string
    comment: string
    score: string
    is_mine: boolean
    has_comment: boolean // Add this field
}

// ... rest of your types remain the same

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
    data: Comment[]
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