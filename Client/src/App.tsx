import { Routes, Route, useNavigate } from "react-router-dom";
import { useCallback, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { Header } from "./components/Header/Header";
import { HomePage } from "./components/HomePage";
import { Login } from "./components/Login/Login";
import { SignUp } from "./components/SignUp/SignUp";
import { PublicOfferPage } from "./components/OfferPage/OfferPage";
import { Path } from "./paths";
import { Logout } from "./components/Logout";
import { MyOffers } from "./components/MyOffers/MyOffers";
import { CreateOffer } from "./components/CreateOffer/CreateOffer";
import { MyOfferPage } from "./components/MyOfferPage";
import { EditOfferForm } from "./components/EditOfferForm/EditOfferForm";
import { Profile } from "./components/Profile/Profile";
import { ErrorPopup } from "./components/ErrorPopup/ErrorPopup";
import { Loader } from "./components/Loader";
import { useAppDispatch } from "./store/hooks";
import { authSliceActions } from "./store/slices/auth";
import { loadingSliceActions } from "./store/slices/loading";
import { errorSliceActions } from "./store/slices/error";
import { ErrorType } from "./types/ErrorType";
import { useLoginMutation } from "./store/api/auth";
import { LoginDataType } from "./types/LoginDataType";

function App() {
  const [postCredentials] = useLoginMutation();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const setAuth = useCallback(
    (authToken: string) => {
      dispatch(authSliceActions.setAuth(authToken));
    },
    [dispatch]
  );
  const setLoading = useCallback(
    (isLoading: boolean) => {
      dispatch(loadingSliceActions.setLoading(isLoading));
    },
    [dispatch]
  );
  const setError = useCallback(
    (error: ErrorType) => {
      dispatch(errorSliceActions.setError(error));
    },
    [dispatch]
  );

  useEffect(() => {
    const authFromLocalStorage = window.localStorage.getItem("auth");
    if (authFromLocalStorage) {
      const persistedAuth = JSON.parse(authFromLocalStorage);

      if (persistedAuth) {
        setAuth(persistedAuth);
      }
    }
  }, []);

  // TODO fix username / email?
  const loginSubmitHandler = useCallback(
    async (values: LoginDataType) => {
      try {
        setLoading(true);
        const result = await postCredentials(values);

        if (result.data) {
          setAuth(result.data);
          window.localStorage.setItem("auth", JSON.stringify(result.data));

          navigate(Path.Home);
        }
      } catch (e: any) {
        setError({ hasError: true, message: e.message });
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setAuth]
  );

  return (
    <>
      <Header />
      <ErrorPopup />
      <Loader />
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route
          path="/login"
          element={<Login loginSubmitHandler={loginSubmitHandler} />}
        ></Route>
        <Route
          path="/signup"
          element={<SignUp loginSubmitHandler={loginSubmitHandler} />}
        ></Route>
        <Route path="/properties/:offerId" element={<PublicOfferPage />}></Route>
        <Route path={Path.Logout} element={<Logout />}></Route>
        <Route path={Path.MyOffers} element={<MyOffers />}></Route>
        <Route path={Path.CreateOffer} element={<CreateOffer />}></Route>
        <Route path="/secure/properties/:_id" element={<MyOfferPage />}></Route>
        <Route path="/edit/:_id" element={<EditOfferForm />}></Route>
        <Route path="/myprofile" element={<Profile />}></Route>
      </Routes>
    </>
  );
}

export default App;
