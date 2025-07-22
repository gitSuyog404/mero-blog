import React, { useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useGetBlogBySlugQuery,
} from "../../redux/slices/blogApiSlice";
import RichTextEditor from "../../components/RichTextEditor/RichTextEditor";
import type { RootState } from "../../redux/store";

export default function BlogEditorPage() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(slug);

  const { userInfo } = useSelector((state: RootState) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: blogData, isLoading: isLoadingBlog } = useGetBlogBySlugQuery(
    slug!,
    {
      skip: !isEditing,
    }
  );
  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");

  React.useEffect(() => {
    if (isEditing && blogData?.blog) {
      const { blog } = blogData;
      setTitle(blog.title);
      setContent(blog.content);
      setBannerPreview(blog.banner.url);
    }
  }, [isEditing, blogData]);

  React.useEffect(() => {
    if (!userInfo) {
      toast.error("Please log in to create or edit blog posts");
      navigate("/login");
    }
  }, [userInfo, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setBannerImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (publishStatus: "draft" | "published") => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter some content");
      return;
    }

    if (!isEditing && !bannerImage) {
      toast.error("Please select a banner image");
      return;
    }

    try {
      if (isEditing && blogData?.blog) {
        const updateData: any = {
          blogId: blogData.blog._id,
          title: title.trim(),
          content: content.trim(),
          status: publishStatus,
        };

        if (bannerImage) {
          updateData.banner_image = bannerImage;
        }

        await updateBlog(updateData).unwrap();
        toast.success(
          `Blog ${
            publishStatus === "published" ? "published" : "saved as draft"
          } successfully!`
        );
      } else {
        await createBlog({
          title: title.trim(),
          content: content.trim(),
          banner_image: bannerImage!,
          status: publishStatus,
        }).unwrap();
        toast.success(
          `Blog ${
            publishStatus === "published" ? "published" : "saved as draft"
          } successfully!`
        );
      }

      navigate("/blogs");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save blog");
    }
  };

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  if (!userInfo) {
    return null;
  }

  if (isEditing && isLoadingBlog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/blogs")}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {isEditing ? "Edit Story" : "Write a Story"}
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleSubmit("draft")}
                disabled={isCreating || isUpdating}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isCreating || isUpdating ? "Saving..." : "Save Draft"}
              </button>
              <button
                onClick={() => handleSubmit("published")}
                disabled={isCreating || isUpdating}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isCreating || isUpdating ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Banner Image
            </label>

            {bannerPreview ? (
              <div className="relative">
                <img
                  src={bannerPreview}
                  alt="Banner preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg"
                >
                  <span className="text-white font-medium">Change Image</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors duration-200"
              >
                <svg
                  className="w-12 h-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span className="text-gray-600 font-medium">
                  Click to upload banner image
                </span>
                <span className="text-gray-400 text-sm mt-1">
                  PNG, JPG up to 5MB
                </span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your story title..."
              className="w-full text-4xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent resize-none"
              style={{ lineHeight: "1.2" }}
            />
          </div>

          <div className="space-y-2">
            <RichTextEditor
              initialValue={content}
              onChange={handleContentChange}
              placeholder="Tell your story..."
              className="min-h-[500px]"
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
