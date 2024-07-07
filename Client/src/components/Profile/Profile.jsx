import { useContext, useState, useEffect } from "react"
import AuthContext from "../../contexts/authContext"
import { getProfileData } from "../../services/authService"
import styles from "./Profile.module.css"
import ProfileDataInfoCard from "../ProfileDataInfoCard/ProfileDataInfoCard"

export default function Profile() {
    const { isAuthenticated, token } = useContext(AuthContext)
    const [profileData, setProfileData] = useState({})
    

    useEffect(() => {
        if (isAuthenticated) {
            getProfileData(token)
                .then(result => {
                    setProfileData(result)
                 })
        }
    }, [isAuthenticated, token])

    return (
        <div className={styles["profile-wrapper"]}>
            <h1>Моят профил</h1>
            <ProfileDataInfoCard profileData={profileData}/>
        </div>
    )
}