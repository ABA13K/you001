// components/products/comment-item.tsx
'use client'

import { useState } from 'react'
import { Comment } from '@/types/comment'
import { Star, Trash2, MoreVertical, Edit, X, Check } from 'lucide-react'

interface CommentItemProps {
  comment: Comment
  onDelete: (ratingId: number) => void
  onUpdate?: (ratingId: number, comment: string, score: number) => void
}

export default function CommentItem({ comment, onDelete, onUpdate }: CommentItemProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editComment, setEditComment] = useState(comment.comment)
  const [editScore, setEditScore] = useState(parseFloat(comment.score))
  const [isUpdating, setIsUpdating] = useState(false)

  const handleDelete = async () => {
    if (!comment.is_mine) return
    
    setIsDeleting(true)
    try {
      await onDelete(comment.rating_id)
    } catch (error) {
      console.error('Failed to delete comment:', error)
    } finally {
      setIsDeleting(false)
      setShowMenu(false)
    }
  }

  const handleEdit = () => {
    setEditComment(comment.comment)
    setEditScore(parseFloat(comment.score))
    setIsEditing(true)
    setShowMenu(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditComment(comment.comment)
    setEditScore(parseFloat(comment.score))
  }

  const handleSaveEdit = async () => {
    if (!onUpdate) return
    
    setIsUpdating(true)
    try {
      await onUpdate(comment.rating_id, editComment, editScore)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update comment:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const score = parseFloat(comment.score)

  if (isEditing) {
    return (
      <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {comment.user_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">{comment.user_name}</h4>
            </div>
          </div>
        </div>

        {/* Edit Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setEditScore(star)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  size={24}
                  className={`${
                    star <= editScore
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">{editScore}.0 stars</span>
          </div>
        </div>

        {/* Edit Comment */}
        <div className="mb-4">
          <label htmlFor="edit-comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            id="edit-comment"
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Share your experience with this product..."
            maxLength={1000}
          />
          <div className="text-xs text-gray-500 mt-1">
            {editComment.length}/1000 characters
          </div>
        </div>

        {/* Edit Actions */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancelEdit}
            disabled={isUpdating}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 flex items-center"
          >
            <X size={16} className="mr-1" />
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            disabled={isUpdating || editScore === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            <Check size={16} className="mr-1" />
            {isUpdating ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* User Info and Rating */}
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {comment.user_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">{comment.user_name}</h4>
              <div className="flex items-center space-x-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={`${
                        star <= Math.round(score)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-1">({score.toFixed(1)})</span>
              </div>
            </div>
          </div>

          {/* Comment Text */}
          <p className="text-gray-700 text-sm leading-relaxed">{comment.comment}</p>

          {/* My Comment Badge */}
          {comment.is_mine && (
            <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
              Your Review
            </span>
          )}
        </div>

        {/* Menu for own comments */}
        {comment.is_mine && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
            >
              <MoreVertical size={16} />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px]">
                <button
                  onClick={handleEdit}
                  className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center space-x-2"
                >
                  <Edit size={14} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 disabled:opacity-50"
                >
                  <Trash2 size={14} />
                  <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  )
}