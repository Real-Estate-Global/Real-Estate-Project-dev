import { Routes, Route, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef } from "react";
import "./App.css";
import "./styles/index.css";

import { Header } from "./components/Header/Header";
import { Path } from "./paths";
import { Loader } from "./components/Loader";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { authSliceActions, authSliceSelectors } from "./store/slices/auth";
import { useGetProfileDataMutation, useLoginMutation } from "./store/api/user";
import { LoginDataType } from "./types/LoginDataType";
import { loginSubmitHandler } from "./utils/login";
import Cookies from "js-cookie";
import { ExtendedFetch } from './utils/fetch'
import { profileSliceActions } from "./store/slices/profileSlice";
import { Footer } from "./components/Footer/Footer"
import { NotificationsContainer, NotificationManager } from "./components/Notifications";

function App() {
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [getProfileData, { isLoading: isGetProfileDataLoading }] = useGetProfileDataMutation();
  const isAuthenticated = useAppSelector(authSliceSelectors.isAuthenticated);

  const onGetProfileData = async () => {
    try {
      const result = await getProfileData();
      if (result.data) {
        dispatch(profileSliceActions.setProfileData(result.data));
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      NotificationManager.showError({ message: "Неуспешно взимане на данни за профила." });
    }
  };
  const setAuth = useCallback(
    (accessToken: string) => {
      dispatch(authSliceActions.setAuth({ accessToken }));
    },
    [dispatch]
  );

  useEffect(() => {
    if (isAuthenticated) {
      onGetProfileData();
    }
  }, [isAuthenticated])
  useEffect(() => {
    ExtendedFetch.buildInstance({ navigate, setAuth });
  }, [navigate, setAuth])
  useEffect(() => {
    const authFromCookies = Cookies.get("auth");

    if (authFromCookies) {
      setAuth(authFromCookies);
    }
  }, []);

  const onLoginSuccess = useCallback(
    async (accessToken: string) => {
      onGetProfileData();

      setAuth(accessToken);
      navigate(Path.Home);

      NotificationManager.showSuccess({
        message: "Успешно влязохте в профила си!",
      });
    }, [])
  const onLoginSubmit =
    async (values: LoginDataType) => {
      loginSubmitHandler({
        values,
        successCb: onLoginSuccess,
        login
      })
    }

  return (
    <>
      <Header />
      <Loader show={isLoginLoading || isGetProfileDataLoading} />
      <NotificationsContainer />
      <Footer />
    </>
  );
}

export default App;
