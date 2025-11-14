// lib/api/comments.ts
import {
    PublicCommentsResponse,
    AuthenticatedCommentsResponse,
    AddCommentData,
    UpdateCommentData,
    AddCommentResponse,
    UpdateCommentResponse,
    DeleteCommentResponse
} from '@/types/comment'

const API_BASE_URL = 'https://aa-dev.site/you/api'

async function commentsFetch(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token')

    if (!token) {
        throw new Error('No authentication token found')
    }

    try {
        const url = `${API_BASE_URL}${endpoint}`
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers,
            },
            ...options,
        })

        const data = await response.json()
        console.log(`🔑 Comments API Response from ${endpoint}:`, data)

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`)
        }

        return data
    } catch (error) {
        console.error(`Comments API error at ${endpoint}:`, error)
        throw error
    }
}

// Public API - No authentication required
export async function getProductCommentsPublic(
    productId: string,
    limit?: number,
    offset?: number
): Promise<PublicCommentsResponse> {
    try {
        let url = `${API_BASE_URL}/public/products/${productId}/comments`

        const params = new URLSearchParams()
        if (limit) params.append('limit', limit.toString())
        if (offset) params.append('offset', offset.toString())

        const queryString = params.toString()
        if (queryString) {
            url += `?${queryString}`
        }

        console.log(`📤 Fetching public comments from: ${url}`)

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })

        const data = await response.json()
        console.log(`📥 Public comments API response:`, data)

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`)
        }

        return data
    } catch (error) {
        console.error(`Public comments API error:`, error)
        throw error
    }
}

// Get product comments (authenticated)
export async function getProductComments(
    productId: string,
    limit?: number,
    offset?: number
): Promise<AuthenticatedCommentsResponse> {
    let url = `${API_BASE_URL}/products/${productId}/comments`

    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    if (offset) params.append('offset', offset.toString())

    const queryString = params.toString()
    if (queryString) {
        url += `?${queryString}`
    }

    return commentsFetch(url, {
        method: 'GET',
    })
}

// Add new rating/comment
export async function addProductComment(
    productId: string,
    commentData: AddCommentData
): Promise<AddCommentResponse> {
    return commentsFetch(`/ratings/add/product/${productId}`, {
        method: 'POST',
        body: JSON.stringify(commentData),
    })
}

// Update rating/comment
export async function updateProductComment(
    ratingId: number,
    commentData: UpdateCommentData
): Promise<UpdateCommentResponse> {
    return commentsFetch(`/ratings/update/${ratingId}`, {
        method: 'PUT',
        body: JSON.stringify(commentData),
    })
}

// Delete rating/comment
export async function deleteProductComment(
    ratingId: number
): Promise<DeleteCommentResponse> {
    return commentsFetch(`/ratings/delete/${ratingId}`, {
        method: 'DELETE',
    })
}