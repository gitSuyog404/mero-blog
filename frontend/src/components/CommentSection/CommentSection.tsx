import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import {
  useCreateCommentMutation,
  useGetCommentsByBlogQuery,
  useDeleteCommentMutation,
} from "../../redux/slices/commentApiSlice";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import type { RootState } from "../../redux/store";

interface CommentSectionProps {
  blogId: string;
}

interface Comment {
  _id: string;
  blogId: string;
  userId: {
    _id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ blogId }) => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: commentsData,
    isLoading: isLoadingComments,
    refetch: refetchComments,
  } = useGetCommentsByBlogQuery({ blogId });

  const [createComment] = useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !userInfo || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createComment({
        blogId,
        content: commentText.trim(),
      }).unwrap();
      setCommentText("");
      refetchComments();
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;

    setIsDeleting(true);
    try {
      await deleteComment({ commentId: commentToDelete }).unwrap();
      refetchComments();
      setShowDeleteModal(false);
      setCommentToDelete(null);
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteComment = () => {
    setShowDeleteModal(false);
    setCommentToDelete(null);
    setIsDeleting(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDisplayName = (user: Comment["userId"]) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.lastName) {
      return user.lastName;
    }
    return user.username;
  };

  const comments = commentsData?.comments || [];

  return (
    <motion.div
      className="mt-12 border-t border-gray-200 pt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Comments ({comments.length})
      </h3>

      {userInfo ? (
        <motion.form
          onSubmit={handleSubmitComment}
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        >
          <div className="flex items-start space-x-4">
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-md"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {userInfo.firstName?.charAt(0) || userInfo.username.charAt(0)}
            </motion.div>
            <div className="flex-1">
              <motion.div
                className="relative"
                initial={false}
                animate={commentText ? "focused" : "unfocused"}
              >
                <motion.textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a thoughtful comment..."
                  className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white shadow-sm resize-none transition-all duration-300 focus:outline-none focus:border-gray-400 focus:shadow-md placeholder-gray-400"
                  rows={commentText ? 4 : 3}
                  maxLength={1000}
                  disabled={isSubmitting}
                  variants={{
                    focused: {
                      borderColor: "#374151",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      scale: 1.01,
                    },
                    unfocused: {
                      borderColor: "#e5e7eb",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                      scale: 1,
                    },
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  whileFocus="focused"
                />

                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 opacity-0 -z-10"
                  variants={{
                    focused: { opacity: 0.1, scale: 1.02 },
                    unfocused: { opacity: 0, scale: 1 },
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>

              <motion.div
                className="flex items-center justify-between mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <motion.span
                  className={`text-sm transition-colors duration-200 ${
                    commentText.length > 900
                      ? "text-red-500 font-medium"
                      : commentText.length > 700
                      ? "text-yellow-600"
                      : "text-gray-500"
                  }`}
                  animate={{
                    scale: commentText.length > 900 ? [1, 1.05, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {commentText.length}/1000 characters
                </motion.span>

                <motion.button
                  type="submit"
                  disabled={!commentText.trim() || isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg"
                  whileHover={{
                    scale: !commentText.trim() || isSubmitting ? 1 : 1.02,
                    boxShadow:
                      !commentText.trim() || isSubmitting
                        ? undefined
                        : "0 8px 25px rgba(0, 0, 0, 0.15)",
                  }}
                  whileTap={{
                    scale: !commentText.trim() || isSubmitting ? 1 : 0.98,
                  }}
                  animate={isSubmitting ? { opacity: [1, 0.7, 1] } : {}}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 17,
                    opacity: {
                      duration: 1,
                      repeat: isSubmitting ? Infinity : 0,
                    },
                  }}
                >
                  {isSubmitting ? (
                    <motion.div className="flex items-center space-x-2">
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <span>Posting...</span>
                    </motion.div>
                  ) : (
                    "Post Comment"
                  )}
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.form>
      ) : (
        <motion.div
          className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 text-center shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        >
          <motion.div
            className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </motion.div>
          <p className="text-gray-600 font-medium">
            Please log in to join the conversation
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Share your thoughts and engage with the community
          </p>
        </motion.div>
      )}

      {isLoadingComments ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-6">
            {comments.map((comment: Comment, index: number) => (
              <motion.div
                key={comment._id}
                className="flex items-start space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {getDisplayName(comment.userId).charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {getDisplayName(comment.userId)}
                      </span>
                      <span className="text-sm text-gray-500">
                        @{comment.userId.username}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    {(userInfo?._id === comment.userId._id ||
                      userInfo?.role === "admin") && (
                      <motion.button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded transition-colors duration-200 hover:bg-red-50"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Delete comment"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </motion.button>
                    )}
                  </div>
                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: comment.content }}
                  />
                </div>
              </motion.div>
            ))}
            {comments.length === 0 && (
              <motion.div
                className="text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-gray-500">
                  No comments yet. Be the first to comment!
                </p>
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDeleteComment}
        onConfirm={confirmDeleteComment}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        type="danger"
      />
    </motion.div>
  );
};

export default CommentSection;
