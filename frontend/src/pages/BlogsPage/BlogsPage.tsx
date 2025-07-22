import { useState } from "react";
import { motion } from "framer-motion";
import BlogCard from "../../components/BlogCard/BlogCard";
import Pagination from "../../components/Pagination/Pagination";
import { BlogCardSkeleton } from "../../components/Loader/Loader";
import { useGetAllBlogsQuery } from "../../redux/slices/blogApiSlice";
import { Link } from "react-router-dom";

export default function BlogsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12;
  const offset = (currentPage - 1) * limit;

  const {
    data: blogsData,
    isLoading,
    error,
  } = useGetAllBlogsQuery({ limit, offset });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = blogsData ? Math.ceil(blogsData.total / limit) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            All Stories
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Explore our collection of stories from writers around the world
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading && currentPage === 1 ? (
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {Array.from({ length: limit }).map((_, index) => (
                <BlogCardSkeleton key={index} />
              ))}
            </motion.div>
          ) : error ? (
            <motion.div
              className="text-center py-12"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Failed to load stories
                </h3>
                <p className="text-gray-600 mb-4">
                  We couldn't load the stories. Please try again later.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          ) : blogsData?.blogs && blogsData.blogs.length > 0 ? (
            <>
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {blogsData.blogs.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} variant="default" />
                ))}
              </motion.div>

              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
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
            </>
          ) : (
            <motion.div
              className="text-center py-12"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No stories yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Be the first to share your story with the community.
                </p>
                <Link
                  to="/write"
                  className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 inline-block"
                >
                  Write a Story
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
