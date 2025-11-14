// components/products/comments-section.tsx - Updated version
'use client'

import { useState, useEffect } from 'react'
import { useComments } from '@/hooks/use-comments'
import { useAuthOperations } from '@/hooks/use-auth-operations'
import CommentList from './comment-list'
import AddCommentForm from './add-comment-form'
import { MessageSquare, Star, AlertCircle } from 'lucide-react'

interface CommentsSectionProps {
  productId: string
  productName: string
}

export default function CommentsSection({ productId, productName }: CommentsSectionProps) {
  const { comments, isLoading, error, hasMore, loadMoreComments, loadCommentsPublic, loadComments, addComment, updateComment, deleteComment } = useComments()
  const { isAuthenticated } = useAuthOperations()
  const [activeTab, setActiveTab] = useState<'comments' | 'add'>('comments')
  const [apiError, setApiError] = useState<string | null>(null)

  // Safe array utility
  const safeArray = <T,>(value: T[] | null | undefined): T[] => {
    return Array.isArray(value) ? value : []
  }

  const commentsArray = safeArray(comments)

  useEffect(() => {
    const loadCommentsData = async () => {
      setApiError(null)
      try {
        if (isAuthenticated) {
          console.log('🔐 Loading authenticated comments...')
          await loadComments(productId)
        } else {
          console.log('🔓 Loading public comments...')
          await loadCommentsPublic(productId)
        }
      } catch (err) {
        console.error('Failed to load comments:', err)
        setApiError(err instanceof Error ? err.message : 'Failed to load comments')
      }
    }

    loadCommentsData()
  }, [productId, isAuthenticated, loadComments, loadCommentsPublic])

  // Calculate average rating
  const averageRating = commentsArray.length > 0 
    ? commentsArray.reduce((sum, comment) => sum + parseFloat(comment.score), 0) / commentsArray.length
    : 0

  // Rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: commentsArray.filter(comment => Math.round(parseFloat(comment.score)) === stars).length,
    percentage: commentsArray.length > 0 
      ? (commentsArray.filter(comment => Math.round(parseFloat(comment.score)) === stars).length / commentsArray.length) * 100
      : 0
  }))

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <MessageSquare size={24} className="text-gray-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center">
                  <Star size={20} className="text-yellow-400 fill-current" />
                  <span className="ml-1 text-lg font-semibold text-gray-900">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{commentsArray.length} reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Error Banner */}
      {apiError && (
        <div className="bg-yellow-50 border-b border-yellow-200 p-4">
          <div className="flex items-center">
            <AlertCircle size={20} className="text-yellow-400 mr-3" />
            <div className="flex-1">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> {apiError}. Showing public reviews.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Rating Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Average Rating */}
          <div className="text-center lg:text-left">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center lg:justify-start">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  className={`${
                    star <= Math.round(averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600 mt-1">Based on {commentsArray.length} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Rating Breakdown</h4>
            <div className="space-y-2">
              {ratingDistribution.map(({ stars, count, percentage }) => (
                <div key={stars} className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 w-4">{stars}</span>
                  <Star size={16} className="text-yellow-400 fill-current" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('comments')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'comments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Reviews ({commentsArray.length})
            </button>
            {isAuthenticated && (
              <button
                onClick={() => setActiveTab('add')}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'add'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Write a Review
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'comments' ? (
          <CommentList
            comments={commentsArray}
            isLoading={isLoading}
            error={error}
            hasMore={hasMore}
            onLoadMore={() => loadMoreComments(productId)}
            onDeleteComment={(ratingId) => deleteComment(ratingId)}
            onUpdateComment={(ratingId, comment, score) => updateComment(ratingId, comment, score)}
          />
        ) : (
          <AddCommentForm
            productId={parseInt(productId)}
            productName={productName}
            onCommentAdded={() => {
              setActiveTab('comments')
              // Reload comments to show the new one
              loadComments(productId).catch(err => {
                console.error('Failed to reload comments:', err)
                // Fallback to public API if authenticated fails
                loadCommentsPublic(productId)
              })
            }}
          />
        )}
      </div>
    </div>
  )
}