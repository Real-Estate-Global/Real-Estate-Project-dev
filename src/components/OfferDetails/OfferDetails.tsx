import { OfferType } from "../../types/OfferType";
// import styles from "./OfferDetails.module.css";
import styles from "./OfferDetails.module.css";

type Props = {
  offerDetails?: OfferType;
};

export const OfferDetails: React.FC<Props> = ({ offerDetails }) => {
  if (!offerDetails) {
    return null;
  }

  return (
    <div className="offer-details-page">
      <h1 className="offer-title">{offerDetails.propertyType}</h1>
      <div className="offer-details">
        <div className="offer-characteristics">
          {/* <div className=""> */}
            {/* <img
              className={styles["property-photo"]}
              src={offerDetails.img}
              alt="apartment photo"
            /> */}
            <div className="collage-container">
              <div className="collage-item large-image">
                <img src="https://cdn.freecodecamp.org/curriculum/cat-photo-app/relaxing-cat.jpg" alt="Building exterior" />
              </div>
              <div className="collage-item small-image">
                <img src="https://cdn.freecodecamp.org/curriculum/cat-photo-app/relaxing-cat.jpg" alt="Living room view" />
              </div>
              <div className="collage-item small-image">
                <img src="https://cdn.freecodecamp.org/curriculum/cat-photo-app/relaxing-cat.jpg" alt="Dining area" />
              </div>
              <div className="collage-item small-image">
                <img src="https://cdn.freecodecamp.org/curriculum/cat-photo-app/relaxing-cat.jpg" alt="Bedroom" />
              </div>
              <div className="collage-item small-image">
                <img src="https://cdn.freecodecamp.org/curriculum/cat-photo-app/relaxing-cat.jpg" alt="Bathroom" />
              </div>
              <div className="collage-item small-image">
                <img src="https://cdn.freecodecamp.org/curriculum/cat-photo-app/relaxing-cat.jpg" alt="Second bedroom" />
              </div>
            </div>
          {/* </div> */}
          
        </div>
        <div className="offer-description-li">
          <p className="offer-description-page">
            {offerDetails.description}
          </p>
          <ul className="offer-specs">
            <li className="right-positioned-specs">
              {offerDetails.location}, {offerDetails.district}
            </li>
            <li
              className="right-positioned-specs"
            >{` Цена: ${offerDetails.price} ${offerDetails.currency === "EUR" ? " €" : " лв."}`}</li>
            <li
              className="right-positioned-specs"
            >{`Площ: ${offerDetails.area} кв.м.`}</li>
            <li
              className="right-positioned-specs"
            >{`Година на строителство: ${offerDetails.yearOfBuilding}`}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
