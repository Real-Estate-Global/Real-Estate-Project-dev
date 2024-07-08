import styles from "./OfferDetails.module.css"

export default function OfferDetails({ isLoading, propertyDetails }) {
    if (isLoading) {
        <div>Loader</div>
    }
    if (!propertyDetails && !isLoading) {
        return null
    }

    return (
        <div className={styles["offer-details-page"]}>
            <h1 className={styles["offer-title"]}>{propertyDetails.propertyType}</h1>
            <div className={styles["offer-details"]}>

                <div className={styles["offer-characteristics"]}>
                    <div className={styles["photo-container"]}>
                        <img className={styles["property-photo"]} src={propertyDetails.img} alt="apartment photo" />
                    </div>
                    <ul className={styles["offer-specs"]}>
                    <li className={styles["right-positioned-specs"]}>{propertyDetails.location}, {propertyDetails.district}</li>
                    <li className={styles["right-positioned-specs"]}>{` Цена: ${propertyDetails.price} ${propertyDetails.currency === "EUR" ? " €" : " лв."}`}</li>
                    <li className={styles["right-positioned-specs"]}>{`Площ: ${propertyDetails.area} кв.м.`}</li>
                    <li className={styles["right-positioned-specs"]}>{`Година на строителство: ${propertyDetails.yearOfBuilding}`}</li>
                    </ul>
                </div>
                <div className={styles["offer-description-li"]}>
                    <p className={styles["offer-description-page"]}>{propertyDetails.description}</p>
                </div>

            </div>
        </div>
    )
}
