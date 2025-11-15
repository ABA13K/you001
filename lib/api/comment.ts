// lib/api/comments.ts - Updated with better error handling and new types
import {
    PublicCommentsResponse,
    AuthenticatedCommentsResponse,
    AuthenticatedCommentsWithRatingStatusResponse,
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
        console.log(`📤 Making request to: ${url}`)

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers,
            },
            ...options,
        })

        // First, check if we got a successful response
        if (!response.ok) {
            const errorText = await response.text()
            console.error(`❌ HTTP Error ${response.status}:`, errorText)
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        // Try to parse as JSON
        let data
        const responseText = await response.text()
        console.log(`📥 Raw response:`, responseText)

        try {
            data = JSON.parse(responseText)
        } catch (parseError) {
            console.error('❌ JSON Parse Error:', parseError)
            console.error('📄 Response content:', responseText)
            throw new Error('Invalid JSON response from server')
        }

        console.log(`🔑 Comments API Response from ${endpoint}:`, data)
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

        // Check response status first
        if (!response.ok) {
            const errorText = await response.text()
            console.error(`❌ Public API HTTP Error ${response.status}:`, errorText)
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        // Try to parse JSON
        const responseText = await response.text()
        console.log(`📥 Public API raw response:`, responseText)

        let data
        try {
            data = JSON.parse(responseText)
        } catch (parseError) {
            console.error('❌ Public API JSON Parse Error:', parseError)
            throw new Error('Invalid JSON response from public comments API')
        }

        console.log(`📥 Public comments API response:`, data)
        return data
    } catch (error) {
        console.error(`Public comments API error:`, error)
        throw error
    }
}

// Get product comments (authenticated) - Updated to handle both response formats
export async function getProductComments(
    productId: string,
    limit?: number,
    offset?: number
): Promise<AuthenticatedCommentsResponse | AuthenticatedCommentsWithRatingStatusResponse> {
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

// Alternative function specifically for the new format with is_rated
export async function getProductCommentsWithRatingStatus(
    productId: string,
    limit?: number,
    offset?: number
): Promise<AuthenticatedCommentsWithRatingStatusResponse> {
    let url = `${API_BASE_URL}/products/${productId}/comments`

    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    if (offset) params.append('offset', offset.toString())

    const queryString = params.toString()
    if (queryString) {
        url += `?${queryString}`
    }

    const response = await commentsFetch(url, {
        method: 'GET',
    })

    // Ensure the response has the expected structure
    if (response.data && typeof response.data === 'object') {
        return response as AuthenticatedCommentsWithRatingStatusResponse;
    }

    // If it's the old format, convert it to the new format
    return {
        message: response.message,
        data: {
            is_rated: Array.isArray(response.data) ? response.data.some((comment: { is_mine: boolean }) => comment.is_mine === true) : false,
            comments: Array.isArray(response.data) ? response.data : [],
            next_offset: offset ? offset + (limit || 10) : undefined,
            has_more: false
        }
    };
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