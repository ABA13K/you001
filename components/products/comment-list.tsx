// components/products/comment-list.tsx
'use client'

import { Comment } from '@/types/comment'
import CommentItem from './comment-item'
import { Loader2 } from 'lucide-react'

interface CommentListProps {
  comments: Comment[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
  onLoadMore: () => void
  onDeleteComment: (ratingId: number) => void
  onUpdateComment?: (ratingId: number, comment: string, score: number) => void
}

export default function CommentList({ 
  comments, 
  isLoading, 
  error, 
  hasMore, 
  onLoadMore, 
  onDeleteComment,
  onUpdateComment 
}: CommentListProps) {
  // Ensure comments is always an array
  const commentsArray = Array.isArray(comments) ? comments : []

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800 text-sm">{error}</p>
      </div>
    )
  }

  if (isLoading && commentsArray.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    )
  }

  if (commentsArray.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-gray-500">Be the first to share your thoughts about this product!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Comments List */}
      {commentsArray.map((comment) => (
        <CommentItem
          key={comment.rating_id}
          comment={comment}
          onDelete={onDeleteComment}
          onUpdate={onUpdateComment}
        />
      ))}

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Loading...
              </>
            ) : (
              'Load More Reviews'
            )}
          </button>
        </div>
      )}
    </div>
  )
}