import styles from "./ProfileDataInfoCard.module.css";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ProfileDataType } from "../../types/ProfileDataType";

type Props = {
  profileData: ProfileDataType;
};

export const ProfileDataInfoCard: React.FC<Props> = ({ profileData }) => {
  return (
    <>
      <Card className={styles["profile-data-card"]}>
        <form className={styles["profile-data-form"]}>
          <label>Имейл:</label>
          <input type="text" defaultValue={profileData.email}></input>
          <label>Смяна на паролата:</label>
          <input type="text" />
          <label>Име:</label>
          <input type="text" defaultValue={profileData.name}></input>
          <label>Вид на профила:</label>
          <input
            type="text"
            defaultValue={
              profileData.profileType === "individual"
                ? "Частно лице"
                : "Агенция"
            }
          />
          <label>Телефонен номер:</label>
          <input type="text" defaultValue={profileData.phoneNumber} />

          <Button
            className={styles["edit-profile-button"]}
            type="submit"
            value="Редактирай"
          >
            Редактирай
          </Button>
        </form>
      </Card>
    </>
  );
}
