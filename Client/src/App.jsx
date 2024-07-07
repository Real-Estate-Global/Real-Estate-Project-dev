import { Routes, Route, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import AuthContext from './contexts/authContext'
import ErrorContext from './contexts/errorContext'
import { login } from './services/authService'
import 'bootstrap/dist/css/bootstrap.min.css'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import HomePage from './components/HomePage'
import Login from './components/Login/Login'
import './App.css'
import SignUp from './components/SignUp/SignUp'
import OfferPage from './components/OfferPage/OfferPage'
import Path from './paths'
import Logout from './components/Logout'
import MyOffers from './components/MyOffers/MyOffers'
import CreateOffer from './components/CreateOffer/CreateOffer'
import MyOfferPage from './components/MyOfferPage'
import EditOfferForm from './components/EditOfferForm/EditOfferForm'
import Profile from './components/Profile/Profile'
import ErrorPopup from './components/ErrorPopup/ErrorPopup'
import Loader from './components/Loader'
import LoaderContext from './contexts/loaderContext'

function App() {
  const [auth, setAuth] = useState({})
  const [error, setError] = useState({ hasError: false })
  const [loading, setLoading] = useState({ isLoading: false })
  const navigate = useNavigate()

  useEffect(() => {
    const persistedAuth = JSON.parse(window.localStorage.getItem('auth'))

    if (persistedAuth) {
      setAuth(persistedAuth)
    }
  }, [])

  const loginSubmitHandler = async (values) => {
    try {
      setLoading({ isLoading: true })
      const result = await login(values)
      setAuth(result)
      window.localStorage.setItem('auth', JSON.stringify(result))
      navigate(Path.Home)
    } catch (e) {
      setError({ hasError: true, message: e.message })
    } finally {
      setLoading({ isLoading: false })
    }
  }


  const authContextValues = {
    loginSubmitHandler,
    isAuthenticated: !!auth.accessToken,
    token: auth.accessToken,
    setAuth
  }

  const errorContextValues = {
    error: error,
    setError: setError
  }

  const loadingContextValues = {
    loading,
    setLoading
  }

  return (
    <LoaderContext.Provider value={loadingContextValues}>
      <ErrorContext.Provider value={errorContextValues}>
        <AuthContext.Provider value={authContextValues}>
          <>
            <Header />
            <ErrorPopup />
            <Loader />

            <Routes>
              <Route path="/" element={<HomePage />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/signup" element={<SignUp />}></Route>
              <Route path="/properties/:offerId" element={<OfferPage />}></Route>
              <Route path={Path.Logout} element={<Logout />}></Route>
              <Route path={Path.MyOffers} element={<MyOffers />}></Route>
              <Route path={Path.CreateOffer} element={<CreateOffer />}></Route>
              <Route path="/secure/properties/:_id" element={<MyOfferPage />}></Route>
              <Route path="/edit/:_id" element={<EditOfferForm />}></Route>
              <Route path="/myprofile" element={<Profile />}></Route>

            </Routes>
          </>
        </AuthContext.Provider>
      </ErrorContext.Provider>
    </LoaderContext.Provider>
  )
}

export default App
