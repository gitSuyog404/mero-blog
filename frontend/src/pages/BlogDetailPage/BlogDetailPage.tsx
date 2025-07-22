import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  useGetBlogBySlugQuery,
  useIncrementBlogViewMutation,
} from "../../redux/slices/blogApiSlice";
import {
  useLikeBlogMutation,
  useUnlikeBlogMutation,
  useCheckLikeStatusQuery,
} from "../../redux/slices/likeApiSlice";
import CommentSection from "../../components/CommentSection/CommentSection";
import Loader from "../../components/Loader/Loader";
import type { RootState } from "../../redux/store";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: blogData, isLoading, error } = useGetBlogBySlugQuery(slug!);
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

  const [viewsCount, setViewsCount] = useState(0);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  const [likeBlog] = useLikeBlogMutation();
  const [unlikeBlog] = useUnlikeBlogMutation();
  const [incrementBlogView] = useIncrementBlogViewMutation();

  const { data: likeStatus } = useCheckLikeStatusQuery(
    { blogId: blogData?.blog._id || "" },
    { skip: !blogData?.blog._id || !userInfo }
  );

  useEffect(() => {
    if (blogData?.blog) {
      setLikesCount(blogData.blog.likesCount || 0);
      setViewsCount(blogData.blog.viewsCount || 0);
    }
  }, [blogData]);

  useEffect(() => {
    if (likeStatus) {
      setIsLiked(likeStatus.isLiked);
    }
  }, [likeStatus]);

  useEffect(() => {
    const trackView = async () => {
      if (blogData?.blog && userInfo && !hasTrackedView) {
        try {
          const response = await incrementBlogView(blogData.blog._id).unwrap();
          setViewsCount(response.viewsCount);
          setHasTrackedView(true);
        } catch (error) {
          console.error("Error tracking blog view:", error);
        }
      }
    };

    trackView();
  }, [blogData, userInfo, hasTrackedView, incrementBlogView]);

  const handleLike = async () => {
    if (!userInfo || isLiking) return;

    setIsLiking(true);
    try {
      if (isLiked) {
        await unlikeBlog({
          blogId: blogData!.blog._id,
        }).unwrap();
        setIsLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        const response = await likeBlog({
          blogId: blogData!.blog._id,
        }).unwrap();
        setIsLiked(true);
        setLikesCount(response.likesCount);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, "");
    const wordCount = textContent.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  const getDisplayName = (author: any) => {
    if (author.firstName && author.lastName) {
      return `${author.firstName} ${author.lastName}`;
    } else if (author.firstName) {
      return author.firstName;
    } else if (author.lastName) {
      return author.lastName;
    }
    return author.username;
  };

  if (isLoading) {
    return (
      <motion.div
        className="min-h-screen bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            className="h-10 bg-gray-200 rounded w-3/4 mb-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="h-4 bg-gray-200 rounded w-1/2 mb-8"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.1,
            }}
          />

          <motion.div
            className="h-64 md:h-96 bg-gray-200 rounded-lg mb-8"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />

          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <motion.div
                key={index}
                className="h-4 bg-gray-200 rounded"
                style={{ width: `${Math.random() * 40 + 60}%` }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3 + index * 0.1,
                }}
              />
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Loader size="lg" variant="dots" text="Loading article..." />
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Story not found
          </h2>
          <p className="text-gray-600 mb-6">
            The story you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/blogs"
            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            Browse All Stories
          </Link>
        </div>
      </div>
    );
  }

  if (!blogData?.blog) {
    return null;
  }

  const { blog } = blogData;

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blogs"
            className="text-gray-600 hover:text-gray-900 transition-colors duration-200 inline-flex items-center space-x-2"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Back to Stories</span>
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.header
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {blog.status === "draft" && (
            <div className="mb-4">
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Draft
              </span>
            </div>
          )}

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-full flex items-center justify-center text-lg font-semibold">
              {getDisplayName(blog.author).charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {getDisplayName(blog.author)}
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>@{blog.author.username}</span>
                <span>•</span>
                <span>{formatDate(blog.publishedAt)}</span>
                <span>•</span>
                <span>{getReadingTime(blog.content)} min read</span>
              </div>
            </div>
          </div>
        </motion.header>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img
            src={blog.banner.url}
            alt={blog.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
          />
        </motion.div>

        <motion.div
          className="prose prose-lg max-w-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            fontSize: "18px",
            lineHeight: "1.7",
            color: "#374151",
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </motion.div>

        <motion.footer
          className="mt-12 pt-8 border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-full flex items-center justify-center text-lg font-semibold">
                {getDisplayName(blog.author).charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {getDisplayName(blog.author)}
                </p>
                <p className="text-sm text-gray-500">
                  @{blog.author.username} • Author
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span className="text-sm text-gray-600 font-medium">
                  {viewsCount}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={handleLike}
                  disabled={!userInfo || isLiking}
                  className={`transition-all duration-200 ${
                    isLiked
                      ? "text-red-500 hover:text-red-600"
                      : "text-gray-400 hover:text-gray-600"
                  } ${!userInfo ? "cursor-not-allowed opacity-50" : ""}`}
                  whileHover={{ scale: userInfo ? 1.1 : 1 }}
                  whileTap={{ scale: userInfo ? 0.95 : 1 }}
                >
                  <svg
                    className="w-6 h-6"
                    fill={isLiked ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </motion.button>
                <span className="text-sm text-gray-600 font-medium">
                  {likesCount}
                </span>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.footer>

        <CommentSection blogId={blog._id} />
      </article>
    </div>
  );
}
