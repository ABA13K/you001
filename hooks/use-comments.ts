// hooks/use-comments.ts
import { useState, useCallback } from 'react'
import {
    getProductCommentsPublic,
    getProductComments,
    addProductComment,
    deleteProductComment
} from '@/lib/api/comment'
import { Comment } from '@/types/comment'

export function useComments() {
    const [comments, setComments] = useState<Comment[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(false)
    const [nextOffset, setNextOffset] = useState<number | undefined>()

    // Load comments (public - no auth required)
    const loadCommentsPublic = useCallback(async (productId: string, limit?: number, offset?: number) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await getProductCommentsPublic(productId, limit, offset)
            if (offset && offset > 0) {
                // Append to existing comments for pagination
                setComments(prev => [...prev, ...response.data.comments])
            } else {
                // Replace comments for initial load
                setComments(response.data.comments)
            }
            setHasMore(response.data.has_more || false)
            setNextOffset(response.data.next_offset)
            return response.data.comments
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load comments'
            setError(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Load comments (authenticated)
    const loadComments = useCallback(async (productId: string, limit?: number, offset?: number) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await getProductComments(productId, limit, offset)
            if (offset && offset > 0) {
                setComments(prev => [...prev, ...response.data])
            } else {
                setComments(response.data)
            }
            // Note: Authenticated endpoint doesn't return pagination info
            setHasMore(false)
            return response.data
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load comments'
            setError(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Add new comment
    const addComment = useCallback(async (productId: number, comment: string, score: number) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await addProductComment({
                product_id: productId,
                comment,
                score
            })

            // Reload comments to get the updated list
            await loadComments(productId.toString())

            return response
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to add comment'
            setError(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [loadComments])

    // Delete comment
    const deleteComment = useCallback(async (productId: string, ratingId: number) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await deleteProductComment(productId, ratingId)

            // Remove comment from local state immediately
            setComments(prev => prev.filter(comment => comment.rating_id !== ratingId))

            return response
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete comment'
            setError(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Load more comments (pagination)
    const loadMoreComments = useCallback(async (productId: string, limit: number = 10) => {
        if (!hasMore || isLoading) return

        try {
            await loadCommentsPublic(productId, limit, nextOffset)
        } catch (err) {
            console.error('Failed to load more comments:', err)
        }
    }, [hasMore, isLoading, nextOffset, loadCommentsPublic])

    const clearError = useCallback(() => {
        setError(null)
    }, [])

    return {
        comments,
        isLoading,
        error,
        hasMore,
        nextOffset,
        loadCommentsPublic,
        loadComments,
        addComment,
        deleteComment,
        loadMoreComments,
        clearError,
    }
}