import { Routes, Route, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef } from "react";
import "./App.css";
import "./styles/index.css";

import { Header } from "./components/Header/Header";
import { HomePage } from "./components/HomePage";
import { Login } from "./components/Login/Login";
import { SignUp } from "./components/SignUp/SignUp";
import { PublicOfferPage } from "./components/OfferPage/PublicOfferPage";
import { Path } from "./paths";
import { Logout } from "./components/Logout";
import { MyOffers } from "./components/MyOffers/MyOffers";
import { MyOfferPage } from "./components/OfferPage/MyOfferPage";
import { Profile } from "./components/Profile/Profile";
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
  const [login, { isLoading: isLoginLoading, isError }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [getProfileData, { isLoading: isGetProfileDataLoading, isError: getProfileDataError }] = useGetProfileDataMutation();
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
        message: "Успено влязхте в профила си!",
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
      <Routes>
        <Route path="/" element={<HomePage onGetProfileData={onGetProfileData} />}></Route>
        <Route
          path="/login"
          element={<Login loginSubmitHandler={onLoginSubmit} />}
        ></Route>
        <Route
          path="/signup"
          element={<SignUp loginSubmitHandler={onLoginSubmit} />}
        ></Route>
        <Route path="/properties/:offerId" element={<PublicOfferPage />}></Route>
        <Route path={Path.Logout} element={<Logout />}></Route>
        <Route path={Path.MyOffers} element={<MyOffers onGetProfileData={onGetProfileData} />}></Route>
        <Route path="/secure/properties/:_id" element={<MyOfferPage />}></Route>
        <Route path={Path.MyProfile} element={<Profile onGetProfileData={onGetProfileData} />}></Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;