/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/use-comments.ts
import { useState, useCallback } from 'react'
import {
    getProductCommentsPublic,
    getProductComments,
    addProductComment,
    updateProductComment,
    deleteProductComment
} from '@/lib/api/comment'
import { Comment, PublicCommentsResponse, AuthenticatedCommentsWithRatingStatusResponse } from '@/types/comment'

export function useComments() {
    const [comments, setComments] = useState<Comment[]>([])
    const [isRated, setIsRated] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(false)
    const [nextOffset, setNextOffset] = useState<number | undefined>()

    // Safe array utility
    const safeArray = <T,>(value: T[] | null | undefined): T[] => {
        return Array.isArray(value) ? value : []
    }

    // Extract error message from API response
    const extractErrorMessage = (error: any): string => {
        if (typeof error === 'string') return error
        if (error?.message) return error.message
        if (error?.response?.data?.message) return error.response.data.message
        return 'An unexpected error occurred'
    }

    // Load comments (public - no auth required)
    const loadCommentsPublic = useCallback(async (productId: string, limit?: number, offset?: number) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await getProductCommentsPublic(productId, limit, offset) as PublicCommentsResponse
            console.log('📥 Public comments response:', response)

            const commentsData = safeArray(response.data?.comments)
            console.log('📊 Extracted comments:', commentsData)

            // Set isRated from API response
            setIsRated(response.data?.is_rated || false)
            console.log('⭐ User has rated:', response.data?.is_rated)

            if (offset && offset > 0) {
                setComments(prev => [...prev, ...commentsData])
            } else {
                setComments(commentsData)
            }
            setHasMore(response.data?.has_more || false)
            setNextOffset(response.data?.next_offset)
            return commentsData
        } catch (err) {
            const message = extractErrorMessage(err)
            setError(message)
            setComments([])
            setIsRated(false)
            throw new Error(message)
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

            // Check if response has the new format with is_rated
            if (response.data && typeof response.data === 'object' && 'is_rated' in response.data) {
                // New format with is_rated field
                const typedResponse = response as AuthenticatedCommentsWithRatingStatusResponse
                const commentsData = safeArray(typedResponse.data.comments)

                setIsRated(typedResponse.data.is_rated || false)
                console.log('⭐ User has rated (new format):', typedResponse.data.is_rated)

                if (offset && offset > 0) {
                    setComments(prev => [...prev, ...commentsData])
                } else {
                    setComments(commentsData)
                }
                setHasMore(typedResponse.data.has_more || false)
                setNextOffset(typedResponse.data.next_offset)
            } else {
                // Old format - just array of comments
                const commentsData = safeArray(response.data)
                console.log('📊 Extracted comments:', commentsData)

                // For authenticated API without is_rated, check if any comment is mine
                const userHasRated = commentsData.some(comment => comment.is_mine === true)
                setIsRated(userHasRated)
                console.log('⭐ User has rated (old format):', userHasRated)

                if (offset && offset > 0) {
                    setComments(prev => [...prev, ...commentsData])
                } else {
                    setComments(commentsData)
                }
                setHasMore(false)
            }

            return comments
        } catch (err) {
            console.error('❌ Authenticated API failed, falling back to public API:', err)

            // Fallback to public API
            try {
                console.log('🔄 Falling back to public comments API...')
                const publicResponse = await getProductCommentsPublic(productId, limit, offset) as PublicCommentsResponse
                const commentsData = safeArray(publicResponse.data?.comments)

                // Set isRated from public API response
                setIsRated(publicResponse.data?.is_rated || false)
                console.log('⭐ User has rated (public fallback):', publicResponse.data?.is_rated)

                setComments(commentsData)
                setHasMore(publicResponse.data?.has_more || false)
                setNextOffset(publicResponse.data?.next_offset)

                console.log('✅ Public comments loaded as fallback:', commentsData)
                return commentsData
            } catch (fallbackError) {
                const message = extractErrorMessage(fallbackError)
                setError(message)
                setComments([])
                setIsRated(false)
                throw new Error(message)
            }
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Add new comment/rating
    const addComment = useCallback(async (productId: string, comment: string, score: number) => {
        setIsLoading(true)
        setError(null)
        try {
            const commentData = {
                score: score,
                ...(comment.trim() && { comment: comment.trim() })
            }

            console.log('📤 Adding comment:', { productId, commentData })

            const response = await addProductComment(productId, commentData)
            console.log('✅ Comment added successfully:', response)

            // Set isRated to true since user just rated
            setIsRated(true)

            // Reload comments to get the updated list
            await loadComments(productId)

            return response
        } catch (err) {
            const message = extractErrorMessage(err)
            setError(message)
            throw new Error(message)
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
            const message = extractErrorMessage(err)
            setError(message)
            throw new Error(message)
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

            // Set isRated to false since user deleted their rating
            setIsRated(false)

            return response
        } catch (err) {
            const message = extractErrorMessage(err)
            setError(message)
            throw new Error(message)
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
        isRated,
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