import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetBlogsByUserQuery,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
} from "../../redux/slices/blogApiSlice";
import Pagination from "../../components/Pagination/Pagination";
import { BlogCardSkeleton } from "../../components/Loader/Loader";
import type { RootState } from "../../redux/store";
import Sidebar from "../../components/Sidebar/Sidebar";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaHeart,
  FaComment,
  FaClock,
  FaCalendarAlt,
  FaBookOpen,
  FaHome,
  FaInfoCircle,
  FaBars,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";

const UserDashboard: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [deleteBlog] = useDeleteBlogMutation();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9;
  const offset = (currentPage - 1) * limit;

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const {
    data: blogsData,
    isLoading,
    error,
    refetch,
  } = useGetBlogsByUserQuery(
    {
      userId: userInfo?._id || "",
      limit,
      offset,
    },
    { skip: !userInfo?._id }
  );

  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const getDisplayName = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user?.firstName) {
      return user.firstName;
    } else if (user?.lastName) {
      return user.lastName;
    }
    return user?.username || "User";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getExcerpt = (content: string, maxLength: number = 150) => {
    const textContent = content.replace(/<[^>]*>/g, "");
    return textContent.length > maxLength
      ? textContent.substring(0, maxLength) + "..."
      : textContent;
  };

  const handleDeleteBlog = async (blogId: string) => {
    try {
      await deleteBlog(blogId).unwrap();
      toast.success("Blog deleted successfully!");
      setDeleteConfirm(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete blog");
    }
  };

  const handleStatusChange = async (blogId: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";

    try {
      await updateBlog({
        blogId,
        status: newStatus as "draft" | "published",
      }).unwrap();

      toast.success(
        `Blog ${
          newStatus === "published" ? "published" : "moved to draft"
        } successfully!`
      );
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update blog status");
    }
  };

  if (!userInfo) {
    navigate("/login");
    return null;
  }

  if (isLoading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex min-h-screen">
          <Sidebar
            className="hidden lg:flex"
            isMobileOpen={isMobileSidebarOpen}
            onMobileToggle={toggleMobileSidebar}
          />
          <div className="flex-1 lg:ml-64">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: limit }).map((_, index) => (
                  <BlogCardSkeleton key={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error loading dashboard
          </h2>
          <p className="text-gray-600 mb-6">
            There was an error loading your blogs. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  const blogs = blogsData?.blogs || [];
  const totalBlogs = blogsData?.total || 0;
  const publishedBlogs = blogs.filter(
    (blog) => blog.status === "published"
  ).length;
  const draftBlogs = blogs.filter((blog) => blog.status === "draft").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <Sidebar
          className="hidden lg:flex"
          isMobileOpen={isMobileSidebarOpen}
          onMobileToggle={toggleMobileSidebar}
        />

        <div className="flex-1 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <motion.button
                    className="lg:hidden p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleMobileSidebar}
                  >
                    <FaBars className="w-5 h-5 text-gray-600" />
                  </motion.button>

                  <div className="min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 truncate">
                      Welcome back, {getDisplayName(userInfo)}!
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                      Manage your blog posts and track your writing progress
                    </p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0"
                >
                  <Link
                    to="/write"
                    className="bg-gray-900 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto"
                  >
                    <FaPlus className="w-4 h-4" />
                    <span className="sm:hidden">Write</span>
                    <span className="hidden sm:inline">New Post</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              <motion.div
                className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      Total Posts
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {totalBlogs}
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaEdit className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      Published
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {publishedBlogs}
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaEye className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      Drafts
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {draftBlogs}
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaClock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Your Blog Posts
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {totalBlogs === 0
                    ? "You haven't written any posts yet. Start writing your first story!"
                    : `You have ${totalBlogs} ${
                        totalBlogs === 1 ? "post" : "posts"
                      }`}
                </p>
              </div>

              {totalBlogs === 0 ? (
                <div>
                  <motion.div
                    className="lg:hidden mb-6 sm:mb-8 grid grid-cols-2 gap-3 sm:gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      to="/blogs"
                      className="flex flex-col items-center p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <FaBookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 mb-2" />
                      <span className="text-xs sm:text-sm font-medium text-gray-900">
                        Stories
                      </span>
                    </Link>
                    <Link
                      to="/write"
                      className="flex flex-col items-center p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <FaEdit className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 mb-2" />
                      <span className="text-xs sm:text-sm font-medium text-gray-900">
                        Write
                      </span>
                    </Link>
                    <Link
                      to="/"
                      className="flex flex-col items-center p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <FaHome className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 mb-2" />
                      <span className="text-xs sm:text-sm font-medium text-gray-900">
                        Home
                      </span>
                    </Link>
                    <Link
                      to="/about"
                      className="flex flex-col items-center p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <FaInfoCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 mb-2" />
                      <span className="text-xs sm:text-sm font-medium text-gray-900">
                        About
                      </span>
                    </Link>
                  </motion.div>

                  <motion.div
                    className="p-6 sm:p-12 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <FaEdit className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                      Ready to share your story?
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed">
                      Your dashboard is waiting for your first masterpiece.
                      Every great writer started with a single word. What will
                      yours be?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                      <Link
                        to="/write"
                        className="inline-flex items-center justify-center space-x-2 bg-gray-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
                      >
                        <FaEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Start Writing</span>
                      </Link>
                      <Link
                        to="/blogs"
                        className="inline-flex items-center justify-center space-x-2 bg-white text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                      >
                        <FaBookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Browse Stories</span>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {blogs.map((blog, index) => (
                    <motion.div
                      key={blog._id}
                      className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                        <div className="flex-shrink-0 w-full sm:w-20 md:w-24 h-32 sm:h-20 md:h-24 rounded-lg overflow-hidden">
                          <img
                            src={blog.banner.url}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1 sm:line-clamp-2">
                                  {blog.title}
                                </h3>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium self-start ${
                                    blog.status === "published"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-orange-100 text-orange-800"
                                  }`}
                                >
                                  {blog.status === "published"
                                    ? "Published"
                                    : "Draft"}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2 sm:line-clamp-1">
                                {getExcerpt(blog.content)}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <FaCalendarAlt className="w-3 h-3" />
                                  <span>{formatDate(blog.publishedAt)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <FaHeart className="w-3 h-3" />
                                  <span>{blog.likesCount}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <FaComment className="w-3 h-3" />
                                  <span>{blog.commentsCount}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <FaEye className="w-3 h-3" />
                                  <span>{blog.viewsCount}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1 sm:space-x-2 sm:ml-4 flex-shrink-0">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(`/blog/${blog.slug}`)}
                                className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Post"
                              >
                                <FaEye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(`/edit/${blog.slug}`)}
                                className="p-1.5 sm:p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Edit Post"
                              >
                                <FaEdit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  handleStatusChange(blog._id, blog.status)
                                }
                                disabled={isUpdating}
                                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                                  blog.status === "published"
                                    ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                                    : "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                } ${
                                  isUpdating
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                title={
                                  blog.status === "published"
                                    ? "Move to Draft"
                                    : "Publish Post"
                                }
                              >
                                {blog.status === "published" ? (
                                  <FaToggleOn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                ) : (
                                  <FaToggleOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                )}
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setDeleteConfirm(blog._id)}
                                className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Post"
                              >
                                <FaTrash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {blogsData && blogsData.total > limit && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(blogsData.total / limit)}
                    onPageChange={handlePageChange}
                    isLoading={isLoading}
                  />

                  <motion.div
                    className="text-center mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-sm text-gray-500">
                      Showing {(currentPage - 1) * limit + 1} to{" "}
                      {Math.min(currentPage * limit, blogsData.total)} of{" "}
                      {blogsData.total} stories
                    </p>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <FaTrash className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Delete Blog Post
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete this blog post? This action
                cannot be undone.
              </p>
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDeleteBlog(deleteConfirm)}
                  className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard;
