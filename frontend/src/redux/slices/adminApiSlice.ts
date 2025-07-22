import { apiSlice } from "./apiSlice";

interface User {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  firstName?: string;
  lastName?: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    x?: string;
    youtube?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Blog {
  _id: string;
  title: string;
  content: string;
  slug: string;
  status: "draft" | "published";
  banner: {
    url: string;
    public_id: string;
  };
  author: {
    _id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  publishedAt: string;
  updatedAt: string;
}

interface GetAllUsersParams {
  limit?: number;
  offset?: number;
}

interface GetAllUsersResponse {
  users: User[];
  total: number;
  limit: number;
  offset: number;
}

interface GetAllBlogsParams {
  limit?: number;
  offset?: number;
}

interface GetAllBlogsResponse {
  blogs: Blog[];
  total: number;
  limit: number;
  offset: number;
}

interface GetUserByIdResponse {
  user: User;
}

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<GetAllUsersResponse, GetAllUsersParams | void>({
      query: (params = {}) => ({
        url: "/users",
        method: "GET",
        params: {
          limit: params?.limit || 10,
          offset: params?.offset || 0,
        },
      }),
      providesTags: ["User"],
    }),
    getUserById: builder.query<GetUserByIdResponse, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    deleteUser: builder.mutation<{ message: string }, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    getAllBlogsAdmin: builder.query<
      GetAllBlogsResponse,
      GetAllBlogsParams | void
    >({
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
    deleteBlogAdmin: builder.mutation<{ message: string }, string>({
      query: (blogId) => ({
        url: `/blogs/${blogId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),
    incrementBlogViewAdmin: builder.mutation<{ viewsCount: number }, string>({
      query: (blogId) => ({
        url: `/blogs/${blogId}/view`,
        method: "POST",
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useDeleteUserMutation,
  useGetAllBlogsAdminQuery,
  useDeleteBlogAdminMutation,
  useIncrementBlogViewAdminMutation,
} = adminApiSlice;
