import { Routes, Route, useNavigate } from "react-router-dom";
import { useCallback, useEffect } from "react";
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
import { useAppDispatch } from "./store/hooks";
import { authSliceActions } from "./store/slices/auth";
import { useGetProfileDataQuery, useLoginMutation } from "./store/api/user";
import { LoginDataType } from "./types/LoginDataType";
import { loginSubmitHandler } from "./utils/login";
import Cookies from "js-cookie";
import { ExtendedFetch } from './utils/fetch'
import { profileSliceActions } from "./store/slices/profileSlice";
import { Footer } from "./components/Footer/Footer";

function App() {
  const [login, { isLoading, isError }] = useLoginMutation();
  const navigate = useNavigate();
  const profileDataQuery = useGetProfileDataQuery();
  const profileData = profileDataQuery.data;
  console.log('profileData', profileData)
  useEffect(() => {
    if (profileData) {
      dispatch(profileSliceActions.setProfileData(profileData));
    }
}, [profileData])
  
  useEffect(() => {
    ExtendedFetch.buildInstance(navigate);
  }, [navigate])
  const dispatch = useAppDispatch();
  const setAuth = useCallback(
    (accessToken: string) => {
      dispatch(authSliceActions.setAuth({ accessToken }));
    },
    [dispatch]
  );

  useEffect(() => {
    const authFromCookies = Cookies.get("auth");

    if (authFromCookies) {
      setAuth(authFromCookies);
      // dispatch(authSliceActions.setAuth({ accessToken: authFromCookies }));
    }
  }, []);

  const onLoginSuccess = useCallback(
    (accessToken: string) => {
      setAuth(accessToken);
      navigate(Path.Home);
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
      <Loader show={isLoading} />
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
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
        <Route path={Path.MyOffers} element={<MyOffers />}></Route>
        <Route path="/secure/properties/:_id" element={<MyOfferPage />}></Route>
        <Route path={Path.MyProfile} element={<Profile />}></Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
