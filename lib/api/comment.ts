// lib/api/comments.ts
import { CommentsResponse, AuthenticatedCommentsResponse, AddCommentData, AddCommentResponse } from '@/types/comment'

const API_BASE_URL = 'https://aa-dev.site/you/api'

// Public API - No authentication required
// lib/api/comments.ts - Add debugging to both functions

// Public API - No authentication required
// lib/api/comments.ts

// Public API - No authentication required
export async function getProductCommentsPublic(
    productId: string,
    limit?: number,
    offset?: number
): Promise<CommentsResponse> {
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

// Authenticated API - Requires bearer token
export async function getProductComments(
    productId: string,
    limit?: number,
    offset?: number
): Promise<AuthenticatedCommentsResponse> {
    const token = localStorage.getItem('token')

    if (!token) {
        throw new Error('No authentication token found')
    }

    try {
        let url = `${API_BASE_URL}/products/${productId}/comments`

        const params = new URLSearchParams()
        if (limit) params.append('limit', limit.toString())
        if (offset) params.append('offset', offset.toString())

        const queryString = params.toString()
        if (queryString) {
            url += `?${queryString}`
        }

        console.log(`📤 Fetching authenticated comments from: ${url}`)

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        const data = await response.json()
        console.log(`📥 Authenticated comments API response:`, data)

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`)
        }

        // Handle different response structures
        // If data.data exists and has comments array, use that structure
        // Otherwise, assume data.data is the comments array directly
        if (data.data && Array.isArray(data.data.comments)) {
            // Public API structure: { data: { comments: [], next_offset, has_more } }
            return {
                message: data.message,
                data: data.data.comments
            }
        } else if (Array.isArray(data.data)) {
            // Authenticated API structure: { data: [] }
            return data
        } else {
            // Fallback: try to extract comments from different paths
            console.warn('Unexpected API response structure:', data)
            return {
                message: data.message,
                data: Array.isArray(data.data) ? data.data : []
            }
        }
    } catch (error) {
        console.error(`Authenticated comments API error:`, error)
        throw error
    }
}

// Add new comment
export async function addProductComment(commentData: AddCommentData): Promise<AddCommentResponse> {
    const token = localStorage.getItem('token')

    if (!token) {
        throw new Error('No authentication token found')
    }

    try {
        const url = `${API_BASE_URL}/products/${commentData.product_id}/comments`
        console.log(`📤 Adding comment to: ${url}`, commentData)

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(commentData),
        })

        const data = await response.json()
        console.log(`📥 Add comment API response:`, data)

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`)
        }

        return data
    } catch (error) {
        console.error(`Add comment API error:`, error)
        throw error
    }
}

// Delete comment
export async function deleteProductComment(productId: string, ratingId: number): Promise<{ message: string }> {
    const token = localStorage.getItem('token')

    if (!token) {
        throw new Error('No authentication token found')
    }

    try {
        const url = `${API_BASE_URL}/products/${productId}/comments/${ratingId}`
        console.log(`📤 Deleting comment from: ${url}`)

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        const data = await response.json()
        console.log(`📥 Delete comment API response:`, data)

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`)
        }

        return data
    } catch (error) {
        console.error(`Delete comment API error:`, error)
        throw error
    }
}
