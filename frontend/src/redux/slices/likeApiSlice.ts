import { apiSlice } from "./apiSlice";

interface LikeBlogRequest {
  blogId: string;
}

interface UnlikeBlogRequest {
  blogId: string;
}

interface LikeBlogResponse {
  likesCount: number;
}

interface CheckLikeStatusRequest {
  blogId: string;
}

interface CheckLikeStatusResponse {
  isLiked: boolean;
}

export const likeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    likeBlog: builder.mutation<LikeBlogResponse, LikeBlogRequest>({
      query: ({ blogId }) => ({
        url: `/likes/blog/${blogId}`,
        method: "POST",
      }),
      invalidatesTags: ["Blog"],
    }),
    unlikeBlog: builder.mutation<{ success: boolean }, UnlikeBlogRequest>({
      query: ({ blogId }) => ({
        url: `/likes/blog/${blogId}`,
        method: "DELETE",
      }),
      transformResponse: () => ({ success: true }),
      invalidatesTags: ["Blog"],
    }),
    checkLikeStatus: builder.query<
      CheckLikeStatusResponse,
      CheckLikeStatusRequest
    >({
      query: ({ blogId }) => ({
        url: `/likes/blog/${blogId}/status`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLikeBlogMutation,
  useUnlikeBlogMutation,
  useCheckLikeStatusQuery,
} = likeApiSlice;
