import { OfferType } from "../../types/OfferType";
import styles from "./OfferDetails.module.css";
import { DateTime } from 'luxon'

type Props = {
  offerDetails?: OfferType;
};

export const OfferDetails: React.FC<Props> = ({ offerDetails }) => {
  if (!offerDetails) {
    return null;
  }

  return (
    <div className={styles["offer-details-page"]}>
      <h1 className={styles["offer-title"]}>{offerDetails.propertyType}</h1>
      <div className={styles["offer-details"]}>
        <div className={styles["offer-characteristics"]}>
          <div className={styles["photo-container"]}>
            <img
              className={styles["property-photo"]}
              src={offerDetails.img}
              alt="apartment photo"
            />
          </div>
          <ul className={styles["offer-specs"]}>
            <li className={styles["right-positioned-specs"]}>
              {offerDetails.location}, {offerDetails.district}
            </li>
            <li
              className={styles["right-positioned-specs"]}
            >{` Цена: ${offerDetails.price} ${offerDetails.currency === "EUR" ? " €" : " лв."}`}</li>
            <li
              className={styles["right-positioned-specs"]}
            >{`Площ: ${offerDetails.area} кв.м.`}</li>
            <li
              className={styles["right-positioned-specs"]}
            >{`Година на строителство: ${offerDetails.yearOfBuilding}`}</li>
          </ul>
        </div>
        <div className={styles["offer-description-li"]}>
          <p className={styles["offer-description-page"]}>
            {offerDetails.description}
          </p>
        </div>
      </div>
    </div>
  );
};
