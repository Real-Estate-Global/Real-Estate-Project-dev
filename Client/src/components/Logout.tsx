import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { logout } from "../services/authService"
import AuthContext from "../contexts/authContext"
import Path from "../paths"

export default function Logout() {
    const {token, setAuth} = useContext(AuthContext)
    const navigate = useNavigate()
    const logoutHandler = async () => {
        logout(token)
            .then(setAuth({}))
            .then(localStorage.removeItem('auth')) // call this if 403 on any request
            .then(navigate(Path.Home))
    }

    useEffect(() => {
        logoutHandler()
    }, [])
    return null
}
