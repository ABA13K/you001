// types/comment.ts
export interface Comment {
    rating_id: number
    user_name: string
    comment: string
    score: string
    is_mine: boolean
}

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
    data: Comment[]
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