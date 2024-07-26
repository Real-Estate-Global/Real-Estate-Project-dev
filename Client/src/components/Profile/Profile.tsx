import styles from "./Profile.module.css";
import { ProfileDataInfoCard } from "../ProfileDataInfoCard/ProfileDataInfoCard";
import { useGetProfileDataQuery } from "../../store/api/auth";

export const Profile = () => {
  const profileDataQuery = useGetProfileDataQuery();
  const profileData = profileDataQuery.data;

  // TODO: loader
  if (!profileData) {
    return null;
  }
  return (
    <div className={styles["profile-wrapper"]}>
      <h1>Моят профил</h1>
      <ProfileDataInfoCard profileData={profileData} />
    </div>
  );
};
