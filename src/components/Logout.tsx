import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Path } from "../paths";
import { useLogoutMutation } from "../store/api/auth";
import { useAppDispatch } from "../store/hooks";
import { authSliceActions, authSliceSelectors } from "../store/slices/auth";
import { useSelector } from "react-redux";

export const Logout = () => {
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector(authSliceSelectors.isAuthenticated);

  const setAuth = useCallback(
    (authToken: string) => {
      dispatch(authSliceActions.setAuth(authToken));
    },
    [dispatch]
  );

  // TODO: add loader and error hanlding
  const logoutHandler = useCallback(async () => {
    logout()
      .then(() => {
        // TODO : error handling on fail
        setAuth("");
        localStorage.removeItem("auth");
        navigate(Path.Home);
      })
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      logoutHandler();
    }
  }, [isAuthenticated]);
  return null;
};
