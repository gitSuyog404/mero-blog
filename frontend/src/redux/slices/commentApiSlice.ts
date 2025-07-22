import { apiSlice } from "./apiSlice";

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

interface CreateCommentRequest {
  blogId: string;
  content: string;
}

interface CreateCommentResponse {
  comment: Comment;
}

interface GetCommentsRequest {
  blogId: string;
}

interface GetCommentsResponse {
  comments: Comment[];
}

interface DeleteCommentRequest {
  commentId: string;
}

export const commentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createComment: builder.mutation<
      CreateCommentResponse,
      CreateCommentRequest
    >({
      query: ({ blogId, content }) => ({
        url: `/comments/blog/${blogId}`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["Blog", "Comment"],
    }),
    getCommentsByBlog: builder.query<GetCommentsResponse, GetCommentsRequest>({
      query: ({ blogId }) => ({
        url: `/comments/blog/${blogId}`,
        method: "GET",
      }),
      providesTags: ["Comment"],
    }),
    deleteComment: builder.mutation<void, DeleteCommentRequest>({
      query: ({ commentId }) => ({
        url: `/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog", "Comment"],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useGetCommentsByBlogQuery,
  useDeleteCommentMutation,
} = commentApiSlice;
