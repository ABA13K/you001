// components/products/add-comment-form.tsx
'use client'

import { useState } from 'react'
import { useComments } from '@/hooks/use-comments'
import { Star, Send } from 'lucide-react'

interface AddCommentFormProps {
  productId: number
  productName: string
  onCommentAdded: () => void
}

export default function AddCommentForm({ productId, productName, onCommentAdded }: AddCommentFormProps) {
  const { addComment, isLoading, error } = useComments()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      alert('Please select a rating')
      return
    }

    if (comment.trim().length === 0) {
      alert('Please write a comment')
      return
    }

    try {
      await addComment(productId, comment.trim(), rating)
      setIsSubmitted(true)
      setRating(0)
      setComment('')
      
      // Callback to parent
      setTimeout(() => {
        onCommentAdded()
      }, 2000)
    } catch (error) {
      console.error('Failed to submit comment:', error)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="text-green-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Review Submitted!</h3>
        <p className="text-gray-500">Thank you for sharing your experience with this product.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
      <p className="text-gray-600 mb-6">Share your thoughts about {productName}</p>

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
            Your Review *
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

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || rating === 0 || comment.trim().length === 0}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send size={16} />
            <span>{isLoading ? 'Submitting...' : 'Submit Review'}</span>
          </button>
        </div>
      </form>

      {/* Tips */}
      <div className="mt-8 p-4 bg-blue-50 rounded-md">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Writing a helpful review</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Describe your experience using the product</li>
          <li>• Mention specific features you liked or disliked</li>
          <li>• Compare it to similar products if you can</li>
          <li>• Be honest and detailed in your feedback</li>
        </ul>
      </div>
    </div>
  )
}