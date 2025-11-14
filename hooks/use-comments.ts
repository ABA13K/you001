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

    // Safe array utility
    const safeArray = <T,>(value: T[] | null | undefined): T[] => {
        return Array.isArray(value) ? value : []
    }

    // Load comments (public - no auth required)
    const loadCommentsPublic = useCallback(async (productId: string, limit?: number, offset?: number) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await getProductCommentsPublic(productId, limit, offset)
            console.log('📥 Public comments response:', response)

            // Public API: comments are in response.data.comments
            const commentsData = safeArray(response.data?.comments)
            console.log('📊 Extracted comments:', commentsData)

            if (offset && offset > 0) {
                setComments(prev => [...prev, ...commentsData])
            } else {
                setComments(commentsData)
            }
            setHasMore(response.data?.has_more || false)
            setNextOffset(response.data?.next_offset)
            return commentsData
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load comments'
            setError(message)
            setComments([])
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
            console.log('📥 Authenticated comments response:', response)

            // Authenticated API: comments are directly in response.data
            const commentsData = safeArray(response.data)
            console.log('📊 Extracted comments:', commentsData)

            if (offset && offset > 0) {
                setComments(prev => [...prev, ...commentsData])
            } else {
                setComments(commentsData)
            }
            // Authenticated endpoint doesn't return pagination info
            setHasMore(false)
            return commentsData
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load comments'
            setError(message)
            setComments([])
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
            setComments(prev => safeArray(prev).filter(comment => comment.rating_id !== ratingId))

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
        comments: safeArray(comments),
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