import { apiSlice } from "./apiSlice";

interface Blog {
  _id: string;
  title: string;
  content: string;
  slug: string;
  status: "draft" | "published";
  banner: {
    url: string;
    publicId?: string;
  };
  author: {
    _id: string;
    username: string;
    email: string;
    role: "admin" | "user";
    firstName?: string;
    lastName?: string;
  };
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  publishedAt: string;
  updatedAt: string;
}

interface BlogsResponse {
  limit: number;
  offset: number;
  total: number;
  blogs: Blog[];
}

interface SingleBlogResponse {
  blog: Blog;
}

interface GetBlogsParams {
  limit?: number;
  offset?: number;
}

interface GetBlogsByUserParams extends GetBlogsParams {
  userId: string;
}

interface CreateBlogRequest {
  title: string;
  content: string;
  banner_image: File;
  status?: "draft" | "published";
}

interface UpdateBlogRequest {
  blogId: string;
  title?: string;
  content?: string;
  banner_image?: File;
  status?: "draft" | "published";
}

export const blogApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBlogs: builder.query<BlogsResponse, GetBlogsParams | void>({
      query: (params = {}) => ({
        url: "/blogs",
        method: "GET",
        params: {
          limit: params?.limit || 10,
          offset: params?.offset || 0,
        },
      }),
      providesTags: ["Blog"],
    }),
    getBlogsByUser: builder.query<BlogsResponse, GetBlogsByUserParams>({
      query: ({ userId, ...params }) => ({
        url: `/blogs/user/${userId}`,
        method: "GET",
        params: {
          limit: params.limit || 10,
          offset: params.offset || 0,
        },
      }),
      providesTags: ["Blog"],
    }),
    getBlogBySlug: builder.query<SingleBlogResponse, string>({
      query: (slug) => ({
        url: `/blogs/${slug}`,
        method: "GET",
      }),
      providesTags: ["Blog"],
    }),
    createBlog: builder.mutation<SingleBlogResponse, CreateBlogRequest>({
      query: (blogData) => {
        const formData = new FormData();
        formData.append("title", blogData.title);
        formData.append("content", blogData.content);
        formData.append("banner_image", blogData.banner_image);
        if (blogData.status) {
          formData.append("status", blogData.status);
        }

        return {
          url: "/blogs",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Blog"],
    }),
    updateBlog: builder.mutation<SingleBlogResponse, UpdateBlogRequest>({
      query: ({ blogId, ...blogData }) => {
        const formData = new FormData();
        if (blogData.title) formData.append("title", blogData.title);
        if (blogData.content) formData.append("content", blogData.content);
        if (blogData.banner_image)
          formData.append("banner_image", blogData.banner_image);
        if (blogData.status) formData.append("status", blogData.status);

        return {
          url: `/blogs/${blogId}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Blog"],
    }),
    deleteBlog: builder.mutation<{ message: string }, string>({
      query: (blogId) => ({
        url: `/blogs/${blogId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),
    incrementBlogView: builder.mutation<{ viewsCount: number }, string>({
      query: (blogId) => ({
        url: `/blogs/${blogId}/view`,
        method: "POST",
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const {
  useGetAllBlogsQuery,
  useGetBlogsByUserQuery,
  useGetBlogBySlugQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useIncrementBlogViewMutation,
} = blogApiSlice;
