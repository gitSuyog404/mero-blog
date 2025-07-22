import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRefreshTokenMutation } from "../../redux/slices/authApiSlice";
import { setAccessToken, logout } from "../../redux/slices/authSlice";
import type { RootState } from "../../redux/store";

interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { userInfo, accessToken } = useSelector(
    (state: RootState) => state.auth
  );
  const [refreshToken] = useRefreshTokenMutation();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUserInfo = localStorage.getItem("userInfo");

      if (storedUserInfo && !userInfo) {
        try {
          const result = await refreshToken().unwrap();
          dispatch(setAccessToken(result.accessToken));
        } catch (error) {
          localStorage.removeItem("userInfo");
          dispatch(logout());
        }
      } else if (userInfo && !accessToken) {
        try {
          const result = await refreshToken().unwrap();
          dispatch(setAccessToken(result.accessToken));
        } catch (error) {
          dispatch(logout());
        }
      }
    };

    initializeAuth();
  }, [userInfo, accessToken, refreshToken, dispatch]);

  return <>{children}</>;
};

export default AuthInitializer;
