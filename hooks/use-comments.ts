// hooks/use-comments.ts
import { useState, useCallback } from 'react'
import {
    getProductCommentsPublic,
    getProductComments,
    addProductComment,
    updateProductComment,
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

    // Load comments (authenticated) with fallback to public API
    const loadComments = useCallback(async (productId: string, limit?: number, offset?: number) => {
        setIsLoading(true)
        setError(null)
        try {
            console.log('🔐 Attempting to load authenticated comments...')
            const response = await getProductComments(productId, limit, offset)
            console.log('✅ Authenticated comments loaded:', response)

            const commentsData = safeArray(response.data)
            console.log('📊 Extracted comments:', commentsData)

            if (offset && offset > 0) {
                setComments(prev => [...prev, ...commentsData])
            } else {
                setComments(commentsData)
            }
            setHasMore(false)
            return commentsData
        } catch (err) {
            console.error('❌ Authenticated API failed, falling back to public API:', err)

            // Fallback to public API
            try {
                console.log('🔄 Falling back to public comments API...')
                const publicResponse = await getProductCommentsPublic(productId, limit, offset)
                const commentsData = safeArray(publicResponse.data?.comments)

                setComments(commentsData)
                setHasMore(publicResponse.data?.has_more || false)
                setNextOffset(publicResponse.data?.next_offset)

                console.log('✅ Public comments loaded as fallback:', commentsData)
                return commentsData
            } catch (fallbackError) {
                const message = err instanceof Error ? err.message : 'Failed to load comments from both APIs'
                setError(message)
                setComments([])
                throw fallbackError
            }
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Add new comment/rating
    const addComment = useCallback(async (productId: number, comment: string, score: number) => {
        setIsLoading(true)
        setError(null)
        try {
            const commentData = {
                score: score,
                ...(comment.trim() && { comment: comment.trim() })
            }

            console.log('📤 Adding comment:', { productId, commentData })

            const response = await addProductComment(productId.toString(), commentData)
            console.log('✅ Comment added successfully:', response)

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

    // Update existing comment/rating
    const updateComment = useCallback(async (ratingId: number, comment: string, score: number) => {
        setIsLoading(true)
        setError(null)
        try {
            const commentData = {
                score: score,
                ...(comment.trim() && { comment: comment.trim() })
            }

            console.log('📤 Updating comment:', { ratingId, commentData })

            const response = await updateProductComment(ratingId, commentData)
            console.log('✅ Comment updated successfully:', response)

            // Update local state immediately
            setComments(prev => prev.map(comment =>
                comment.rating_id === ratingId
                    ? { ...comment, comment: commentData.comment || comment.comment, score: score.toString() }
                    : comment
            ))

            return response
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update comment'
            setError(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Delete comment/rating
    const deleteComment = useCallback(async (ratingId: number) => {
        setIsLoading(true)
        setError(null)
        try {
            console.log('📤 Deleting comment:', ratingId)

            const response = await deleteProductComment(ratingId)
            console.log('✅ Comment deleted successfully:', response)

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
        updateComment,
        deleteComment,
        loadMoreComments,
        clearError,
    }
}