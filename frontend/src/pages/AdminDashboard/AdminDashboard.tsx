import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import Pagination from "../../components/Pagination/Pagination";
import {
  useGetAllUsersQuery,
  useGetAllBlogsAdminQuery,
  useDeleteUserMutation,
  useDeleteBlogAdminMutation,
} from "../../redux/slices/adminApiSlice";

import Sidebar from "../../components/Sidebar/Sidebar";
import {
  FaUsers,
  FaFileAlt,
  FaTrash,
  FaEye,
  FaCrown,
  FaCalendarAlt,
  FaGlobe,
  FaBars,
  FaSearch,
  FaHeart,
  FaComment,
  FaChartBar,
} from "react-icons/fa";
import type { RootState } from "../../redux/store";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    if (userInfo.role !== "admin") {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
      return;
    }
  }, [userInfo, navigate]);
  const [activeTab, setActiveTab] = useState<"users" | "blogs">("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "user" | "blog";
    id: string;
    name: string;
  } | null>(null);

  const [usersPage, setUsersPage] = useState(1);
  const [blogsPage, setBlogsPage] = useState(1);
  const itemsPerPage = 10;

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const {
    data: usersData,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useGetAllUsersQuery({
    limit: itemsPerPage,
    offset: (usersPage - 1) * itemsPerPage,
  });

  const {
    data: blogsData,
    isLoading: blogsLoading,
    refetch: refetchBlogs,
  } = useGetAllBlogsAdminQuery({
    limit: itemsPerPage,
    offset: (blogsPage - 1) * itemsPerPage,
  });

  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();
  const [deleteBlog, { isLoading: isDeletingBlog }] =
    useDeleteBlogAdminMutation();

  const handleUsersPageChange = (page: number) => {
    setUsersPage(page);
  };

  const handleBlogsPageChange = (page: number) => {
    setBlogsPage(page);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      if (deleteConfirm.type === "user") {
        await deleteUser(deleteConfirm.id).unwrap();
        toast.success("User deleted successfully!");
        refetchUsers();
      } else {
        await deleteBlog(deleteConfirm.id).unwrap();
        toast.success("Blog deleted successfully!");
        refetchBlogs();
      }
      setDeleteConfirm(null);
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(
        error?.data?.message || `Failed to delete ${deleteConfirm.type}`
      );
    }
  };

  const getDisplayName = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user?.firstName) {
      return user.firstName;
    } else if (user?.lastName) {
      return user.lastName;
    }
    return user?.username || "";
  };

  const getInitials = (user: any) => {
    const displayName = getDisplayName(user);
    return displayName
      .split(" ")
      .map((word: string) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredUsers =
    usersData?.users?.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getDisplayName(user).toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const filteredBlogs =
    blogsData?.blogs?.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.username.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const tabVariants = {
    inactive: { scale: 1, opacity: 0.7 },
    active: { scale: 1.05, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <Sidebar
          className="hidden lg:flex"
          isMobileOpen={isMobileSidebarOpen}
          onMobileToggle={toggleMobileSidebar}
        />

        <div className="flex-1 transition-all duration-300">
          <motion.div
            className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sm:py-6"
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
                  <div className="flex items-center space-x-2 mb-1">
                    <FaCrown className="w-6 h-6 text-yellow-500" />
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                      Admin Dashboard
                    </h1>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600">
                    Manage users and content across the platform
                  </p>
                </div>
              </div>

              <div className="flex-shrink-0 w-full sm:w-auto">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <div className="p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100"
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                        Total Users
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {usersData?.total || 0}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Platform members
                      </p>
                    </div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <FaUsers className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100"
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                        Total Blogs
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {blogsData?.total || 0}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Published content
                      </p>
                    </div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <FaFileAlt className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100"
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                        Total Views
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {blogsData?.blogs?.reduce(
                          (sum, blog) => sum + (blog.viewsCount || 0),
                          0
                        ) || 0}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Blog views</p>
                    </div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <FaChartBar className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100"
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                        Total Likes
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {blogsData?.blogs?.reduce(
                          (sum, blog) => sum + (blog.likesCount || 0),
                          0
                        ) || 0}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Blog likes</p>
                    </div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <FaHeart className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-4 sm:px-6">
                    <motion.button
                      onClick={() => setActiveTab("users")}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === "users"
                          ? "border-gray-900 text-gray-900"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                      variants={tabVariants}
                      animate={activeTab === "users" ? "active" : "inactive"}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-2">
                        <FaUsers className="w-4 h-4" />
                        <span>Users ({usersData?.total || 0})</span>
                      </div>
                    </motion.button>
                    <motion.button
                      onClick={() => setActiveTab("blogs")}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === "blogs"
                          ? "border-gray-900 text-gray-900"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                      variants={tabVariants}
                      animate={activeTab === "blogs" ? "active" : "inactive"}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-2">
                        <FaFileAlt className="w-4 h-4" />
                        <span>Blogs ({blogsData?.total || 0})</span>
                      </div>
                    </motion.button>
                  </nav>
                </div>
              </motion.div>

              <AnimatePresence mode="wait">
                {activeTab === "users" ? (
                  <motion.div
                    key="users"
                    className="bg-white rounded-lg shadow-sm border border-gray-100"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900">
                        User Management
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Manage all users on the platform
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      {usersLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader
                            size="lg"
                            variant="dots"
                            text="Loading users..."
                          />
                        </div>
                      ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-12">
                          <FaUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No users found</p>
                        </div>
                      ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                              </th>
                              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                              </th>
                              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Joined
                              </th>
                              <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user, index) => (
                              <motion.tr
                                key={user._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <motion.div
                                      className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 shadow-md"
                                      whileHover={{ scale: 1.1 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      {getInitials(user)}
                                    </motion.div>
                                    <div className="ml-4 min-w-0">
                                      <div className="text-sm font-medium text-gray-900 truncate">
                                        {getDisplayName(user)}
                                      </div>
                                      <div className="text-sm text-gray-500 truncate">
                                        @{user.username}
                                      </div>
                                      <div className="text-sm text-gray-500 truncate">
                                        {user.email}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      user.role === "admin"
                                        ? "bg-gray-900 text-white"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {user.role === "admin" && (
                                      <FaCrown className="w-3 h-3 mr-1" />
                                    )}
                                    {user.role}
                                  </span>
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <FaCalendarAlt className="w-4 h-4 mr-2" />
                                    {new Date(
                                      user.createdAt
                                    ).toLocaleDateString()}
                                  </div>
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex items-center justify-end space-x-2">
                                    {user.socialLinks?.website && (
                                      <motion.a
                                        href={user.socialLinks.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        title="Visit Website"
                                      >
                                        <FaGlobe className="w-4 h-4" />
                                      </motion.a>
                                    )}
                                    <motion.button
                                      onClick={() =>
                                        setDeleteConfirm({
                                          type: "user",
                                          id: user._id,
                                          name: getDisplayName(user),
                                        })
                                      }
                                      disabled={
                                        user.role === "admin" || isDeletingUser
                                      }
                                      className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      title={
                                        user.role === "admin"
                                          ? "Cannot delete admin"
                                          : "Delete User"
                                      }
                                    >
                                      <FaTrash className="w-4 h-4" />
                                    </motion.button>
                                  </div>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>

                    {usersData && usersData.total > itemsPerPage && (
                      <div className="px-4 sm:px-6 py-4 border-t border-gray-100">
                        <Pagination
                          currentPage={usersPage}
                          totalPages={Math.ceil(usersData.total / itemsPerPage)}
                          onPageChange={handleUsersPageChange}
                          isLoading={usersLoading}
                        />

                        <div className="text-center mt-4">
                          <p className="text-sm text-gray-500">
                            Showing {(usersPage - 1) * itemsPerPage + 1} to{" "}
                            {Math.min(
                              usersPage * itemsPerPage,
                              usersData.total
                            )}{" "}
                            of {usersData.total} users
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="blogs"
                    className="bg-white rounded-lg shadow-sm border border-gray-100"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Blog Management
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Manage all blog posts on the platform
                      </p>
                    </div>

                    <div className="p-4 sm:p-6">
                      {blogsLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader
                            size="lg"
                            variant="dots"
                            text="Loading blogs..."
                          />
                        </div>
                      ) : filteredBlogs.length === 0 ? (
                        <div className="text-center py-12">
                          <FaFileAlt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No blogs found</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {filteredBlogs.map((blog, index) => (
                            <motion.div
                              key={blog._id}
                              className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{
                                scale: 1.01,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              }}
                            >
                              <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                                  <img
                                    src={blog.banner.url}
                                    alt={blog.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                                        {blog.title}
                                      </h4>
                                      <p className="text-xs text-gray-500 mb-2">
                                        by @{blog.author.username} •{" "}
                                        {new Date(
                                          blog.publishedAt
                                        ).toLocaleDateString()}
                                      </p>
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                          <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                              blog.status === "published"
                                                ? "bg-gray-900 text-white"
                                                : "bg-gray-200 text-gray-800"
                                            }`}
                                          >
                                            {blog.status}
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                                          <div
                                            className="flex items-center space-x-1"
                                            title="Views"
                                          >
                                            <FaChartBar className="w-3 h-3 text-gray-600" />
                                            <span>{blog.viewsCount || 0}</span>
                                          </div>
                                          <div
                                            className="flex items-center space-x-1"
                                            title="Likes"
                                          >
                                            <FaHeart className="w-3 h-3 text-gray-600" />
                                            <span>{blog.likesCount || 0}</span>
                                          </div>
                                          <div
                                            className="flex items-center space-x-1"
                                            title="Comments"
                                          >
                                            <FaComment className="w-3 h-3 text-gray-600" />
                                            <span>
                                              {blog.commentsCount || 0}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-1 ml-2">
                                      <motion.a
                                        href={`/blog/${blog.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        title="View Blog"
                                      >
                                        <FaEye className="w-3.5 h-3.5" />
                                      </motion.a>
                                      <motion.button
                                        onClick={() =>
                                          setDeleteConfirm({
                                            type: "blog",
                                            id: blog._id,
                                            name: blog.title,
                                          })
                                        }
                                        disabled={isDeletingBlog}
                                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        title="Delete Blog"
                                      >
                                        <FaTrash className="w-3.5 h-3.5" />
                                      </motion.button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    {blogsData && blogsData.total > itemsPerPage && (
                      <div className="px-4 sm:px-6 py-4 border-t border-gray-100">
                        <Pagination
                          currentPage={blogsPage}
                          totalPages={Math.ceil(blogsData.total / itemsPerPage)}
                          onPageChange={handleBlogsPageChange}
                          isLoading={blogsLoading}
                        />

                        <div className="text-center mt-4">
                          <p className="text-sm text-gray-500">
                            Showing {(blogsPage - 1) * itemsPerPage + 1} to{" "}
                            {Math.min(
                              blogsPage * itemsPerPage,
                              blogsData.total
                            )}{" "}
                            of {blogsData.total} blogs
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaTrash className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete {deleteConfirm.type}
                  </h3>
                  <p className="text-sm text-gray-500">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">"{deleteConfirm.name}"</span>?
              </p>
              <div className="flex items-center justify-end space-x-3">
                <motion.button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleDeleteConfirm}
                  disabled={isDeletingUser || isDeletingBlog}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isDeletingUser || isDeletingBlog ? "Deleting..." : "Delete"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
