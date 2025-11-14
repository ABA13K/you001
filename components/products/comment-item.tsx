// components/products/comment-item.tsx
'use client'

import { useState } from 'react'
import { Comment } from '@/types/comment'
import { Star, Trash2, MoreVertical } from 'lucide-react'

interface CommentItemProps {
  comment: Comment
  onDelete: (ratingId: number) => void
}

export default function CommentItem({ comment, onDelete }: CommentItemProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

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

  const score = parseFloat(comment.score)

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