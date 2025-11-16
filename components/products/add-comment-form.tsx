/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
// components/products/add-comment-form.tsx
'use client'

import { useState, useEffect } from 'react'
import { useComments } from '@/hooks/use-comments'
import { Star, Send, Edit, CheckCircle, AlertCircle, Lock } from 'lucide-react'

interface AddCommentFormProps {
  productId: string
  productName: string
  onCommentAdded: () => void
}

export default function AddCommentForm({ productId, productName, onCommentAdded }: AddCommentFormProps) {
  const { comments, isRated, addComment, updateComment, isLoading, error } = useComments()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  
  // Find user's specific comment using is_mine field for editing
  const userComment = comments.find(comment => comment.is_mine === true)

  console.log('⭐ is_rated (user commented):', isRated)
  console.log('👤 is_mine comment found:', userComment)
  console.log('📝 All comments:', comments)

  // If user has a comment (is_mine: true), always show edit mode
  const [isEditing, setIsEditing] = useState(!!userComment)

  // Initialize form with user's comment data
  useEffect(() => {
    if (userComment) {
      console.log('🔄 Initializing form with user comment (is_mine: true):', userComment)
      setRating(parseFloat(userComment.score))
      setComment(userComment.comment || '')
      setIsEditing(true)
    } else {
      // Reset form if no user comment found
      console.log('🔄 No user comment found, resetting form')
      setRating(0)
      setComment('')
      setIsEditing(false)
    }
  }, [userComment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    
    if (rating === 0) {
      setFormError('Please select a rating')
      return
    }

    // Prevent new review if user has already rated (is_rated: true)
    if (isRated && !userComment) {
      setFormError('You have already reviewed this product. Please refresh the page to edit your review.')
      return
    }

    try {
      if (userComment) {
        // Update existing user comment (is_mine: true)
        console.log('📝 Updating user comment (is_mine: true):', userComment.rating_id)
        await updateComment(userComment.rating_id, comment.trim(), rating)
        console.log('✅ User comment updated successfully')
      } else if (!isRated) {
        // Add new review only if user hasn't rated yet (is_rated: false)
        console.log('📝 Adding new review for product:', productId)
        await addComment(productId, comment.trim(), rating)
        console.log('✅ New review added successfully')
      }
      
      setIsSubmitted(true)
      
      // Callback to parent
      setTimeout(() => {
        onCommentAdded()
        setIsSubmitted(false)
      }, 2000)
    } catch (error: any) {
      console.error('Failed to submit review:', error)
      
      // Handle specific error messages from API
      if (error.message?.includes('already exists')) {
        setFormError('You have already reviewed this product. Please edit your existing review instead.')
      } else if (error.message) {
        setFormError(error.message)
      } else {
        setFormError('Failed to submit review. Please try again.')
      }
    }
  }

  // If user has rated but we can't find their specific comment
  if (isRated && !userComment) {
    return (
      <div className="max-w-2xl">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Lock size={24} className="text-yellow-500" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900">Review Found But Cannot Edit</h3>
              <p className="text-yellow-700 text-sm">
                We found your rating (is_rated: true) but couldn&apos;t locate your specific comment to edit.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-md p-4 border border-yellow-100">
            <p className="text-yellow-800 text-sm">
              <strong>Status:</strong> You have rated this product<br/>
              <strong>Issue:</strong> Your specific comment not found for editing<br/>
              <strong>Solution:</strong> Please refresh the page or check the comments list
            </p>
          </div>
        </div>
      </div>
    )
  }

  // If user has a comment but not in edit mode
  if (userComment && !isEditing) {
    return (
      <div className="max-w-2xl">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <CheckCircle size={24} className="text-green-500" />
              <div>
                <h3 className="text-lg font-semibold text-green-900">Your Review Found</h3>
                <p className="text-green-700 text-sm">
                  We found your comment (is_mine: true) - you can edit it below
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Edit size={16} />
              <span>Edit Review</span>
            </button>
          </div>

          {/* Show user's current review */}
          <div className="bg-white rounded-md p-4 border border-green-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={`${
                      star <= Math.round(parseFloat(userComment.score))
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 font-medium">
                ({parseFloat(userComment.score).toFixed(1)})
              </span>
            </div>
            {userComment.comment && (
              <p className="text-gray-700 text-sm leading-relaxed">{userComment.comment}</p>
            )}
            <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md mr-2">
                Your Review (is_mine: true)
              </span>
              <span className="text-xs text-gray-500">
                Rating ID: {userComment.rating_id}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="text-green-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {userComment ? 'Review Updated!' : 'Review Submitted!'}
        </h3>
        <p className="text-gray-500">
          {userComment 
            ? 'Your review has been updated successfully.' 
            : 'Thank you for sharing your experience with this product.'
          }
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {userComment ? 'Edit Your Review' : 'Write a Review'}
        </h3>
        <p className="text-gray-600">
          {userComment 
            ? 'Update your thoughts about this product' 
            : `Share your thoughts about "${productName}"`
          }
        </p>
        
        {/* Status information */}
        <div className="mt-3 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            <strong>Status:</strong> {isRated ? 'You have rated this product' : 'You haven\'t rated this product yet'}
            {userComment && ' • Your comment is ready for editing'}
          </p>
        </div>
      </div>

      {/* Show API errors */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-800 text-sm font-medium">Unable to submit review</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Show form-specific errors */}
      {formError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle size={20} className="text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-yellow-800 text-sm font-medium">Notice</p>
              <p className="text-yellow-700 text-sm mt-1">{formError}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Your Rating *
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110"
                disabled={isRated && !userComment}
              >
                <Star
                  size={32}
                  className={`${
                    star <= (hoverRating || rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  } ${isRated && !userComment ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating > 0 ? `${rating}.0 stars` : 'Select rating'}
            </span>
          </div>
          {userComment && (
            <p className="text-xs text-blue-600 mt-2">
              Current rating: {parseFloat(userComment.score).toFixed(1)} stars
            </p>
          )}
          {isRated && !userComment && (
            <p className="text-xs text-yellow-600 mt-2">
              You have already rated this product (is_rated: true)
            </p>
          )}
        </div>

        {/* Comment Textarea */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review {!userComment && '(Optional)'}
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={6}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              isRated && !userComment ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            placeholder={
              userComment 
                ? "Update your experience with this product..." 
                : "Share your experience with this product. What did you like or dislike? How does it compare to similar products?"
            }
            maxLength={1000}
            disabled={isRated && !userComment}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">
              {comment.length}/1000 characters
            </span>
            <span className="text-xs text-gray-500">
              * Required fields
            </span>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          {userComment && (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={isLoading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || rating === 0 || (isRated && !userComment)}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send size={16} />
            <span>
              {isLoading 
                ? 'Submitting...' 
                : userComment 
                  ? 'Update Review' 
                  : 'Submit Review'
              }
            </span>
          </button>
        </div>
      </form>

      {/* Tips */}
      <div className="mt-8 p-4 bg-blue-50 rounded-md">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          {userComment ? 'Editing your review' : 'Writing a helpful review'}
        </h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Describe your experience using the product</li>
          <li>• Mention specific features you liked or disliked</li>
          <li>• Compare it to similar products if you can</li>
          <li>• Be honest and detailed in your feedback</li>
          {userComment ? (
            <li>• You can update your review as many times as needed</li>
          ) : (
            <li>• You can only submit one review per product</li>
          )}
        </ul>
        
        {/* Debug info */}
        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="text-xs text-blue-600">
            <strong>Debug:</strong> is_rated: {isRated ? 'true' : 'false'} • 
            is_mine: {userComment ? 'true' : 'false'} • 
            Rating ID: {userComment?.rating_id || 'none'}
          </p>
        </div>
      </div>
    </div>
  )
}