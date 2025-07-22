import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import BlogCard from "../../components/BlogCard/BlogCard";
import { BlogCardSkeleton } from "../../components/Loader/Loader";
import { useGetAllBlogsQuery } from "../../redux/slices/blogApiSlice";
import type { RootState } from "../../redux/store";

const Homepage = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const {
    data: blogsData,
    isLoading,
    error,
  } = useGetAllBlogsQuery({ limit: 6, offset: 0 }, { skip: !userInfo });

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

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Welcome to MeroBlog
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover stories, thinking, and expertise from writers on any topic.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              to={userInfo ? "/blogs" : "/login"}
              className="bg-gray-900 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors duration-200 inline-block"
            >
              {userInfo ? "Start Reading" : "Sign In to Read"}
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <motion.h2
              className="text-3xl font-bold text-gray-900"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Featured Stories
            </motion.h2>
            {userInfo && (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Link
                  to="/blogs"
                  className="text-gray-900 hover:text-gray-700 font-medium transition-colors duration-200"
                >
                  View all stories →
                </Link>
              </motion.div>
            )}
          </div>

          {!userInfo ? (
            <motion.div
              className="text-center py-12"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Sign in to read stories
                </h3>
                <p className="text-gray-600 mb-4">
                  Join our community to discover amazing stories from writers
                  around the world.
                </p>
                <div className="flex space-x-3 justify-center">
                  <Link
                    to="/login"
                    className="bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-white text-gray-900 border border-gray-300 px-6 py-2 rounded-full hover:bg-gray-50 transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : isLoading ? (
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <BlogCardSkeleton key={item} />
              ))}
            </motion.div>
          ) : error ? (
            <motion.div
              className="text-center py-12"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-gray-600">
                Failed to load stories. Please try again later.
              </p>
            </motion.div>
          ) : blogsData?.blogs && blogsData.blogs.length > 0 ? (
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {blogsData.blogs.slice(0, 6).map((blog) => (
                <BlogCard key={blog._id} blog={blog} variant="default" />
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-12"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-gray-600">No stories available yet.</p>
              <Link
                to="/write"
                className="text-gray-900 hover:text-gray-700 font-medium mt-2 inline-block"
              >
                Be the first to write a story →
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Join Our Community
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Connect with writers and readers from around the world.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button className="w-full sm:w-auto bg-gray-900 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors duration-200">
              Sign Up
            </button>
            <button className="w-full sm:w-auto border border-gray-300 text-gray-700 px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-50 transition-colors duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
