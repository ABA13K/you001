/* eslint-disable react-hooks/set-state-in-effect */
// components/products/add-comment-form.tsx
'use client'

import { useState, useEffect } from 'react'
import { useComments } from '@/hooks/use-comments'
import { Star, Send, Edit } from 'lucide-react'

interface AddCommentFormProps {
  productId: number
  productName: string
  onCommentAdded: () => void
}

export default function AddCommentForm({ productId, productName, onCommentAdded }: AddCommentFormProps) {
  const { comments, addComment, updateComment, isLoading, error } = useComments()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  // Find user's existing review
  const existingReview = comments.find(comment => comment.is_mine)
  const [isEditing, setIsEditing] = useState(!!existingReview)

  // Initialize form with existing review data
  useEffect(() => {
    if (existingReview) {
      setRating(parseFloat(existingReview.score))
      setComment(existingReview.comment)
      setIsEditing(true)
    }
  }, [existingReview])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      alert('Please select a rating')
      return
    }

    try {
      if (existingReview && isEditing) {
        // Update existing review
        await updateComment(existingReview.rating_id, comment.trim(), rating)
        console.log('✅ Review updated successfully')
      } else {
        // Add new review
        await addComment(productId, comment.trim(), rating)
        console.log('✅ Review added successfully')
      }
      
      setIsSubmitted(true)
      setRating(0)
      setComment('')
      
      // Callback to parent
      setTimeout(() => {
        onCommentAdded()
      }, 2000)
    } catch (error) {
      console.error('Failed to submit review:', error)
    }
  }

  const handleCancelEdit = () => {
    if (existingReview) {
      setRating(parseFloat(existingReview.score))
      setComment(existingReview.comment)
    } else {
      setRating(0)
      setComment('')
    }
    setIsEditing(false)
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
          {existingReview ? 'Review Updated!' : 'Review Submitted!'}
        </h3>
        <p className="text-gray-500">
          {existingReview 
            ? 'Your review has been updated successfully.' 
            : 'Thank you for sharing your experience with this product.'
          }
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {existingReview && isEditing ? 'Edit Your Review' : 'Write a Review'}
          </h3>
          <p className="text-gray-600">
            {existingReview && isEditing 
              ? 'Update your thoughts about this product' 
              : `Share your thoughts about "${productName}"`
            }
          </p>
        </div>
        
        {existingReview && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Edit size={16} />
            <span>Edit Review</span>
          </button>
        )}
      </div>

      {existingReview && !isEditing && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="font-medium text-blue-900 mb-2">You&apos;ve already reviewed this product</h4>
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={`${
                    star <= Math.round(parseFloat(existingReview.score))
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-blue-700">({parseFloat(existingReview.score).toFixed(1)})</span>
          </div>
          <p className="text-blue-800 text-sm">{existingReview.comment}</p>
        </div>
      )}

      {(isEditing || !existingReview) && (
        <>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
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
                  >
                    <Star
                      size={32}
                      className={`${
                        star <= (hoverRating || rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {rating > 0 ? `${rating}.0 stars` : 'Select rating'}
                </span>
              </div>
            </div>

            {/* Comment Textarea */}
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Your Review {!existingReview && '(Optional)'}
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Share your experience with this product. What did you like or dislike? How does it compare to similar products?"
                maxLength={1000}
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
              {existingReview && isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading || rating === 0}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send size={16} />
                <span>
                  {isLoading 
                    ? 'Submitting...' 
                    : existingReview && isEditing 
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
              {existingReview && isEditing ? 'Updating your review' : 'Writing a helpful review'}
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Describe your experience using the product</li>
              <li>• Mention specific features you liked or disliked</li>
              <li>• Compare it to similar products if you can</li>
              <li>• Be honest and detailed in your feedback</li>
            </ul>
          </div>
        </>
      )}
    </div>
  )
}