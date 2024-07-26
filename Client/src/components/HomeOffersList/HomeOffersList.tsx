import { OfferCard } from "../OfferCard/OfferCard";
import styles from "./HomeOffersList.module.css";
import { OfferType } from "../../types/OfferType";
import { Loader } from "../Loader";

type Props = {
  offers: OfferType[];
};

export const HomeOffersList: React.FC<Props> = ({ offers }) => {
  return (
    <>
    <Loader />
      <h1 className={styles["offer-list-title"]}>Последни оферти</h1>
      <div className={styles["offer-list-wrapper"]}>
        <div className={styles["best-offers-list"]}>
          {[
            offers.map((offer) => (
              <OfferCard key={offer._id} offer={offer} editEnabled={false} />
            )),
          ]}
        </div>
      </div>
    </>
  );
};
