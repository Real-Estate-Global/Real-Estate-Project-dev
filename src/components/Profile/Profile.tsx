import styles from "./Profile.module.css";
import { ProfileDataInfoCard } from "../ProfileDataInfoCard/ProfileDataInfoCard";
import { profileSliceSelectors } from "../../store/slices/profileSlice";
import { useAppSelector } from "../../store/hooks";

export const Profile = () => {
  const profileData = useAppSelector(profileSliceSelectors.profileData);

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
