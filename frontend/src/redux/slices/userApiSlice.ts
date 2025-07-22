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

interface GetCurrentUserResponse {
  user: User;
}

interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  x?: string;
  youtube?: string;
}

interface UpdateUserResponse {
  user: User;
}

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<GetCurrentUserResponse, void>({
      query: () => ({
        url: "/users/current",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateCurrentUser: builder.mutation<UpdateUserResponse, UpdateUserRequest>({
      query: (userData) => ({
        url: "/users/current",
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User", "Auth"],
    }),
  }),
});

export const { useGetCurrentUserQuery, useUpdateCurrentUserMutation } =
  userApiSlice;
